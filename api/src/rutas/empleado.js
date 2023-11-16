import bcrypt from "bcryptjs";
import { db } from "../../db.js";
import express from "express";
import { body, param, validationResult } from "express-validator";

export const empleadoRouter = express
  .Router()
  .post(
    "/",
    body("nombre").isAlphanumeric().isLength({ min: 1, max: 25 }),
    body("contrasena").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { nombre, contrasena, rolNombre } = req.body;
      const contrasenaHashed = await bcrypt.hash(contrasena, 8);

      try {
        // Obtén el ID del rol a partir del nombre
        const [rolRow] = await db.execute("SELECT id FROM rol WHERE nombre = ?", [
          rolNombre,
        ]);

        if (rolRow.length === 0) {
          res.status(404).send({ mensaje: "El rol especificado no existe" });
          return;
        }

        const rol_id = rolRow[0].id;

        const [rows] = await db.execute(
          "INSERT INTO empleado (nombre, contrasena, rol_id) VALUES (?, ?, ?)",
          [nombre, contrasenaHashed, rol_id]
        );

        res.status(201).send({ id: rows.insertId, nombre, rol_id });
      } catch (error) {
        console.error("Error al agregar empleado:", error);
        res.status(500).send({ mensaje: "Error interno del servidor" });
      }
    }
  )
  .put(
    "/:id",
    param("id").isInt({ min: 1 }),
    body("rolNombre").isLength({ min: 1 }),  // Asegúrate de validar el nuevo rolNombre
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { id } = req.params;
      const { rolNombre } = req.body;

      try {
        // Obtén el ID del nuevo rol a partir del nombre
        const [rolRow] = await db.execute("SELECT id FROM rol WHERE nombre = ?", [
          rolNombre,
        ]);

        if (rolRow.length === 0) {
          res.status(404).send({ mensaje: "El nuevo rol especificado no existe" });
          return;
        }

        const nuevoRol_id = rolRow[0].id;

        // Realiza la actualización del rol del empleado
        await db.execute("UPDATE empleado SET rol_id = ? WHERE id = ?", [
          nuevoRol_id,
          id,
        ]);

        res.send({ mensaje: "Rol actualizado correctamente" });
      } catch (error) {
        console.error("Error al actualizar el rol del empleado:", error);
        res.status(500).send({ mensaje: "Error interno del servidor" });
      }
    }
  )
  .get("/", async (req, res) => {
    try {
      const [rows, fields] = await db.execute(
        "SELECT id, nombre, rol_id FROM empleado"
      );
      res.send(rows);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows, fields] = await db.execute(
        "SELECT id, nombre, rol_id FROM empleado WHERE id = ?",
        [id]
      );
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.status(404).send({ mensaje: "Cuenta no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener empleado por ID:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  })
  .delete("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
    const { id } = req.params;
    try {
      await db.execute("DELETE FROM empleado WHERE id = ?", [id]);
      res.send("ok");
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      res.status(500).send({ mensaje: "Error interno del servidor" });
    }
  });