import express from "express";
import client from "../config/groq.js";
import { parseJsonResponse } from "../utils/parseJsonResponse.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("bias hit");

  const { asset } = req.body;
  console.log("MESSAGE ARRIVED", asset);

  try {
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    // 1. Define the System Instruction (Enhanced for realism and consistency)
    const systemInstructionText = `You are the Chief Macro Strategist for a major institutional fund. Provide a single short-term trading bias (Bullish, Bearish, or Neutral) and a concise reasoning paragraph referencing macro drivers, correlations, and momentum.`;

    // 2. Define the schema shape for the instruction
    const responseSchema = {
      type: "OBJECT",
      properties: {
        bias: { type: "STRING", enum: ["Bullish", "Bearish", "Neutral"] },
        reason: { type: "STRING" },
        momentum_strength: { type: "NUMBER" },
      },
      required: ["bias", "reason", "momentum_strength"],
    };

    // 3. Construct the prompt
    const userQuery = `Analyze the asset: ${asset} (forex pair, commodity, or index) and return only a strict JSON object with the keys bias, reason, and momentum_strength. Do not include markdown fences, code blocks, or any explanatory text. Use valid JSON only.`;

    // 4. Call the Groq client via OpenAI-compatible chat completions
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemInstructionText },
        { role: "user", content: userQuery },
      ],
      temperature: 0.1,
      max_tokens: 512,
      n: 1,
    });

    const rawResponse = response?.choices?.[0]?.message?.content || "";

    let parsedContent = null;
    try {
      parsedContent = parseJsonResponse(rawResponse);
    } catch (err) {
      console.error(
        "Failed to parse expected JSON output from Groq:",
        rawResponse,
        err,
      );
      return res.status(502).json({
        error: "AI returned non-JSON content",
        raw_content: rawResponse,
      });
    }

    return res.json({ result: parsedContent });
  } catch (error) {
    console.error("Error fetching bias:", error.message || error);
    res.status(500).json({
      error: "Failed to fetch bias",
      details: error.message || error,
    });
  }
});

export default router;
