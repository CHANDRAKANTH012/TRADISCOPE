import express from "express";
import authenticate from "../middleware/auth.js";
import groqClient from "../config/groq.js";
import User from "../models/User.js";
import AiConversation from "../models/AiConversation.js";

const router = express.Router();
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Builds system prompt with user context
const buildSystemPrompt = (userContext) => {
  const base = `You are Tradie, a sharp and knowledgeable AI trading assistant built into Tradiscope — a professional forex and financial markets platform. You help traders with market analysis, trade planning, risk management, and trading psychology. Be concise, direct, and data-driven. Avoid fluff.`;
  if (userContext && userContext.trim()) {
    return `${base}\n\nUser context (trading profile summary): ${userContext}`;
  }
  return base;
};

// POST /api/ai/chat — protected
router.post("/chat", authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Load user + their conversation
    const [user, convoDoc] = await Promise.all([
      User.findById(req.user.id).select("user_context username"),
      AiConversation.findOne({ userId: req.user.id }),
    ]);

    const storedMessages = convoDoc?.messages || [];
    const messageCount = convoDoc?.messageCount || 0;

    // Keep only last 5 exchanges (10 messages) for context window efficiency
    const recentHistory = storedMessages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const systemPrompt = buildSystemPrompt(user?.user_context);

    // Call Groq
    const aiRes = await groqClient.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...recentHistory,
        { role: "user", content: message.trim() },
      ],
      temperature: 0.5,
      max_tokens: 512,
    });

    const reply = aiRes?.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    // Append new messages to conversation
    const newMessages = [
      { role: "user", content: message.trim(), timestamp: new Date() },
      { role: "assistant", content: reply, timestamp: new Date() },
    ];

    const newCount = messageCount + 2;

    // Upsert conversation
    await AiConversation.findOneAndUpdate(
      { userId: req.user.id },
      {
        $push: { messages: { $each: newMessages } },
        $set: { messageCount: newCount },
      },
      { upsert: true, new: true }
    );

    // Every 20 messages — update user_context with a condensed summary (async)
    if (newCount % 20 === 0) {
      updateUserContext(req.user.id, storedMessages.slice(-20)).catch((e) =>
        console.error("Context update error:", e.message)
      );
    }

    res.json({ reply, messageCount: newCount });
  } catch (err) {
    console.error("AI chat error:", err.message);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

// GET /api/ai/history — protected, last 30 messages
router.get("/history", authenticate, async (req, res) => {
  try {
    const convo = await AiConversation.findOne({ userId: req.user.id }).select("messages messageCount");
    if (!convo) return res.json({ messages: [], messageCount: 0 });

    const last30 = convo.messages.slice(-30);
    res.json({ messages: last30, messageCount: convo.messageCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

// DELETE /api/ai/history — clear conversation
router.delete("/history", authenticate, async (req, res) => {
  try {
    await AiConversation.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { messages: [], messageCount: 0 } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history." });
  }
});

// Internal: summarize recent messages into user_context
async function updateUserContext(userId, recentMessages) {
  const summaryPrompt = recentMessages.map((m) => `${m.role}: ${m.content}`).join("\n");

  const res = await groqClient.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "Summarize the following trading conversation into a brief user profile (max 150 words). Focus on: preferred assets, trading style, risk tolerance, common questions. Return plain text only.",
      },
      { role: "user", content: summaryPrompt },
    ],
    temperature: 0.3,
    max_tokens: 200,
  });

  const summary = res?.choices?.[0]?.message?.content || "";
  if (summary.trim()) {
    await User.findByIdAndUpdate(userId, { user_context: summary.trim() });
  }
}

export default router;
