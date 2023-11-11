import express from "express";
import { db } from "./db.js";

export const ventasRouter = express
  .Router()
  
  //Todas las ventas
  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM venta");
    res.send(rows);
  })
  
  // venta por id
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      //"SELECT dv.id, p.nombre AS producto, dv.cantidad, dv.precio  FROM detalleventa dc \
      "SELECT dv.*, p.nombre AS producto FROM detalleventa dv \
      JOIN producto p ON dv.producto_id = p.id \
      WHERE dv.venta_id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows);
    } else {
      res.status(404).send({ mensaje: "venta no encontrada" });
    }
  })

  
  .post("/", async (req, res) => {
    const nuevaVenta = req.body.turno;
    const [rows] = await db.execute(
      "insert into venta (fecha, cliente) values (:fecha, :cliente)",
      {
        fecha: nuevaVenta.fecha,
        cliente: nuevaVenta.cliente,
      }
    );
    res.status(201).send({ mensaje: "Venta Creada" });
  })

  .post("/detalleventa", async (req, res) => {
    const nuevoDetalleventa = req.body.turno;
    const [rows] = await db.execute(
      "insert into detalleventa (cantidad, precio, producto_id, venta_id) values (:cantidad, :precio, :producto_id, :venta_id)",
      {
        fecha: nuevoDetalleventa.fecha,
        precio: nuevoDetalleventa.precio,
        producto_id:nuevoDetalleventa.producto_id,
        venta_id:nuevoDetalleventa.venta_id_id,
      }
    );
    res.status(201).send({ mensaje: "Detalle Creado" });
  })