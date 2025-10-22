import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { asset } = req.body;
  console.log(asset);

  try {
    const prompt = `
        You are a financial market analyst AI.
        Analyze ${asset} (forex/commodity/index) and generate a short-term trading bias.

        Use your macro knowledge and historical correlations to simulate an analysis.
        Respond ONLY in JSON:

        {
          "bias": "Bullish" | "Bearish" | "Neutral",
          "reason": "Give a realistic explanation referencing USD strength, yields, risk sentiment, or inflation."
        }

        Avoid disclaimers about lacking real-time data — just infer from general macro logic.
      `;

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "meta-llama/llama-3-8b-instruct",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Market Bias AI",
          },
        }
    );

      const proto_response = response.data.choices[0].message.content;
      const content = JSON.parse(proto_response);
      console.log(typeof content);
      console.log(content);

       res.json({ result: content });
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
