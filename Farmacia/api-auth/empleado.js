import bcrypt from "bcryptjs";
import { db } from "./db.js";
import express from "express";
import { body, param, query, validationResult } from "express-validator";

export const empleadoRouter = express
  .Router()
  .post("/registro",
    body("nombre").isLength({ min: 2, max: 50 }),
    body("apellido").isLength({ min: 2, max: 80 }),
    body("user").isLength({ min: 2, max: 50 }),
    body("mail").isEmail(),
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

      const data = req.body;
      const {
        nombre,
        apellido,
        user,
        mail,
        contrasena,
        rolNombre = "user",
      } = data;

      try {
        // Verificar si el rol existe en la tabla "rol"
        const [rolRow] = await db.execute(
          "SELECT id FROM rol WHERE nombre = ?",
          [rolNombre]
        );

        if (rolRow.length === 0) {
          res.status(404).send({ mensaje: "El rol especificado no existe" });
          return;
        }

        const contrasenaHashed = await bcrypt.hash(contrasena, 8);
        const rol_id = rolRow[0].id;

        const [rows] = await db.execute(
          "INSERT INTO empleado (nombre, apellido, user, mail, contrasena, rol_id) VALUES (?, ?, ?, ?, ?, ?)",
          [nombre, apellido, user, mail, contrasenaHashed, rol_id]
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
    body("rolNombre").isLength({ min: 1 }), // Asegúrate de validar el nuevo rolNombre
    body("nombre").isLength({ min: 1, max: 25 }),
    body("apellido").isLength({ min: 1, max: 50 }),
    body("user").isLength({ min: 1, max: 50 }),
    body("mail").isEmail(),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { id } = req.params;
      const { rolNombre, nombre, apellido, user, mail } = req.body;

      try {
        // Obtén el ID del nuevo rol a partir del nombre
        const [rolRow] = await db.execute(
          "SELECT id FROM rol WHERE nombre = ?",
          [rolNombre]
        );

        if (rolRow.length === 0) {
          res
            .status(404)
            .send({ mensaje: "El nuevo rol especificado no existe" });
          return;
        }

        const nuevoRol_id = rolRow[0].id;

        // Realiza la actualización del empleado con todos los campos
        await db.execute(
          "UPDATE empleado SET nombre = ?, apellido = ?, user = ?, mail = ?, rol_id = ? WHERE id = ?",
          [nombre, apellido, user, mail, nuevoRol_id, id]
        );

        res.send({ mensaje: "Empleado actualizado correctamente" });
      } catch (error) {
        console.error("Error al actualizar el empleado:", error);
        res.status(500).send({ mensaje: "Error interno del servidor" });
      }
    }
  )

  // Ruta para obtener todos los empleados o filtrar por diferentes criterios
  .get(
    "/filtro/",
    query("nombre").isLength({ min: 2, max: 50 }),
    query("apellido").isLength({ min: 2, max: 80 }),
    query("user").isLength({ min: 2, max: 50 }),
    query("mail").optional().isLength({ min: 1, max: 255 }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      try {
        let query =
          "SELECT id, nombre, apellido, mail, DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion FROM empleado WHERE 1=1";
        const conditions = [];
        const params = [];

        // Ejemplo de búsqueda por nombre
        if (req.query.nombre) {
          conditions.push("nombre = ?");
          params.push(req.query.nombre);
        }

        // Ejemplo de búsqueda por apellido
        if (req.query.apellido) {
          conditions.push("apellido = ?");
          params.push(req.query.apellido);
        }

        // Ejemplo de búsqueda por user
        if (req.query.user) {
          conditions.push("user = ?");
          params.push(req.query.user);
        }

        if (conditions.length > 0) {
          query += ` AND ${conditions.join(" AND ")}`;
        }

        const [rows, fields] = await db.execute(query, params);
        res.send(rows);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).send({ mensaje: "Error interno del servidor" });
      }
    }
  )

  .get("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
    const { id } = req.params;
    try {
      const [rows, fields] = await db.execute(
        "SELECT id, nombre, apellido, mail, DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion FROM empleado WHERE id = ?",
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
      const [result] = await db.execute("DELETE FROM empleado WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows > 0) {
        res.send({ mensaje: "Empleado eliminado correctamente" });
      } else {
        res
          .status(404)
          .send({ mensaje: "No se encontró el empleado para eliminar" });
      }
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      if (error.code === "ER_ROW_NOT_FOUND") {
        res
          .status(404)
          .send({ mensaje: "No se encontró el empleado para eliminar" });
      } else {
        res
          .status(500)
          .send({ mensaje: "Error interno del servidor al eliminar empleado" });
      }
    }
  });

export default empleadoRouter;
