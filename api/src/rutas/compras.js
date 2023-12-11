import express from "express";
import { db } from "../../db.js";

export const comprasRouter = express
  .Router()
  
  //Todas las compras
  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM compra");
    res.send(rows);
  })
  
  // compra por id
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT * FROM compra WHERE id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "compra no encontrada" });
    }
  })

    // compra por id
  .delete("/:id", async (req, res) => {
      const { id } = req.params;
      const [rows, fields] = await db.execute(
        "DELETE FROM compra WHERE id = :id",
        { id }
      );
      res.send("ok");
    })

  // detalle por id
  .get("/:id/detallecompra", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT dc.id, p.nombre AS producto, dc.cantidad, dc.precio  FROM detallecompra dc \
      JOIN producto p ON dc.producto_id = p.id \
      WHERE dc.compra_id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows);
    } else {
      res.status(404).send({ mensaje: "detalles no encontrados" });
    }
  })

// Agregar nueva compra
  .post("/", async (req, res) => {
    const nuevaCompra = req.body.nuevaCompra;
    const [rows] = await db.execute(
      "INSERT INTO compra (fecha, proveedor) VALUES (:fecha, :proveedor)",
      {
        fecha: nuevaCompra.fecha,
        proveedor: nuevaCompra.proveedor
      }
    );
    res.status(201).send({ mensaje: "Compra Creada" });
  })

// Agregar nuevo detalle de compra
  .post("/:id/detallecompra", async (req, res) => {
    const { id } = req.params;
    const nuevoDetalle = req.body.nuevoDetalle;
    const [rows] = await db.execute(
      "INSERT INTO detallecompra (cantidad, precio, producto_id, compra_id) VALUES (:cantidad, :precio, :producto_id, :compra_id)",
      {
        cantidad: nuevoDetalle.cantidad,
        precio: nuevoDetalle.precio,
        producto_id: nuevoDetalle.producto_id,
        compra_id: id
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
})


  