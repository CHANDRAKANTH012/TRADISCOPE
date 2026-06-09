import express from "express";
import client from "../config/groq.js";
import { parseJsonResponse } from "../utils/parseJsonResponse.js";

const router = express.Router();

// POST /api/plan
router.post("/", async (req, res) => {
  try {
    const plan = req.body; // whole plan object from frontend
    // Basic validation
    if (!plan || !plan.pair) {
      return res.status(400).json({ error: "Missing plan or pair field" });
    }

    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    // 1. Define the System Instruction (Persona & Guidelines)
    // The instructions are moved here to better guide the model's persona independently of the query.
    const systemInstructionText = `
        You are a senior financial market analyst and trading mentor.
        Your tone must be professional and data-driven.
        If some data is missing from the plan, infer logically but note uncertainty in the relevant field.
        Be concise but realistic — simulate real trading feedback, not motivational text.
    `;

    // 2. Define the JSON Schema for strict structured output (replacing prompt text instruction)
    const responseSchema = {
      type: "OBJECT",
      properties: {
        summary: {
          type: "STRING",
          description:
            "1–2 line summary of what this trade idea is attempting to capture",
        },
        bias_verdict: {
          type: "STRING",
          enum: ["Bullish", "Bearish", "Neutral"],
          description: "overall bias and sentiment based on context",
        },
        risk_reward: {
          type: "STRING",
          description: "formatted like '1:2' or numeric '2.0'",
        },
        risk_level: {
          type: "STRING",
          enum: ["Low", "Moderate", "High"],
          description: "classify risk based on stop, target, and notes",
        },
        technical_notes: {
          type: "STRING",
          description: "highlight chart structure, trend, or setup reasoning",
        },
        fundamental_notes: {
          type: "STRING",
          description: "mention any relevant macro or sentiment-based insight",
        },
        improvements: {
          type: "STRING",
          description:
            "3–4 short actionable improvement tips (entry timing, stop placement, confidence, psychology, etc.) but be realistic",
        },
        confidence: {
          type: "NUMBER",
          description:
            "integer from 1–10, reflecting trade quality and conviction",
        },
      },
      required: [
        "summary",
        "bias_verdict",
        "risk_reward",
        "risk_level",
        "technical_notes",
        "fundamental_notes",
        "improvements",
        "confidence",
      ],
      propertyOrdering: [
        "summary",
        "bias_verdict",
        "risk_reward",
        "risk_level",
        "technical_notes",
        "fundamental_notes",
        "improvements",
        "confidence",
      ],
    };

    // 3. Construct the prompt with the plan data
    const planData = JSON.stringify(plan, null, 2);
    const userQuery = `Analyze the following trade plan data and return only a valid JSON object with the keys summary, bias_verdict, risk_reward, risk_level, technical_notes, fundamental_notes, improvements, and confidence. Do not wrap output inside another object, do not use markdown fences or explanatory text, and use valid JSON only. Plan data: ${planData}`;

    // 4. Call the Groq client via OpenAI-compatible chat completions
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
      console.error(
        "Failed to parse expected JSON output from Groq:",
        rawResponse,
        err,
      );
      return res.json({
        raw: rawResponse,
        warning:
          "AI returned non-JSON despite schema request; returned raw content",
      });
    }

    if (parsed?.analysis && typeof parsed.analysis === "object") {
      parsed = parsed.analysis;
    }

    // Return parsed JSON
    res.json({ plan: parsed });
  } catch (error) {
    console.error(
      "Plan route error:",
      error.response?.data || error.message || error,
    );
    res.status(500).json({
      error: "Failed to analyze plan",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
