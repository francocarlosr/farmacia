import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../../db.js";
import { body, query, param, validationResult } from "express-validator";

export const empleadosRouter = express
  .Router()

  .post(
    "/",
    body("usuario").isAlphanumeric().isLength({ min: 1, max: 25 }),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    body("rol").isAlphanumeric().isLength({ min: 1, max: 25 }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }
      const { usuario, password, rol, personaId } = req.body;
      const passwordHashed = await bcrypt.hash(password, 8);
      const [rows] = await db.execute(
        "INSERT INTO empleado (usuario, password, rol) VALUES (:usuario, :password, :rol)",
        { usuario, password: passwordHashed, rol}
      );
      res.status(201).send({ id: rows.insertId, usuario, rol });
    }
  )
  .put(
    "/:id",
    param("id").isInt({ min: 1 }),
    body("usuario").isAlphanumeric().isLength({ min: 1, max: 25 }).optional(),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }).optional(),
    body("rol").isAlphanumeric().isLength({ min: 1, max: 25 }).optional(),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { id } = req.params;
      const { usuario, password, rol } = req.body;

      // Obtener el empleado existente
      const [rows] = await db.execute(
        "SELECT * FROM empleado WHERE id = :id",
        { id }
      );

      if (rows.length === 0) {
        res.status(404).send({ mensaje: "Empleado no encontrado" });
        return;
      }

      // Modificar los valores proporcionados (si existen)
      const usuarioActualizado = usuario || rows[0].usuario;
      const passwordActualizado = password
        ? await bcrypt.hash(password, 8)
        : rows[0].password;
      const rolActualizado = rol || rows[0].rol;

      // Actualizar el empleado en la base de datos
      await db.execute(
        "UPDATE empleado SET usuario = :usuario, password = :password, rol = :rol WHERE id = :id",
        { id, usuario: usuarioActualizado, password: passwordActualizado, rol: rolActualizado }
      );

      res.send({ mensaje: "Empleado actualizado correctamente" });
    }
  )

  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute(
      "SELECT id, usuario, rol FROM empleado"
    );
    res.send(rows);
  })

  .get("/:usuario", async (req, res) => {
    const { usuario } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT id, usuario, rol FROM empleado WHERE usuario=:usuario",
      { usuario }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "empleado no encontrado" });
    }
  })


  .delete("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
    const { id } = req.params;
    await db.execute("DELETE FROM empleado WHERE id = :id", { id });
    res.send("ok");
  });