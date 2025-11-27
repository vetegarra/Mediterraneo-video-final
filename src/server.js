import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";

import menuRoutes from "./routes/menu.routes.js";
import usersRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

// Parseadores y logs
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));

// Rutas API
app.use("/api/menu", menuRoutes);
app.use("/api/users", usersRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "inicio.html"));
});

// Conexión DB + servidor
const PORT = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI);
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
