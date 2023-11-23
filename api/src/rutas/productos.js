import express from "express";
import { body, query, validationResult } from "express-validator";
import { db } from "../../db.js";


const validateNewProducto = [
  body("nombre").isString().notEmpty(),
  body("codigo").isNumeric().isLength({ min: 5, max: 5 }),
  body("precio").isNumeric().notEmpty(),
  body("stock").optional({ checkFalsy: true }).isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
export const productosRouter = express.Router()

  .get("/", async (req, res) => {
    try {
      const [rows, fields] = await db.execute("SELECT * FROM producto");
      res.send(rows);
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      res.status(500).send("Error al consultar la base de datos");
    }
  })
// GET - OBTENER PRODUCTO POR ID
.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [rows, fields] = await db.execute("SELECT * FROM producto WHERE id = ?", [id]);

    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
})

  .post("/", validateNewProducto, async (req, res) => {
    try {
      const { nombre, codigo, precio } = req.body;
      const [rows] = await db.execute(
        "INSERT INTO producto (nombre, codigo, precio) VALUES (?, ?, ?)",
        [nombre, codigo, precio]
      );

      res.status(201).send({ id: rows.insertId, nombre: nombre, codigo: codigo, precio: precio});
    } catch (error) {
      console.error("Error al ingresar producto:", error);
      res.status(500).send("Error al ingresar producto");
    }
  })

  .put("/:id", validateNewProducto, async (req, res) => {
    try {
      const id = req.params.id;
      const { nombre, precio, codigo, stock } = req.body;

      const [rows] = await db.execute(
        "UPDATE producto SET nombre=?, precio=?, codigo=?, stock=? WHERE id=?",
        [nombre, precio, codigo, stock, id]
      );

      if (rows.affectedRows > 0) {
        res.send("Producto actualizado correctamente");
      } else {
        res.status(404).send({ mensaje: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).send("Error interno del servidor");
    }
  })

  .delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const [result] = await db.execute("DELETE FROM producto WHERE id=?", [
        id,
      ]);

      if (result.affectedRows > 0) {
        res.send("Producto eliminado correctamente");
      } else {
        res.status(404).send({ mensaje: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).send("Error interno del servidor");
    }
  });

export default productosRouter;
