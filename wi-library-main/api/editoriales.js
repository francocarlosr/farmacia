import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import passport from "passport";


export const editorialRouter = express.Router();

const generarWhere = (id) => {
    if (id != null) {
        return "WHERE id_editorial= :id"
    }
    return ""
}

// GET /personas - Obtener todas las personas 
editorialRouter.get("/",
passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    const [rows,fields] = await db.execute("SELECT * FROM editorial");
    res.send(rows);
});

//GET /editorial/:id - Obtener una tabla por id
editorialRouter.get("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({ min: 1, max: 2147483647 }),
    async (req, res) => {
        const validacion = validationResult(req)
        if (!validacion.isEmpty()) {
            res.status(400).send({ errors: validacion.errors })
            return 
        }
        const {id} = req.params
        const [rows, fields] = await db.execute(`SELECT * FROM editorial ${generarWhere(id)}`, {id});

        if (rows.length > 0){
            res.send(rows[0]);
        } else {
            res.status(404).send({mensaje: "Registro no encontrado"});
        }
    });

// { "tabla" : { }}
// POST /personas - Crear una nueva tabla
editorialRouter.post("/",
passport.authenticate("jwt", { session: false }),
    body("editorial.nombre").isString().isLength({ min: 1, max: 45 }),
    async (req, res) => {
        const validacion = validationResult(req)
        if (!validacion.isEmpty()) {
            res.status(400).send({ errors: validacion.errors })
            return 
        }
        const editorial = req.body.editorial;
        const [rows] = await db.execute(
            "INSERT INTO editorial (nombre,fecha_modificacion) VALUES (:nombre, NOW())",
            { nombre: editorial.nombre }
    );
    res.status(201).send({ ...editorial, id_editorial: rows.insertId });
});

// PUT /personas/:id - Modificar una tabla por id
editorialRouter.put("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({ min: 1, max: 2147483647 }),
    body("editorial.nombre").isString().isLength({ min: 1, max: 45 }),
    async (req, res) => {
        const validacion = validationResult(req)
        if (!validacion.isEmpty()) {
            res.status(400).send({ errors: validacion.errors })
            return 
        }
    const {id} = req.params
    const editorial = req.body.editorial;
    await db.execute(
      `UPDATE editorial SET nombre=:nombre, fecha_modificacion=NOW() ${generarWhere(id)}`,
      { id, nombre: editorial.nombre}
    );
    res.send("ok");
});

// DELETE /personas/:id - Quitar una tabla por id
editorialRouter.delete("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({ min: 1, max: 2147483647 }),
    async (req, res) => {
        const validacion = validationResult(req)
        if (!validacion.isEmpty()) {
            res.status(400).send({ errors: validacion.errors })
            return 
        }
    const {id} = req.params
    await db.execute(`DELETE FROM editorial ${generarWhere(id)}`, { id });
    res.send("Se ha borrado el registro.");
});
