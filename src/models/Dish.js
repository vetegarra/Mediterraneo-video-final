import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 }
}, { _id: false });

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: "" },
  category: { type: String, enum: ["Entrada", "Plato", "Postre", "Bebida"], required: true },
  price: { type: Number, required: true, min: 0 }, // precio base visible en catálogo
  image: { type: String, default: "" },
  variants: { type: [variantSchema], default: [] },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Dish", dishSchema);
