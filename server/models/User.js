import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // AI memory: a short summary of the user's trading style, preferences, history
    user_context: {
      type: String,
      default: "",
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
