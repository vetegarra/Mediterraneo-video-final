import { Router } from "express";
import {
  registerUser,
  loginUser,
  listUsers,
  updateUser,
  deleteUser,
  seedAdmin,
  getUser,
} from "../controllers/users.controller.js";

const router = Router();

// Registro y login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin: listar, modificar y eliminar
router.get("/", listUsers);

// Obtener datos de un usuario específico
router.get("/:id", getUser);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


export default router;
