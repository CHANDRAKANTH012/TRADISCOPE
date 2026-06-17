import mongoose from "mongoose";

const tradePlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // User-submitted plan fields
    pair: String,
    direction: String,
    entry: Number,
    stop: Number,
    target: Number,
    reason: String,
    marketCondition: String,
    riskPercent: Number,
    confidence: Number,
    includeAI: Boolean,
    // AI result
    aiResult: {
      summary: String,
      bias_verdict: String,
      risk_reward: String,
      risk_level: String,
      technical_notes: String,
      fundamental_notes: String,
      improvements: String,
      confidence: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TradePlan", tradePlanSchema);
