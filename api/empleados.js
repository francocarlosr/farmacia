import express from "express";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
import { body, param, validationResult } from "express-validator";

/*
import { ExtractJwt, Strategy } from "passport-jwt";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { db } from "./db.js";

*/

export const empleadosRouter = express
  .Router()
/*
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
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }
      const { nombre, rol, password } = req.body;
      const passwordHashed = await bcrypt.hash(password, 8);
      const [rows] = await db.execute(
        "INSERT INTO empleado (usuario, password) VALUES (:usuario, :password)",
        { nombre, password: passwordHashed }
      );
      res.status(201).send({ id: rows.insertId, nombre,rol });
    }
  )*/


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
    //body("personaId").isInt({ min: 1 }),
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




  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute(
      "SELECT id, usuario, rol FROM empleado"
    );
    res.send(rows);
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT id, usuario, rol FROM empleado WHERE id = :id",
      { id }
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