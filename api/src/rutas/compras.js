import express from "express";
import { db } from "../../db.js";

export const comprasRouter = express.Router()

  // Obtener todas las compras
  .get("/", async (req, res) => {
    try {
      const [rows, fields] = await db.execute("SELECT * FROM compra");
      res.send(rows);
    } catch (error) {
      console.error("Error al obtener las compras:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })

  // Obtener compra por id
  .get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [rows, fields] = await db.execute(
        "SELECT * FROM compra WHERE id = :id",
        { id }
      );
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.status(404).send({ mensaje: "Compra no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener la compra por ID:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })

  // Eliminar compra por id
  .delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.execute("DELETE FROM compra WHERE id = :id", { id });
      res.send("Compra eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })

  // Obtener detalles de compra por id
  .get("/:id/detallecompra", async (req, res) => {
    try {
      const { id } = req.params;
      const [rows, fields] = await db.execute(
        "SELECT dc.id, p.nombre AS producto, dc.cantidad, dc.precio FROM detallecompra dc \
        JOIN producto p ON dc.producto_id = p.id \
        WHERE dc.compra_id = :id",
        { id }
      );
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.status(404).send({ mensaje: "Detalles no encontrados" });
      }
    } catch (error) {
      console.error("Error al obtener detalles de la compra:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })

  // Agregar nueva compra
  .post("/", async (req, res) => {
    try {
      const nuevaCompra = req.body.nuevaCompra;
      const [rows] = await db.execute(
        "INSERT INTO compra (fecha, proveedor) VALUES (:fecha, :proveedor)",
        {
          fecha: nuevaCompra.fecha,
          proveedor: nuevaCompra.proveedor,
        }
      );
      res.status(201).send({ mensaje: "Compra creada correctamente" });
    } catch (error) {
      console.error("Error al agregar nueva compra:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
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
          compra_id: nuevoDetalle.compra_id,
        }
      );

      await db.execute(
        "UPDATE producto SET stock = stock + :cantidad WHERE id = :producto_id",
        {
          cantidad: nuevoDetalle.cantidad,
          producto_id: nuevoDetalle.producto_id,
        }
      );

      res.status(201).send({ mensaje: "Detalle de compra creado correctamente" });
    } catch (error) {
      console.error("Error al agregar nuevo detalle de compra:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  });
