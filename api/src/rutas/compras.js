import express from "express";
import { body, validationResult } from "express-validator";
import { db } from "../../db.js";

export const comprasRouter = express
  .Router()

  // Validation middleware for creating a new compra
  const validateNewCompra = [
    body("nuevaCompra.proveedor").isString().notEmpty().isLength({ max: 45 }),
  ]

  // Todas las compras
  comprasRouter.get("/", async (req, res) => {
    try {
      const [rows, fields] = await db.execute("SELECT * FROM compra");
      res.send(rows);
    } catch (error) {
      console.error("Error al obtener todas las compras:", error);
      res.status(500).send("Error interno del servidor");
    }
  })
  
  // compra por id
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows, fields] = await db.execute("SELECT * FROM compra WHERE id = :id", { id });
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.status(404).send({ mensaje: "compra no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener compra por ID:", error);
      res.status(500).send("Error interno del servidor");
    }
  })

  // compra por id
  .delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows, fields] = await db.execute("DELETE FROM compra WHERE id = :id", { id });
      res.send("ok");
    } catch (error) {
      console.error("Error al eliminar compra:", error);
      res.status(500).send("Error interno del servidor");
    }
  })

  // detalle por id
  .get("/:id/detallecompra", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows, fields] = await db.execute(
        "SELECT dc.id, p.nombre AS producto, dc.cantidad, dc.precio FROM detallecompra dc \
        JOIN producto p ON dc.producto_id = p.id \
        WHERE dc.compra_id = :id",
        { id }
      );
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.status(404).send({ mensaje: "detalles no encontrados" });
      }
    } catch (error) {
      console.error("Error al obtener detalles de compra por ID:", error);
      res.status(500).send("Error interno del servidor");
    }
  })

  // Agregar nueva compra
  .post("/", validateNewCompra, async (req, res) => {
    try {
      const errors = validationResult(req).array();
  
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
  
      const nuevaCompra = req.body.nuevaCompra;
      const [rows] = await db.execute("INSERT INTO compra (proveedor) VALUES (:proveedor)", {
        proveedor: nuevaCompra.proveedor,
      });
      res.status(201).send({ mensaje: "Compra Creada" });
    } catch (error) {
      console.error("Error al ingresar compra:", error);
      res.status(500).send("Error interno del servidor");
    }
  })

  // Agregar nuevo detalle de compra
  .post("/detallecompra", async (req, res) => {
    try {
      const nuevoDetalle = req.body.nuevoDetalle;
      const [rows] = await db.execute(
        "INSERT INTO detallecompra (cantidad, precio, producto_id, compra_id) VALUES (:cantidad, :precio, :producto_id, :compra_id)",
        {
          cantidad: nuevoDetalle.cantidad,
          precio: nuevoDetalle.precio,
          producto_id: nuevoDetalle.producto_id,
          compra_id: nuevoDetalle.compra_id
        }
      );

      await db.execute(
        "UPDATE producto SET stock = stock + :cantidad WHERE id = :producto_id",
        {
          cantidad: nuevoDetalle.cantidad,
          producto_id: nuevoDetalle.producto_id
        }
      );

      res.status(201).send({ mensaje: "Detalle Creado" });
    } catch (error) {
      console.error("Error al ingresar detalle de compra:", error);
      res.status(500).send("Error interno del servidor");
    }
  });

export default comprasRouter;
