// src/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mediterraneo";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB conectado:", mongoose.connection.name);
  } catch (error) {
    console.error("Error al conectar Mongo:", error);
    process.exit(1);
  }
};
