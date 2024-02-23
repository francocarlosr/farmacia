import express from "express";
import { db } from "./db.js";
import {body, param, query, validationResult } from "express-validator"
import passport from "passport";

export const autoresRouter = express.Router();

const generarWhere = (id) => {
    if (id != null){
        return "WHERE id_autor =:id";
    }
    return "";
};

// GET /autores - Obtener todas las autores 
autoresRouter.get("/",
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    const [rows,fields] = await db.execute("SELECT * FROM autores");
    res.send(rows);
});

//GET /autores/:id - Obtener una autor por id
autoresRouter.get("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1 , max:2147483647}),
async (req,res) =>{
    const validacion = validationResult(req);
    if (!validacion.isEmpty()){
        res.status(400).send({errors: validacion.errors})
        return
    }
    
    const {id} = req.params;
    const [rows,fields] = await db.execute(`SELECT * FROM autores ${generarWhere(id)}`, {id});
    if (rows.length > 0){
        res.send(rows[0]);
    } else {
        res.status(404).send({mensaje: "Registro no encontrado"});
    }
});

// { "autor" : { }}
// POST /autores - Crear una nueva autor
autoresRouter.post("/",
passport.authenticate("jwt", { session: false }),
body("autor.nombre").isString().isLength({min:1 , max:45},),
body("autor.apellido").isString().isLength({min:1 , max:45}),
body("autor.nacionalidad").isString().isLength({min:1 , max:45}),
body("autor.biografia").isString().isLength({min:1 , max:200}),
body("autor.fecha_nacimiento").custom((dateTime) => {
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
    if (!dateTime.match(dateTimeRegex)) {
      throw new Error('El formato de fecha y hora no es válido. Debe ser YYYY-MM-DD HH:mm:ss.');
    }
    return true;
}),
async (req,res) =>{
    const validacion= validationResult(req);
    if (!validacion.isEmpty()) {
        res.status(400).send({errors:validacion.errors})
        return
        
    }


    const autor = req.body.autor;
    const [rows] = await db.execute(
      "INSERT INTO autores (nombre,apellido,nacionalidad,biografia,fecha_nacimiento,fecha_modificacion) VALUES (:nombre, :apellido, :nacionalidad, :biografia, :fecha_nacimiento, NOW())",
      { nombre: autor.nombre, apellido: autor.apellido, nacionalidad: autor.nacionalidad, biografia: autor.biografia, fecha_nacimiento: autor.fecha_nacimiento}
    );
    res.status(201).send({ ...autor, id_autor: rows.insertId });
});

// PUT /autores/:id - Modificar una autor por id
autoresRouter.put("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1 , max:2147483647}),
body ("autor.nombre").isString().isLength({min:1 , max:45},),
body ("autor.apellido").isString().isLength({min:1 , max:45}),
body ("autor.nacionalidad").isString().isLength({min:1 , max:45}),
body ("autor.biografia").isString().isLength({min:1 , max:200}),
body("autor.fecha_nacimiento").custom((dateTime) => {
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
    if (!dateTime.match(dateTimeRegex)) {
      throw new Error('El formato de fecha y hora no es válido. Debe ser YYYY-MM-DD HH:mm:ss.');
    }
    return true;
}),

async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()){
        res.status(400).send({errors: validacion.errors})
        return
    }
    
    const {id} = req.params;
    const autor = req.body.autor;
    await db.execute(
    `UPDATE autores SET nombre=:nombre, apellido=:apellido, nacionalidad=:nacionalidad, biografia=:biografia ,fecha_nacimiento=:fecha_nacimiento,fecha_modificacion =NOW() ${generarWhere(id)}`,
      { id, nombre: autor.nombre, apellido: autor.apellido, nacionalidad: autor.nacionalidad, biografia: autor.biografia, fecha_nacimiento: autor.fecha_nacimiento}
    );
    res.send("ok");
});

// DELETE /autores/:id - Quitar una autor por id
autoresRouter.delete("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1 , max:2147483647}),
async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()){
        res.status(400).send({errors: validacion.errors})
        return
    }
    const {id} = req.params;
    await db.execute(`DELETE FROM autores ${generarWhere(id)}`, { id });
    res.send("Se ha borrado el registro.");
});
