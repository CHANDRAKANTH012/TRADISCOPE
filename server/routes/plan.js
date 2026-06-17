import express from "express";
import client from "../config/groq.js";
import { parseJsonResponse } from "../utils/parseJsonResponse.js";
import authenticate from "../middleware/auth.js";
import TradePlan from "../models/TradePlan.js";

const router = express.Router();

// POST /api/plan  — protected
router.post("/", authenticate, async (req, res) => {
  try {
    const plan = req.body;
    if (!plan || !plan.pair) {
      return res.status(400).json({ error: "Missing plan or pair field" });
    }

    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    const systemInstructionText = `
        You are a senior financial market analyst and trading mentor.
        Your tone must be professional and data-driven.
        If some data is missing from the plan, infer logically but note uncertainty in the relevant field.
        Be concise but realistic — simulate real trading feedback, not motivational text.
    `;

    const planData = JSON.stringify(plan, null, 2);
    const userQuery = `Analyze the following trade plan data and return only a valid JSON object with the keys summary, bias_verdict, risk_reward, risk_level, technical_notes, fundamental_notes, improvements, and confidence. Do not wrap output inside another object, do not use markdown fences or explanatory text, and use valid JSON only. Plan data: ${planData}`;

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemInstructionText },
        { role: "user", content: userQuery },
      ],
      temperature: 0.2,
      max_tokens: 1024,
      n: 1,
    });

    const rawResponse = response?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = parseJsonResponse(rawResponse);
    } catch (err) {
      console.error("Failed to parse Groq response:", rawResponse, err);
      return res.json({
        raw: rawResponse,
        warning: "AI returned non-JSON despite schema request; returned raw content",
      });
    }

    if (parsed?.analysis && typeof parsed.analysis === "object") {
      parsed = parsed.analysis;
    }

    // Save to DB linked to authenticated user
    TradePlan.create({
      userId: req.user.id,
      pair: plan.pair,
      direction: plan.direction,
      entry: plan.entry,
      stop: plan.stop,
      target: plan.target,
      reason: plan.reason,
      marketCondition: plan.marketCondition,
      riskPercent: plan.riskPercent,
      confidence: plan.confidence,
      includeAI: plan.includeAI,
      aiResult: parsed,
    }).catch((e) => console.error("TradePlan save error:", e.message));

    res.json({ plan: parsed });
  } catch (error) {
    console.error("Plan route error:", error.response?.data || error.message || error);
    res.status(500).json({
      error: "Failed to analyze plan",
      details: error.response?.data || error.message,
    });
  }
});

// GET /api/plan/history — protected, user's past plans
router.get("/history", authenticate, async (req, res) => {
  try {
    const plans = await TradePlan.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("pair direction entry stop target aiResult.summary aiResult.bias_verdict aiResult.confidence createdAt");
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plan history." });
  }
});

export default router;
