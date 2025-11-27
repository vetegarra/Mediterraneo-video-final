import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email requerido"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    // Guardaremos el hash bcrypt aquí
    password: {
      type: String,
      required: [true, "Contraseña requerida"],
      minlength: [8, "Mínimo 8 caracteres"],
    },
    role: {
      type: String,
      enum: ["Cliente", "Administrador", "Delivery", "Cocina"],
      default: "Cliente",
    },
    name: { type: String, trim: true, default: "" },
    run: { type: String, trim: true, default: "" },
    birthDate: { type: Date, default: null },
    sexo: { type: String, enum: ["M", "F", "O", ""], default: "" },
    telefono: { type: String, trim: true, default: "" },
    direccion: { type: String, trim: true, default: "" },
    comuna: { type: String, trim: true, default: "" },
    provincia: { type: String, trim: true, default: "" },
    region: { type: String, trim: true, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
