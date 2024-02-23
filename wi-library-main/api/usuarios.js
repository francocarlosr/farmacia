import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import bcrypt from "bcryptjs"
import passport from "passport";

export const usuariosRouter = express.Router();

const generarWhere = (id) => {
    if (id != null ) {
        return "WHERE id_usuario=:id"
    } else { 
    return " "
    }
};

// GET /usuarios - Obtener todas las usuarios 
usuariosRouter.get("/", 
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    res.send(await getAllUsers());
});

const getAllUsers = async () => {

    const [rows,fields] = await db.execute("call get_all_usuarios();");
    const response = rows[0].map((item)=>{
        return {
            "usuario" : {
                "id_usuario": item.id_usuario,
                "username": item.username,
                "password": item.password,
                "fecha_alta": item.fecha_alta
            },
            "persona": {
                "id_persona": item.id_persona,
                "nombre": item.persona_nombre,
                "apellido": item.persona_apellido,
                "email": item.persona_email,
                "telefono": item.persona_telefono,
                "direccion": item.persona_direccion,
                "tipo": item.persona_tipo
            },
            "rol":{
                "id_rol": item.id_rol,
                "nombre": item.rol_nombre
        }
        }
    })

    return response;

}

const getUserbyId = async (id) => {
    const [rows, fields] = await db.execute("call get_usuario(:id);", { id });
    let response;
         response = rows[0].map((item) => {
            return {
                "usuario": {
                    "id_usuario": item.id_usuario,
                    "username": item.username,
                    "password": item.password,
                    "fecha_alta": item.fecha_alta
                },
                "persona": {
                    "id_persona": item.id_persona,
                    "nombre": item.persona_nombre,
                    "apellido": item.persna_apellido,
                    "email": item.persona_email,
                    "telefono": item.persona_telefono,
                    "direccion": item.persona_direccion,
                    "tipo": item.persona_tipo
                },
                "rol": {
                    "id_rol": item.id_rol,
                    "nombre": item.rol_nombre
                }
            }
        })
    
        return response;
}

//GET /usuarios/:id - Obtener una tabla por id
usuariosRouter.get("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const id = req.params.id;
    const user = await getUserbyId(id)
    if (user) {
      res.send(user);
    } else {
        res.status(404).send({mensaje: "Usuario no encontrado"});
    }
    });




// { "tabla" : { }}
// POST /usuarios - Crear una nueva tabla
usuariosRouter.post("/",
    body("usuario.id_persona").isInt({min: 1, max: 2147483647}),
    body("usuario.username").isAlphanumeric().isLength({min: 1, max: 45}),
    body("usuario.password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    }),
    body("usuario.id_rol").isInt({min: 1, max: 2147483647}),
    async (req, res) => {
      
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const usuario = req.body.usuario;
    const passwordHashed = await bcrypt.hash(usuario.password, 8)
    const [rows] = await db.execute(
      "INSERT INTO usuarios (id_persona, username, password, id_rol, fecha_modificacion) VALUES (:id_persona, :username, :password, :id_rol, NOW())",
      { id_persona: usuario.id_persona, username: usuario.username, password: passwordHashed, id_rol: usuario.id_rol }
        );
        const usuarios = await getAllUsers();
    res.status(201).send(usuarios);
    });





// PUT /usuarios/:id - Modificar una tabla por id
usuariosRouter.put("/:id", 
passport.authenticate("jwt", { session: false }),
body("id_persona").isInt({min: 1, max: 2147483647}),
body("username").isAlphanumeric().isLength({min: 1, max: 45}),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    }),
body("id_rol").isInt({min: 1, max: 2147483647}),
async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const id = req.params.id;
    const {id_persona, username, password, id_rol} = req.body;
    const passwordHashed = await bcrypt.hash(password, 8)
    await db.execute(
      `UPDATE usuarios SET id_persona=:id_persona, username=:username, password=:password, id_rol=:id_rol, fecha_modificacion=NOW() ${generarWhere(id)}`,
      { id, id_persona, username, password: passwordHashed, id_rol }
    );

    const usuarios = await getAllUsers()
    res.send(usuarios);
});

// DELETE /usuarios/:id - Quitar una tabla por id
usuariosRouter.delete("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }    

    const id = req.params.id;
    await db.execute(`DELETE FROM usuarios ${generarWhere(id)}`, { id });
    res.send("Se ha borrado el usuario.");
});
