import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" }); // sesión 30 días

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,       // en producción con HTTPS -> true
  maxAge: 30*24*60*60*1000
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if(!name || !email || !password) return res.status(400).json({ error: "Faltan campos" });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if(exists) return res.status(409).json({ error: "Email ya registrado" });

    const user = await User.create({ name, email, password, role: "user" });
    const token = sign({ uid: user._id, role: user.role });
    res.cookie("token", token, cookieOpts);
    res.status(201).json({ ok:true, user: { name:user.name, email:user.email, role:user.role } });
  } catch (e) {
    res.status(500).json({ error: "No se pudo registrar" });
  }
};

export const login = async (req, res) => {
  try{
    const { email, password } = req.body || {};
    if(!email || !password) return res.status(400).json({ error: "Email y clave requeridos" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if(!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await user.comparePassword(password);
    if(!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = sign({ uid: user._id, role: user.role });
    res.cookie("token", token, cookieOpts);
    res.json({ ok:true, user: { name:user.name, email:user.email, role:user.role } });
  }catch(e){
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const me = async (req, res) => {
  if(!req.user) return res.status(401).json({ error: "No autenticado" });
  res.json({ user: req.user });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ ok:true });
};

// opcional: crear admin si no existe
export const seedAdmin = async (_req, res) => {
  try{
    const email = "admin@mediterraneo.cl";
    let u = await User.findOne({ email });
    if(!u){
      u = await User.create({
        name: "Administrador",
        email,
        password: "Admin123*",
        role: "admin"
      });
    }
    res.json({ ok:true, email: u.email });
  }catch(e){ res.status(500).json({ error:"No se pudo crear admin" }); }
};
