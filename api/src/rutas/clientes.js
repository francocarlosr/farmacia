import express from "express";
import { db } from "../../db.js";

export const clientesRouter = express
  .Router()

  // GET -LISTAR TODOS LOS CLIENTES EN RUTA RAIZ
  .get("/", async (req, res) => {
    try {
      const [rows, fields] = await db.execute("SELECT * FROM clientes");
      res.send(rows);
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      res.status(500).send("Error al consultar la base de datos");
    }
  })

  // GET - BUSCAR CLIENTES POR NOMBRE ---
  .get("/:id", async (req, res) => {
    const id = req.params.id;
    const [rows, fields] = await db.execute(
      "SELECT * FROM clientes WHERE id=:id",
      {
        id,
      }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "El clientes no existe" });
    }
  })

  // GET - BUSCAR CLIENTES POR NOMBRE ---
  .get("/:nombre", async (req, res) => {
    const nombre = req.params.nombre;
    const [rows, fields] = await db.execute(
      "SELECT * FROM clientes WHERE nombre=:nombre",
      {
        nombre,
      }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "El clientes no existe" });
    }
  })

  .post("/", async (req, res) => {
    try {
      const clientes = req.body.clientes;
      const [rows] = await db.execute(
        "INSERT INTO clientes (nombre, direccion , telefono) VALUES (:nombre, :direccion, :telefono)",
        {
          nombre: clientes.nombre,
          direccion: clientes.direccion,
          telefono: clientes.telefono,
        }
      );

      res.status(201).send({ ...clientes, id: rows.insertId });
    } catch (error) {
      console.error("Error al ingresar clientes:", error);
      res.status(500).send("Error al ingresar clientes");
    }
  })

  // ACTUALIZAR CLIENTES SEGÚN SU ID ---
  .put("/:id", async (req, res) => {
    const idreq = req.params.id;
    const clientes = req.body.clientes;

    try {
      // Verificar si ya existe otro clientes con el mismo nombre
      const [existingRows] = await db.execute(
        "SELECT * FROM clientes WHERE nombre = :nombre AND id != :id",
        { nombre: clientes.nombre, id: idreq }
      );

      if (existingRows.length > 0) {
        // Si ya existe un clientes con el mismo nombre (excepto el actual), devolver un error
        return res
          .status(400)
          .send({ mensaje: "Ya existe otro clientes con el mismo nombre" });
      }

      // Si no existe, realizar la actualización en la base de datos
      await db.execute(
        "UPDATE clientes SET nombre=:nombre, direccion=:direccion, telefono=:telefono WHERE id=:id",
        {
          id: idreq,
          nombre: clientes.nombre,
          direccion: clientes.direccion,
          telefono: clientes.telefono,
        }
      );

      return res.send("El clientes fue modificado");
    } catch (error) {
      console.error("Error al actualizar el clientes:", error);
      return res
        .status(500)
        .send({ mensaje: "Error al actualizar el clientes" });
    }
  })

  // ELIMINAR CLIENTES POR ID  ---
  .delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
      // Verificar si el clientes existe
      const [existingRows] = await db.execute(
        "SELECT * FROM clientes WHERE id = :id",
        { id }
      );

      if (existingRows.length === 0) {
        // Si el clientes no existe, devolver un error
        return res.status(404).send({ mensaje: "El clientes no existe" });
      }

      // Eliminar el clientes de la base de datos
      await db.execute("DELETE FROM clientes WHERE id=:id", { id });

      res.send("El clientes fue eliminado");
    } catch (error) {
      console.error("Error al eliminar el clientes:", error);
      res.status(500).send({ mensaje: "Error al eliminar el clientes" });
    }
  });
