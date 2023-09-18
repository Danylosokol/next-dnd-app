import mongoose, { connect } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.length === 0) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let isConnected: boolean = false;

async function connectDB() {
  if (isConnected) {
    console.log("🚀 Using cached connection");
    return;
  }

  try {
    await connect(MONGODB_URI!, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log("✅ New connection established");
  } catch (error) {
    console.error("❌ Connection to database failed:", error);
    throw error;
  }
}

export default connectDB;
