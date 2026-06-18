import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "tradiscope",
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected — tradiscope db");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // Don't exit — let the server stay alive so Render doesn't restart loop
    // Routes that need DB will fail gracefully with 500 errors
  }
};

export default connectDB;
