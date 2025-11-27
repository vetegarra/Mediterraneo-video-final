import Dish from "../models/Dish.js";

export const getMenu = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    const filter = q
      ? { name: { $regex: q, $options: "i" }, active: true }
      : { active: true };
    const dishes = await Dish.find(filter).sort({ category: 1, name: 1 });
    res.json(dishes);
  } catch (err) {
    console.error("GET /api/menu error:", err);
    res.status(500).json({ error: "Error al listar el menú" });
  }
};

//OBTENER POR ID (para producto_detalle.html)
export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ error: "No encontrado" });
    res.json(dish);
  } catch (err) {
    res.status(400).json({ error: "ID inválido" });
  }
};

export const createDish = async (req, res) => {
  try {
    console.log("POST /api/menu body =>", req.body);

    let { name, slug, category, price, description = "", image = "", variants = [] } = req.body;

    // Normalizaciones
    name = (name ?? "").toString().trim();
    slug = (slug ?? "").toString().trim().toLowerCase();
    category = (category ?? "").toString().trim();
    price = Number(price);

    // Validaciones
    if (!name || !slug || !category || !Number.isFinite(price)) {
      return res.status(400).json({ error: "Faltan campos obligatorios o precio inválido" });
    }
    if (price < 0) return res.status(400).json({ error: "El precio no puede ser negativo" });

    const allowed = ["Entrada", "Plato", "Postre", "Bebida"];
    if (!allowed.includes(category)) {
      return res.status(400).json({ error: "Categoría inválida (Entrada, Plato, Postre, Bebida)" });
    }

    // Variantes
    if (!Array.isArray(variants)) variants = [];
    variants = variants.map(v => {
      const vName = (v?.name ?? "").toString().trim();
      const vPrice = Number(v?.price);
      const vStock = Number(v?.stock);
      if (!vName || !Number.isFinite(vPrice) || vPrice < 0 || !Number.isFinite(vStock) || vStock < 0) {
        throw Object.assign(new Error("Variante inválida"), { status: 400 });
      }
      return { name: vName, price: vPrice, stock: vStock };
    });

    const payload = { name, slug, category, price, description, image, variants };
    const dish = await Dish.create(payload);
    return res.status(201).json(dish);

  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ error: err.message || "Datos inválidos" });
    }
    if (err?.code === 11000 && err?.keyPattern?.slug) {
      return res.status(409).json({ error: "El slug ya existe. Cambia el nombre." });
    }
    if (err?.name === "ValidationError") {
      const msg = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ error: msg || "Datos inválidos" });
    }
    console.error("POST /api/menu error:", err);
    return res.status(500).json({ error: "Error inesperado al crear" });
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!dish) return res.status(404).json({ error: "No encontrado" });
    res.json(dish);
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.slug) {
      return res.status(409).json({ error: "El slug ya existe" });
    }
    if (err?.name === "ValidationError") {
      const msg = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ error: msg || "Datos inválidos" });
    }
    console.error("PUT /api/menu/:id error:", err);
    res.status(500).json({ error: "Error al actualizar" });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Dish.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ error: "No encontrado" });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/menu/:id error:", err);
    res.status(500).json({ error: "Error al eliminar" });
  }
};

//SEED
export const seedMenu = async (_req, res) => {
  try {
    await Dish.deleteMany({});
    const data = [
      { name: "Paella Mediterránea", slug: "paella-mediterranea", category: "Plato",  price: 12990, description: "Arroz con mariscos y azafrán" },
      { name: "Moussaka",            slug: "moussaka",            category: "Plato",  price:  9990, description: "Berenjena, carne y bechamel" },
      { name: "Hummus",              slug: "hummus",              category: "Entrada",price:  3990, description: "Crema de garbanzos y tahini" }
    ];
    await Dish.insertMany(data);
    res.json({ ok: true, inserted: data.length });
  } catch (err) {
    console.error("POST /api/menu/seed error:", err);
    res.status(500).json({ error: "No se pudo poblar" });
  }
};
