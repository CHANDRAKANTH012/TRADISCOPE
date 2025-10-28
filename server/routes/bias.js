import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("bias hit");

  const { asset } = req.body;
  console.log(asset);

  try {
    // --- GEMINI API SETUP ---
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY environment variable not set" });
    }
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
    // -------------------------

    // 1. Define the System Instruction (Enhanced for realism and consistency)
    const systemInstructionText = `
        You are the Chief Macro Strategist for a major institutional fund.
        Your task is to provide a single, consistent, short-term trading bias (Bullish, Bearish, or Neutral) and the reasoning for the requested asset.
        
        CRITICAL: To ensure consistency across requests, always simulate a current macro environment dominated by a single, cohesive narrative (e.g., 'Sticky inflation and strong US labor data').
        Base your analysis on established correlations (e.g., gold vs. real yields, EURUSD vs. rate differentials, JPY vs. risk-off sentiment) and provide a professional, data-driven assessment.
        
        The analysis must be sharp, specific, and avoid wishy-washy language.
    `;

    // 2. Define the JSON Schema (Added momentum_strength for depth)
    const responseSchema = {
      type: "OBJECT",
      properties: {
        bias: {
          type: "STRING",
          enum: ["Bullish", "Bearish", "Neutral"],
          description: "The directional trading bias.",
        },
        reason: {
          type: "STRING",
          description:
            "A realistic and cohesive explanation referencing macro drivers (USD strength, yields, inflation, risk-on/off, etc.).",
        },
        momentum_strength: {
          type: "NUMBER",
          description:
            "An integer from 1 (Weakest) to 10 (Strongest) representing the conviction level or market momentum intensity behind the bias.",
        },
      },
      required: ["bias", "reason", "momentum_strength"],
      propertyOrdering: ["bias", "reason", "momentum_strength"],
    };

    // 3. Construct the prompt
    const userQuery = `Analyze the asset: ${asset} (which is a forex pair, commodity, or index) and generate the short-term trading bias as a strict JSON object.`;

    // 4. Construct the Gemini API payload (Temperature lowered for consistency)
    const apiPayload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] },

      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Set to a low value for deterministic, consistent responses
      },
    };

    // 5. Make the API Call using Axios to the Gemini endpoint
    const response = await axios.post(GEMINI_API_URL, apiPayload);

    // 6. Parsing logic for Gemini's structured output
    const content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      const blockReason =
        response?.data?.promptFeedback?.blockReason || "unknown";
      if (response?.data?.candidates?.length === 0) {
        return res.status(400).json({
          error: `AI response blocked due to safety reasons: ${blockReason}`,
        });
      }
      return res
        .status(502)
        .json({ error: "No structured JSON content found in Gemini response" });
    }

    // The content is expected to be a valid JSON string due to the generationConfig
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (err) {
      console.error(
        "Failed to parse expected JSON output from Gemini:",
        content,
        err
      );
      return res.status(502).json({
        error: "AI returned invalid JSON format",
        raw_content: content,
      });
    }

    // Return parsed JSON
    res.json({ result: parsedContent });
  } catch (error) {
    console.error(
      "Error fetching bias:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch bias",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
