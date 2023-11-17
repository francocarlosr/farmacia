import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js";
import { body, validationResult } from "express-validator"; // Importa validationResult aquí

export const loginRouter = express
  .Router()
  // Tu ruta de inicio de sesión
  .post(
    "/",
    body("mail").isEmail(),
    body("contrasena").isLength({ min: 8 }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        return res.status(400).send({ errors: validacion.array() });
      }

      const { mail, contrasena } = req.body;

      try {
        // Verificar si el empleado existe en la base de datos
        const [empleadoRow] = await db.execute(
          "SELECT * FROM empleado WHERE mail = ?",
          [mail]
        );

        if (empleadoRow.length === 0) {
          return res.status(401).send({ mensaje: "Credenciales incorrectas" });
        }

        const empleado = empleadoRow[0];

        // Verificar la contraseña
        const contrasenaValida = await bcrypt.compare(
          contrasena,
          empleado.contrasena
        );

        if (!contrasenaValida) {
          return res.status(401).send({ mensaje: "Credenciales incorrectas" });
        }

        // Generar un token de sesión
        const token = jwt.sign(
          { userId: empleado.id, mail: empleado.mail },
          "token_seguridad_messi",
          {
            expiresIn: "1h", // Puedes ajustar la expiración del token según tus necesidades
          }
        );

        // Devolver el token como respuesta
        res.send({ token });
      } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).send({ mensaje: "Error interno del servidor" });
      }
    }
  );
