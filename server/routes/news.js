import express from "express";
import fetch from "node-fetch";
import authenticate from "../middleware/auth.js";
import NewsHistory from "../models/NewsHistory.js";
import groqClient from "../config/groq.js";

const router = express.Router();

// POST /api/news/fetch  — protected
router.post("/fetch", authenticate, async (req, res) => {
  try {
    const { q_data, analysis, trends, insights } = req.body;
    const API_KEY = process.env.NEWSDATA_API_KEY;

    const query = q_data || "forex,stocks,crypto,markets";
    const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=${encodeURIComponent(query)}&language=en`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || "Error fetching news",
      });
    }

    const newsResults = data.results || [];

    // --- AI Analysis (only if any option was requested) ---
    let aiAnalysis = null;
    const wantsAI = analysis || trends || insights;

    if (wantsAI && newsResults.length > 0) {
      // Compress headlines — only title + 80-char snippet, max 5 articles
      const compressed = newsResults.slice(0, 5).map((a, i) => ({
        n: i + 1,
        t: a.title,
        d: (a.description || "").slice(0, 80),
      }));

      const requestedSections = [];
      if (analysis) requestedSections.push("analysis");
      if (trends) requestedSections.push("trends");
      if (insights) requestedSections.push("insights");

      const sectionsStr = requestedSections.join(", ");

      const systemPrompt = `You are a concise financial market analyst. Respond only in valid JSON with exactly these keys: ${requestedSections.map(s => `"${s}"`).join(", ")}. Each value must be a single paragraph under 120 words. No markdown, no extra keys.`;

      const userMsg = `Based on these ${compressed.length} market news headlines, provide ${sectionsStr} for a forex/crypto/stocks trader. Headlines: ${JSON.stringify(compressed)}`;

      const aiRes = await groqClient.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
        temperature: 0.3,
        max_tokens: 600,
      });

      const raw = aiRes?.choices?.[0]?.message?.content || "{}";
      try {
        // Strip any markdown fences if present
        const cleaned = raw.replace(/```json|```/g, "").trim();
        aiAnalysis = JSON.parse(cleaned);
      } catch {
        // Fallback: return raw text under first requested key
        aiAnalysis = { [requestedSections[0]]: raw };
      }
    }

    // Save to NewsHistory (async, non-blocking)
    NewsHistory.create({
      userId: req.user.id,
      query,
      newsItems: newsResults.slice(0, 8).map((a) => ({
        title: a.title,
        description: (a.description || "").slice(0, 200),
        link: a.link,
        pubDate: a.pubDate,
        source_name: a.source_name,
      })),
      aiAnalysis: aiAnalysis || {},
      requestedOptions: { analysis: !!analysis, trends: !!trends, insights: !!insights },
    }).catch((e) => console.error("NewsHistory save error:", e.message));

    res.json({ news: newsResults, aiAnalysis });
  } catch (error) {
    console.error("News fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// GET /api/news/history  — protected, last 10 news fetches for user
router.get("/history", authenticate, async (req, res) => {
  try {
    const history = await NewsHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("query newsItems.title aiAnalysis requestedOptions createdAt");
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

export default router;
