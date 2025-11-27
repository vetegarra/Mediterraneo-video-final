import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Helpers
const safeUser = (u) => ({
  _id: u._id,
  email: u.email,
  role: u.role,
  name: u.name,
});

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      role = "Cliente",
      name = "",
      run = "",
      birthDate = null,
      sexo = "",
      telefono = "",
      direccion = "",
      comuna = "",
      provincia = "",
      region = "",
    } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    const emailL = email.toLowerCase();
    const existing = await User.findOne({ email: emailL });
    if (existing) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: emailL,
      password: hashed,
      role,
      name,
      run,
      birthDate,
      sexo,
      telefono,
      direccion,
      comuna,
      provincia,
      region,
      active: true,
    });

    return res.status(201).json(safeUser(user));
  } catch (err) {
    console.error("POST /api/users/register error:", err);
    res.status(500).json({ error: "No se pudo registrar" });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    return res.json(safeUser(user));
  } catch (err) {
    console.error("POST /api/users/login error:", err);
    res.status(500).json({ error: "No se pudo iniciar sesión" });
  }
};

// GET /api/users
export const listUsers = async (_req, res) => {
  try {
    const users = await User.find(
      {},
      "_id email role name createdAt"
    ).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET /api/users error:", err);
    res.status(500).json({ error: "No se pudo listar" });
  }
};

// GET /api/users/:id  (detalles de un usuario)
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    console.error("GET /api/users/:id error:", err);
    res.status(500).json({ error: "No se pudo obtener el usuario" });
  }
};


// PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.password) {
      if (payload.password.length < 8) {
        return res
          .status(400)
          .json({ error: "La contraseña debe tener al menos 8 caracteres" });
      }
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    if (payload.email) payload.email = payload.email.toLowerCase();

    const user = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(safeUser(user));
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ error: "Ese email ya está en uso" });
    }
    console.error("PUT /api/users/:id error:", err);
    res.status(500).json({ error: "No se pudo actualizar" });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await User.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/users/:id error:", err);
    res.status(500).json({ error: "No se pudo eliminar" });
  }
};

// POST /api/users/seed-admin
export const seedAdmin = async (_req, res) => {
  try {
    const email = "admin@mediterraneo.cl";
    const pwd = "Clave2025";

    let admin = await User.findOne({ email });
    if (admin) {
      return res.json({ ok: true, alreadyExists: true, user: safeUser(admin) });
    }

    const passwordHash = await bcrypt.hash(pwd, 10);
    admin = await User.create({
      name: "Administrador",
      email,
      password: passwordHash,
      role: "Administrador",
    });

    res.json({ ok: true, created: true, user: safeUser(admin) });
  } catch (err) {
    console.error("POST /api/users/seed-admin error:", err);
    res.status(500).json({ error: "No se pudo crear el admin" });
  }
};
