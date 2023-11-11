import express from "express";
import { db } from "./db.js";


export const productoRouter = express
.Router()

//GET -LISTAR TODOS LOS PRODUCTOS ---
.get("/", async (req, res) => {
   try {
      const [rows, fields] = await db.execute("SELECT * FROM producto");
      res.send(rows);
   } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      res.status(500).send("Error al consultar la base de datos");
   }
})

//GET -BUSCAR PRODUCTOS POR NOMBRE ---
.get("/:nombre", async (req, res) => {
   const nombre = req.params.nombre
   const [rows, fields] = await db.execute("SELECT * FROM producto WHERE nombre=:nombre", {
      nombre
   })
   if (rows.length > 0) {
      res.send(rows[0])
   } else {
      res.status(404).send({ mensaje: "Producto no encontrado" })
   }
})

//INGRESAR PRODUCTOS ---
.post("/", async (req, res) => {
   try {
      const producto = req.body.producto;
      const [rows] = await db.execute(
         "INSERT INTO producto (nombre, codigo, precio, stock) VALUES (:nombre, :codigo, :precio, :stock)",
         { nombre: producto.nombre, codigo: producto.codigo, precio: producto.precio, stock: producto.stock }
      );

      res.status(201).send({ ...producto, id: rows.insertId });
   } catch (error) {
      console.error("Error al ingresar producto:", error);
      res.status(201).send("Error al ingresar producto");
   }
})


//ACTUALIZAR NOMBRE DEL PRODUCTO ---
.put("/:id", async (req, res) => {
   const idreq = req.params.id
   const producto = req.body.producto
   await db.execute("UPDATE producto SET nombre=:nombre , precio=:precio,codigo=:codigo, stock=:stock WHERE id=:id", {
      id: idreq, nombre: producto.nombre, precio: producto.precio, codigo: producto.codigo, stock: producto.stock
   })
   res.send("ok")
})

//ELIMINAR PRODUCTO POR NOMBRE
.delete("/:nombre", async (req, res) => {
   const nombre = req.params.nombre;
   await db.execute("DELETE FROM producto WHERE nombre=:nombre", { nombre });
   res.send("ok");
});






