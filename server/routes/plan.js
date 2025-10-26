// server/routes/plan.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST /api/plan
router.post("/", async (req, res) => {
  try {
    const plan = req.body; // whole plan object from frontend
    // Basic validation
    if (!plan || !plan.pair) {
      return res.status(400).json({ error: "Missing plan or pair field" });
    }

    // Prepare a structured prompt asking for strict JSON output
    const prompt = `
        You are a senior financial market analyst and trading mentor.
        Analyze the following trade plan and respond STRICTLY in valid JSON format with the keys below.

        Return ONLY a JSON object structured like this:
        {
        "summary": string,             // 1–2 line summary of what this trade idea is attempting to capture
        "bias_verdict": "Bullish" | "Bearish" | "Neutral", // overall bias and sentiment based on context
        "risk_reward": string,         // formatted like "1:2" or numeric "2.0"
        "risk_level": "Low" | "Moderate" | "High",  // classify risk based on stop, target, and notes
        "technical_notes": string,     // highlight chart structure, trend, or setup reasoning
        "fundamental_notes": string,   // mention any relevant macro or sentiment-based insight
        "improvements": string,        // 3–4 short actionable improvement tips (entry timing, stop placement, confidence, psychology, etc.)
        "confidence": number           // integer from 1–10, reflecting trade quality and conviction
        }

        Here is the trader’s plan data:
        ${JSON.stringify(plan, null, 2)}

        Guidelines:
        - Keep the tone professional and data-driven.
        - If some data is missing, infer logically but note uncertainty.
        - Avoid repetition or unnecessary text outside the JSON.
        - Be concise but realistic — simulate real trading feedback, not motivational text.
        `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(502).json({ error: "No response from AI" });
    }

    // Try to parse returned content as JSON
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      // Fallback: attempt to extract JSON substring (robustness)
      const first = content.indexOf("{");
      const last = content.lastIndexOf("}");
      if (first !== -1 && last !== -1) {
        try {
          parsed = JSON.parse(content.slice(first, last + 1));
        } catch (err2) {
          // give back raw text if parsing fails
          return res.json({
            raw: content,
            warning: "AI returned non-JSON; returned raw content",
          });
        }
      } else {
        return res.json({
          raw: content,
          warning: "AI returned non-JSON; returned raw content",
        });
      }
    }

    // Return parsed JSON
    res.json({ plan: parsed });
  } catch (error) {
    console.error(
      "Plan route error:",
      error.response?.data || error.message || error
    );
    res.status(500).json({
      error: "Failed to analyze plan",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
