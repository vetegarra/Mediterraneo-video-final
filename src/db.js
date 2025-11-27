import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB conectado:", mongoose.connection.name);
  } catch (error) {
    console.error("Error al conectar Mongo:", error);
    process.exit(1);
  }
};