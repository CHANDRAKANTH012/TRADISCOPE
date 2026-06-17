import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const aiConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one conversation thread per user
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("AiConversation", aiConversationSchema);
