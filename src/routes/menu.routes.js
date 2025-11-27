import { Router } from "express";
import {
  getMenu,
  getDishById,   // ← agregado
  createDish,
  updateDish,
  deleteDish,
  seedMenu       // ← agregado
} from "../controllers/menu.controller.js";

const router = Router();

// Lista y creación
router.get("/", getMenu);
router.post("/", createDish);

// Seed debe ir ANTES de :id, para no colisionar
router.post("/seed", seedMenu);

// Detalle por id
router.get("/:id", getDishById);

// Update/Delete por id
router.put("/:id", updateDish);
router.delete("/:id", deleteDish);

export default router;
