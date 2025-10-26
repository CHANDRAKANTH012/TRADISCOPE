import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import biasRoute from "./routes/bias.js";
import eventsRouter from "./routes/events.js";
import newsRouter from "./routes/news.js";
import pairRouter from "./routes/news.js";
import planRouter from "./routes/plan.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

// Optional health check route
app.get("/", (req, res) => {
  res.json({ result: "API WORKING..." });
});

app.use("/api/bias", biasRoute);
app.use("/api/events", eventsRouter);
app.use("/api/news", newsRouter);
app.use("/api/pair", pairRouter);
app.use("/api/plan", planRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
