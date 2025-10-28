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

    // --- GEMINI API SETUP ---
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      // NOTE: Ensure you set GEMINI_API_KEY in your .env file
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable not set" });
    }
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
    // -------------------------


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
        summary: { type: "STRING", description: "1–2 line summary of what this trade idea is attempting to capture" },
        bias_verdict: { type: "STRING", enum: ["Bullish", "Bearish", "Neutral"], description: "overall bias and sentiment based on context" },
        risk_reward: { type: "STRING", description: "formatted like '1:2' or numeric '2.0'" },
        risk_level: { type: "STRING", enum: ["Low", "Moderate", "High"], description: "classify risk based on stop, target, and notes" },
        technical_notes: { type: "STRING", description: "highlight chart structure, trend, or setup reasoning" },
        fundamental_notes: { type: "STRING", description: "mention any relevant macro or sentiment-based insight" },
        improvements: { type: "STRING", description: "3–4 short actionable improvement tips (entry timing, stop placement, confidence, psychology, etc.) but be realistic" },
        confidence: { type: "NUMBER", description: "integer from 1–10, reflecting trade quality and conviction" }
      },
      required: ["summary", "bias_verdict", "risk_reward", "risk_level", "technical_notes", "fundamental_notes", "improvements", "confidence"],
      propertyOrdering: ["summary", "bias_verdict", "risk_reward", "risk_level", "technical_notes", "fundamental_notes", "improvements", "confidence"]
    };

    // 3. Construct the prompt with the plan data
    const userQuery = `Analyze the following trade plan data and return the analysis as a strict JSON object: ${JSON.stringify(plan, null, 2)}`;

    // 4. Construct the Gemini API payload
    const apiPayload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] },

      generationConfig: {
        responseMimeType: "application/json", // Mandates JSON output
        responseSchema: responseSchema,       // Defines the exact structure
        temperature: 0.2,
      }
    };

    // 5. Make the API Call using Axios to the Gemini endpoint
    const response = await axios.post(
      GEMINI_API_URL,
      apiPayload
    );

    // 6. Update response parsing logic for Gemini's structured output
    const content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      // Check for blocked content or missing candidates
      const blockReason = response?.data?.promptFeedback?.blockReason || 'unknown';
      if (response?.data?.candidates?.length === 0) {
        return res.status(400).json({ error: `AI response blocked due to safety reasons: ${blockReason}` });
      }
      return res.status(502).json({ error: "No structured JSON content found in Gemini response" });
    }

    // The content is expected to be a valid JSON string due to the generationConfig
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      // If parsing fails despite the schema, return the raw content for debugging
      console.error("Failed to parse expected JSON output from Gemini:", content, err);
      return res.json({
        raw: content,
        warning: "AI returned non-JSON despite schema request; returned raw content",
      });
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
