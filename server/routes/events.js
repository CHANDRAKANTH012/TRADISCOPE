import express from "express";
import fetch from "node-fetch";

const router = express.Router();


//Do not touch this route it's of no use:
/* router.get("/", async (req, res) => {
  const headers = {
    Authorization: "Api-Key arJgyXqT.4EuUfiBEXmn9ieGul47nL8gxgcy9dYEU",
    "Content-Type": "application/json",
  };
  const url = "https://www.jblanked.com/news/api/forex-factory/calendar/today/";
  try {
    const response = await fetch(url,{ method: "GET", headers: headers});

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    res.json(data); // Send JSON to frontend
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}); */



export default router;
