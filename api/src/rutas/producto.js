import express from "express";
import { body, query, validationResult } from "express-validator";
import { db } from "../../db.js";


// Validation middleware for creating a new producto
const validateNewProducto = [
  body("nombre").isString().notEmpty(),
  body("codigo").isNumeric().isLength({ min: 5, max: 5 }),
  body("precio").isNumeric().notEmpty(),
  body("stock").isNumeric().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]
export const productoRouter = express
.Router()

// GET - LISTAR TODOS LOS PRODUCTOS
.get("/", async (req, res) => {
  try {
    const [rows, fields] = await db.execute("SELECT * FROM producto");
    res.send(rows);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).send("Error al consultar la base de datos");
  }
})

.get(
  "/filtro/",
  query("nombre").isLength({ min: 1, max: 45 }),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }

    try {
      let query =
        "SELECT * FROM producto WHERE 1=1";
      const conditions = [];
      const params = [];

      // Ejemplo de búsqueda por nombre
      if (req.query.nombre) {
        conditions.push("nombre = ?");
        params.push(req.query.nombre);
      }

      if (conditions.length > 0) {
        query += ` AND ${conditions.join(" AND ")}`;
      }

      const [rows, fields] = await db.execute(query, params);
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.status(404).send({ mensaje: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  }
)


// INGRESAR PRODUCTOS
.post("/", validateNewProducto, async (req, res) => {
  try {
    const producto = req.body;
    const [rows] = await db.execute(
      "INSERT INTO producto (nombre, codigo, precio, stock) VALUES (?, ?, ?, ?)",
      [producto.nombre, producto.codigo, producto.precio, producto.stock]
    );

    res.status(201).send({ ...producto, id: rows.insertId });
  } catch (error) {
    console.error("Error al ingresar producto:", error);
    res.status(500).send("Error al ingresar producto");
  }
})

// ACTUALIZAR NOMBRE DEL PRODUCTO SEGÚN SU ID
.put("/:id", validateNewProducto, async (req, res) => {
  const idreq = req.params.id;
  const producto = req.body;
  await db.execute(
    "UPDATE producto SET nombre=?, precio=?, codigo=?, stock=? WHERE id=?",
    [producto.nombre, producto.precio, producto.codigo, producto.stock, idreq]
  );
  res.send("Se modificó correctamente");
})

// ELIMINAR PRODUCTO POR ID
.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await db.execute("DELETE FROM producto WHERE id=?", [id]);
  res.send("ok");
})

// ELIMINAR PRODUCTO POR NOMBRE
.delete("/:nombre", async (req, res) => {
  const nombre = req.params.nombre;
  await db.execute("DELETE FROM producto WHERE nombre=?", [nombre]);
  res.send("Eliminado");
});

export default productoRouter;
