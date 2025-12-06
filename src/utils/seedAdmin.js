// src/utils/seedAdmin.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "../db.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@mediterraneo.cl";
    const pwd = "Clave2025";

    let admin = await User.findOne({ email });

    if (admin) {
      console.log("⚠️ El admin ya existe:", admin.email);
      return;
    }

    const hash = await bcrypt.hash(pwd, 10);

    admin = await User.create({
      name: "Administrador",
      email,
      password: hash,
      role: "Administrador",
      active: true,
    });

    console.log("Admin creado correctamente:", admin.email);

  } catch (err) {
    console.error("Error creando admin:", err);
  } finally {
    await mongoose.disconnect();
    console.log(" MongoDB desconectado");
  }
};

seedAdmin();
