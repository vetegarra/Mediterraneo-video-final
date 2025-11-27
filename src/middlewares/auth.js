import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authOptional = async (req, _res, next) => {
  try {
    const token = req.cookies?.token;
    if(token){
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const u = await User.findById(decoded.uid).select("name email role");
      if(u) req.user = { name: u.name, email: u.email, role: u.role, id: String(u._id) };
    }
  } catch (_) { /* cookie inválida -> ignorar */ }
  next();
};
