import express from "express";
import { body, validationResult } from "express-validator";
import { db } from "../../db.js";

export const ventasRouter = express
  .Router()
  // Todas las ventas
  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM venta");
    res.send(rows);
  })
  // Venta por id
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT * FROM venta WHERE id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Venta no encontrada" });
    }
  })
  // Venta por id
  .delete("/:id", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "DELETE FROM venta WHERE id = :id",
      { id }
    );
    res.send("ok");
  })
  // Detalle por id
  .get("/:id/detalleventa", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT dv.id, p.nombre AS producto, dv.cantidad, dv.precio  FROM detalleventa dv \
      JOIN producto p ON dv.producto_id = p.id \
      WHERE dv.venta_id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows);
    } else {
      res.status(404).send({ mensaje: "Detalles no encontrados" });
    }
  })
  // Agregar nueva venta
  .post(
    "/",
    [
      body("nuevaVenta.cliente").isString().notEmpty(),
      body("nuevaVenta.empleado_id").isInt({ min: 1 }),
    ],
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        return res.status(400).json({ errors: validacion.array() });
      }
  
      const nuevaVenta = req.body.nuevaVenta;
      const [rows] = await db.execute(
        "INSERT INTO venta (cliente, empleado_id) VALUES (:cliente, :empleado_id)",
        {
          cliente: nuevaVenta.cliente,
          empleado_id: nuevaVenta.empleado_id,
        }
      );
      res.status(201).send({ mensaje: "Venta creada correctamente" });
    }
  )
  // Agregar nuevo detalle de venta
  .post("/detalleventa", async (req, res) => {
    const nuevoDetalle = req.body.nuevoDetalle;
    const [rows] = await db.execute(
      "INSERT INTO detalleventa (cantidad, precio, producto_id, venta_id) VALUES (:cantidad, :precio, :producto_id, :venta_id)",
      {
        cantidad: nuevoDetalle.cantidad,
        precio: nuevoDetalle.precio,
        producto_id: nuevoDetalle.producto_id,
        venta_id: nuevoDetalle.venta_id,
      }
    );
    await db.execute(
      "UPDATE producto SET stock = stock - :cantidad WHERE id = :producto_id",
      {
        cantidad: nuevoDetalle.cantidad,
        producto_id: nuevoDetalle.producto_id,
      }
    );
    res.status(201).send({ mensaje: "Detalle creado correctamente" });
  });

export default ventasRouter;
