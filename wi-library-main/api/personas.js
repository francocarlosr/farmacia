import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

export const personasRouter = express.Router();

const generarWhere = (id) => {
    if (id != null ) {
        return "WHERE id_persona=:id"
    } else { 
    return " "
    }
};

    

// GET /personass - Obtener todas las personasss 
personasRouter.get("/",
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    const [rows,fields] = await db.execute("SELECT * FROM personas");
    res.send(rows);
});

//GET /personass/:id - Obtener una personass por id
personasRouter.get("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const {id} = req.params.id;
    const [rows,fields] = await db.execute(`SELECT * FROM personas ${generarWhere(id)}` , {id});
    if (rows.length > 0){
        res.send(rows[0]);
    } else {
        res.status(404).send({mensaje: "persona no encontrada"});
    }
});

// { "personass" : { }}
// POST /personass - Crear una nueva personass
personasRouter.post("/", 
passport.authenticate("jwt", { session: false }),
body("persona.nombre").isString().isLength({min: 1, max: 45}),
body("persona.apellido").isString().isLength({min: 1, max: 45}),
body("persona.email").isEmail().isLength({min: 1, max: 45}),
body("persona.telefono").isInt().isLength({min: 1, max: 999999999999999}),
body("persona.direccion").isString().isLength({min: 1, max: 45}),
body("persona.tipo").isString().isLength({min: 1, max: 45}),

async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const persona = req.body.persona;
    const [rows] = await db.execute(
      "INSERT INTO personas (nombre, apellido, email, telefono, direccion, fecha_modificacion, tipo ) VALUES (:nombre, :apellido, :email, :telefono, :direccion, NOW(), :tipo)",
      { nombre: persona.nombre, apellido: persona.apellido, email: persona.email, 
        telefono: persona.telefono, direccion: persona.direccion, tipo: persona.tipo }
    );
    res.status(201).send({ ...persona, id_persona: rows.insertId });
});

// PUT /personass/:id - Modificar una personass por id
personasRouter.put("/:id", 
passport.authenticate("jwt", { session: false }),
body("persona.nombre").isString().isLength({min: 1, max: 45}),
body("persona.apellido").isString().isLength({min: 1, max: 45}),
body("persona.email").isEmail().isLength({min: 1, max: 45}),
body("persona.telefono").isInt().isLength({min: 1, max: 999999999999999}),
body("persona.direccion").isString().isLength({min: 1, max: 45}),
body("persona.tipo").isString().isLength({min: 1, max: 45}),
async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const {id} = req.params;
    const persona = req.body.persona;
    await db.execute(
        `UPDATE personas SET nombre=:nombre, apellido=:apellido, email=:email, telefono=:telefono, direccion=:direccion, fecha_modificacion=NOW(), tipo=:tipo ${generarWhere(id)}` ,

      { id, nombre: persona.nombre, apellido: persona.apellido, email: persona.email, 
        telefono: persona.telefono, direccion: persona.direccion, fecha_modificacion: persona.fecha_modificacion,
        tipo: persona.tipo }
    );
    res.send("ok");
});

// DELETE /personasss/:id - Quitar una personass por id
personasRouter.delete("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
    async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }    
    const {id} = req.params;
    await db.execute(`DELETE FROM personas ${generarWhere(id)}` , { id });
    res.send("Se ha borrado a la persona.");
});
 

