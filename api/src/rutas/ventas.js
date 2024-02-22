// Importar los módulos necesarios
import express from "express";
import { db } from "../../db.js";

// Crear el router de ventas
export const ventasRouter = express
  .Router()
  // Obtener todas las ventas
  .get("/", async (req, res) => {
    try {
      const [rows, fields] = await db.execute("SELECT * FROM venta");
      res.send(rows);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })
  // Obtener una venta por ID
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows, fields] = await db.execute(
        "SELECT * FROM venta WHERE id = :id",
        { id }
      );
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.status(404).send({ mensaje: "Venta no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener venta por ID:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })
  // Eliminar una venta por ID
  .delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows, fields] = await db.execute(
        "DELETE FROM venta WHERE id = :id",
        { id }
      );
      if (rows.affectedRows > 0) {
        res.send("ok");
      } else {
        res.status(404).send({ mensaje: "Venta no encontrada" });
      }
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })
  // Obtener detalles de venta por ID de venta
  .get("/:id/detalleventa", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows, fields] = await db.execute(
        "SELECT dv.id, p.nombre AS producto, dv.cantidad, dv.precio FROM detalleventa dv \
        JOIN producto p ON dv.producto_id = p.id \
        WHERE dv.venta_id = :id",
        { id }
      );
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.status(404).send({ mensaje: "Detalles no encontrados" });
      }
    } catch (error) {
      console.error("Error al obtener detalles de venta:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })
  // Crear nueva venta con detalles
  .post("/", async (req, res) => {
    const nuevaVenta = req.body.nuevaVenta;
    const detallesVenta = req.body.detallesVenta;

    try {

      const ventaId = ventaResult.insertId;

      // Calcular precio total de la venta
      let precioTotalVenta = 0;

      // Iterar sobre los detalles de la venta
      for (const detalle of detallesVenta) {
        // Insertar detalle de venta
        await db.execute(
          "INSERT INTO detalleventa (cantidad, precio, producto_id, venta_id) VALUES (:cantidad, :precio, :producto_id, :venta_id)",
          {
            cantidad: detalle.cantidad,
            precio: detalle.precioTotal,
            producto_id: detalle.producto_id,
            venta_id: ventaId
          }
        );

        // Actualizar el stock del producto
        await db.execute(
          "UPDATE producto SET stock = stock - :cantidad WHERE id = :producto_id",
          {
            cantidad: detalle.cantidad,
            producto_id: detalle.producto_id
          }
        );

        // Agregar el precio total del detalle al precio total de la venta
        precioTotalVenta += detalle.precioTotal;
      }

      // Actualizar el precio total de la venta
      await db.execute(
        "UPDATE venta SET precio_total = :precio_total WHERE id = :venta_id",
        {
          precio_total: precioTotalVenta,
          venta_id: ventaId
        }
      );

      res.status(201).send({ mensaje: "Venta Creada", precio_total: precioTotalVenta });
    } catch (error) {
      console.error("Error al crear venta:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  });

// Exportar el router de ventas
export default ventasRouter;
