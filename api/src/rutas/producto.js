import express from "express";
import { db } from "../../db.js";

export const productoRouter = express.Router()

// GET - LISTAR TODOS LOS PRODUCTOS ---
.get("/", async (req, res) => {
   try {
      const [rows, fields] = await db.execute("SELECT * FROM producto");
      res.send(rows);
   } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      res.status(500).send("Error al consultar la base de datos");
   }
})

// GET - BUSCAR PRODUCTOS POR NOMBRE ---
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

// INGRESAR PRODUCTOS ---
.post("/", async (req, res) => {
   try {
      const producto = req.body.producto;

      // Verificar si ya existe un producto con el mismo nombre o código
      const [existingRows] = await db.execute(
         "SELECT * FROM producto WHERE nombre = :nombre OR codigo = :codigo",
         { nombre: producto.nombre, codigo: producto.codigo }
      );

      if (existingRows.length > 0) {
         // Si ya existe un producto con el mismo nombre o código, devolver un error
         res.status(400).send({ mensaje: "Ya existe un producto con el mismo nombre o código" });
         return;
      }

      // Si no existe, realizar la inserción en la base de datos
      const [rows] = await db.execute(
         "INSERT INTO producto (nombre, codigo, precio) VALUES (:nombre, :codigo, :precio)",
         { nombre: producto.nombre, codigo: producto.codigo, precio: producto.precio }
      );

      res.status(201).send({ ...producto, id: rows.insertId });
   } catch (error) {
      console.error("Error al ingresar producto:", error);
      res.status(500).send("Error al ingresar producto");
   }
})

// ACTUALIZAR PRODUCTO SEGÚN SU ID ---
.put("/:id", async (req, res) => {
   const idreq = req.params.id;
   const producto = req.body.producto;

   // Verificar si ya existe otro producto con el mismo nombre o código
   const [existingRows] = await db.execute(
      "SELECT * FROM producto WHERE (nombre = :nombre OR codigo = :codigo) AND id != :id",
      { nombre: producto.nombre, codigo: producto.codigo, id: idreq }
   );

   if (existingRows.length > 0) {
      // Si ya existe un producto con el mismo nombre o código (excepto el actual), devolver un error
      res.status(400).send({ mensaje: "Ya existe otro producto con el mismo nombre o código" });
      return;
   }

   // Si no existe, realizar la actualización en la base de datos
   await db.execute(
      "UPDATE producto SET nombre=:nombre, precio=:precio, codigo=:codigo WHERE id=:id",
      { id: idreq, nombre: producto.nombre, precio: producto.precio, codigo: producto.codigo }
   );

   res.send("ok");
})

// ELIMINAR PRODUCTO POR ID ---
.delete("/:id", async (req, res) => {
   const id = req.params.id;
   await db.execute("DELETE FROM producto WHERE id=:id", { id });
   res.send("ok");
});
