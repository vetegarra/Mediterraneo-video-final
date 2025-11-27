import { Router } from "express";
import { register, login, me, logout, seedAdmin } from "../controllers/auth.controller.js";
import { authOptional } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authOptional, me);
router.post("/logout", logout);
router.post("/seed-admin", seedAdmin); // opcional

export default router;
