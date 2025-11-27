import { Router } from "express";
import {
  registerUser,
  loginUser,
  listUsers,
  updateUser,
  deleteUser,
  seedAdmin,
  getUser,      // <-- aquí SÍ importas getUser correctamente
} from "../controllers/users.controller.js";

const router = Router();

// Registro y login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin: listar, modificar y eliminar
router.get("/", listUsers);

// Obtener datos de un usuario específico (para perfil.html)
router.get("/:id", getUser);   // <-- ESTA ES LA RUTA NUEVA CORRECTA

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Seed admin
router.post("/seed-admin", seedAdmin);

export default router;
