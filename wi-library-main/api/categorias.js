import express from "express";
import { db } from "./db.js";
import {body, param, query, validationResult} from "express-validator";
import passport from "passport";

export const categoriaRouter = express.Router();

const generarWhere=(id)=>{
    if (id!=null) {
        return "WHERE id_categoria=:id";
    }
    return "";
}

// GET /categorias - Obtener todas las categorias 
categoriaRouter.get("/",
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    const [rows,fields] = await db.execute("SELECT * FROM categorias");
    res.send(rows);
});

//GET /categorias/:id - Obtener una categoria por id
categoriaRouter.get("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1, max:2147483647}),
async (req,res) =>{
    const validacion= validationResult(req);
    if (!validacion.isEmpty()) {
        res.status(400).send({errors:validacion.errors})
        return
        
    }
     const {id}= req.params;
   
   //cantidad de registros y los nombres delas columnas
    const [rows,fields] = await db.execute(`SELECT * FROM categorias ${generarWhere(id)}`, {id});
    if (rows.length > 0){
        res.send(rows[0]);
    } else {
        res.status(404).send({mensaje: "Registro no encontrado"});
    }
});

// { "categoria" : { }}
// POST /categorias - Crear una nueva categoria
categoriaRouter.post("/",
passport.authenticate("jwt", { session: false }),
body("categoria.nombre").isString().isLength({min:1, max:45}),

async (req,res) =>{
    const validacion= validationResult(req);
    if (!validacion.isEmpty()) {
        res.status(400).send({errors:validacion.errors})
        return
        
    }
    const categoria = req.body.categoria;
    const [rows] = await db.execute(
      "INSERT INTO categorias (nombre, fecha_modificacion) VALUES (:nombre, NOW())",
      { nombre: categoria.nombre }
    );
    res.status(201).send({ ...categoria, id_categoria: rows.insertId });
});

// PUT /categorias/:id - Modificar una categoria por id
categoriaRouter.put("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1, max:2147483647}),
body("categoria.nombre").isString().isLength({min:1, max:45}),
 async (req, res) => {
    
    const validacion= validationResult(req);
    if (!validacion.isEmpty()) {
        res.status(400).send({errors:validacion.errors})
        return
        
    }
    const {id} = req.params;
    const categoria = req.body.categoria;
    await db.execute(
      `UPDATE categorias SET nombre=:nombre, fecha_modificacion=NOW() ${generarWhere(id)}`,
      { id, nombre: categoria.nombre}
    );
    res.send("ok");
});

// DELETE /categorias/:id - Quitar una categoria por id
categoriaRouter.delete("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1, max:2147483647}),
async (req, res) => {
    const validacion= validationResult(req);
    if (!validacion.isEmpty()) {
        res.status(400).send({errors:validacion.errors})
        return
        
    }
    const {id} = req.params;
    await db.execute(`DELETE FROM categorias ${generarWhere(id)}`, { id });
    res.send("Se ha borrado el registro.");
});
