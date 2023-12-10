import express from "express";
import { db } from "../../db.js";

export const ventasRouter = express.Router()

// Obtener todas las ventas
.get("/", async (req, res) => {
  try {
    const [rows, fields] = await db.execute("SELECT * FROM venta");
    res.send(rows);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).send("Error al consultar la base de datos");
  }
})

// Obtener venta por ID
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
    console.error("Error al obtener venta:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
})

// Eliminar venta por ID
.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows, fields] = await db.execute("DELETE FROM venta WHERE id = :id", {
      id,
    });
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

// Obtener detalles de venta por ID
.get("/:id/detallesventa", async (req, res) => {
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

// Agregar nueva venta
.post("/", async (req, res) => {
  const nuevaVenta = req.body.nuevaVenta;
  const detallesVenta = req.body.detallesVenta;

  try {
    const [rows] = await db.execute(
      "INSERT INTO venta (fecha, cliente, empleado_id) VALUES (:fecha, :cliente, :empleado_id)",
      {
        fecha: nuevaVenta.fecha,
        cliente: nuevaVenta.cliente,
        empleado_id: nuevaVenta.empleado_id,
      }
    );

    const ventaId = rows.insertId;

    for (const detalle of detallesVenta) {
      await db.execute(
        "INSERT INTO detalleventa (cantidad, precio, producto_id, venta_id) VALUES (:cantidad, :precio, :producto_id, :venta_id)",
        {
          cantidad: detalle.cantidad,
          precio: detalle.precio,
          producto_id: detalle.producto_id,
          venta_id: ventaId,
        }
      );

      // Actualizar stock del producto
      await db.execute(
        "UPDATE producto SET stock = stock - :cantidad WHERE id = :producto_id",
        {
          cantidad: detalle.cantidad,
          producto_id: detalle.producto_id,
        }
      );
    }

    res.status(201).send({ mensaje: "Venta Creada" });
  } catch (error) {
    console.error("Error al agregar venta:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
})

// Agregar nuevo detalle de venta
.post("/detalleventa", async (req, res) => {
  const nuevoDetalle = req.body.nuevoDetalle;
  try {
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
    res.status(201).send({ mensaje: "Detalle Creado" });
  } catch (error) {
    console.error("Error al agregar detalle de venta:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
});

// Otras rutas y funciones...
