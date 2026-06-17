import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import biasRoute from "./routes/bias.js";
import eventsRouter from "./routes/events.js";
import newsRouter from "./routes/news.js";
import planRouter from "./routes/plan.js";
import authRouter from "./routes/auth.js";
import aiRouter from "./routes/ai.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.json({ result: "API WORKING..." });
});

// Public routes
app.use("/api/auth", authRouter);
app.use("/api/bias", biasRoute);
app.use("/api/events", eventsRouter);

// Protected routes
app.use("/api/news", newsRouter);
app.use("/api/plan", planRouter);
app.use("/api/ai", aiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
