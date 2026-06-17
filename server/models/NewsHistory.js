import mongoose from "mongoose";

const newsHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: { type: String, default: "forex,stocks,crypto,markets" },
    // Store compressed news items to avoid huge doc sizes
    newsItems: [
      {
        title: String,
        description: String,
        link: String,
        pubDate: String,
        source_name: String,
      },
    ],
    // AI-generated analysis (only present if user requested it)
    aiAnalysis: {
      analysis: String,
      trends: String,
      insights: String,
    },
    requestedOptions: {
      analysis: Boolean,
      trends: Boolean,
      insights: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("NewsHistory", newsHistorySchema);
