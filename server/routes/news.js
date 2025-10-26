import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/news", async (req, res) => {
  try {
    const API_KEY = `${process.env.NEWSDATA_API_KEY}`;
    const { q_data } = req.body;
    const url = q_data
      ? `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=${q_data},forex&language=en`
      : `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=forex,stocks,crypto,markets&language=en`;

    const response = await fetch(url);
    const data = await response.json();

    // If NewsData returns an error
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || "Error fetching news",
      });
    }

    // Return only the results array (clean)
    res.json(data.results || []);
  } catch (error) {
    console.error("Backend Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
