import express from "express";
import { db } from "./db.js";

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
      "SELECT dc.id, p.nombre AS producto, dc.cantidad, dc.precio  FROM detallecompra dc \
      JOIN producto p ON dc.producto_id = p.id \
      WHERE dc.compra_id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows);
    } else {
      res.status(404).send({ mensaje: "compra no encontrada" });
    }
  })

  
  .post("/", async (req, res) => {
    const nuevaCompra = req.body.turno;
    const [rows] = await db.execute(
      "insert into compra (fecha, proveedor) values (:fecha, :proveedor)",
      {
        fecha: nuevaCompra.fecha,
        proveedor: nuevaCompra.proveedor,
      }
    );
    res.status(201).send({ mensaje: "Compra Creada" });
  })

  .post("/detallecompra", async (req, res) => {
    const nuevoDetallecompra = req.body.turno;
    const [rows] = await db.execute(
      "insert into detallecompra (cantidad, precio, producto_id, compra_id) values (:cantidad, :precio, :producto_id, :compra_id)",
      {
        fecha: nuevoDetallecompra.fecha,
        precio: nuevoDetallecompra.precio,
        producto_id:nuevoDetallecompra.producto_id,
        compra_id:nuevoDetallecompra.compra_id,
      }
    );
    res.status(201).send({ mensaje: "Detalle Creado" });
  })
