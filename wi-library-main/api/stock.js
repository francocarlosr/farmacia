import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

export const stockRouter = express.Router();

const generarWhere = (id) => {
    if (id != null) {
        return "WHERE id_stock= :id"
    }
    return ""
}


stockRouter.get("/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    const [rows, fields] = await db.execute("CALL get_all_stock()");
    res.send(rows);
  })



stockRouter.get("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({ min: 1, max: 2147483647 }),
    async (req, res) => {
        const validacion = validationResult(req)
        if (!validacion.isEmpty()) {
            res.status(400).send({ errors: validacion.errors })
            return 
        }
        const {id} = req.params
        const [rows, fields] = await db.execute('CALL get_stock(?)', [id]);
        if (rows.length > 0){
            const response = rows[0].map((item)=>{
                return {
                    "stock" : {
                        "id_stock": item.id_stock,
                        "cantidad" : item.stock_cantidad,
                        "fecha_alta": item.stock_fecha_alta
                    },
                    "libro" : {
                        "id_libro": item.id_libro,
                        "nombre" : item.libro_nombre,
                        "año": item.libro_año,
                        "tipo": item.libro_tipo,
                        "isbn": item.libro_isbn,
                        "fecha_alta": item.libro_fecha_alta
                    }
                }
            })
            res.send(response);
        } else {
            res.status(404).send({mensaje: "Registro no encontrado"});
        }
})

stockRouter.post("/libros/:id",
passport.authenticate("jwt", { session: false }),
    body("cantidad").isInt({ min: 1, max: 2147483647 }),
    body("id_libro").isInt({min: 1, max: 2147483647}),
    async (req, res) => {
        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({ errors: validacion.array() });
            return;
        }

        const { cantidad } = req.body;
        const id_libro = req.params.id; 

        const [rows] = await db.execute(
            "INSERT INTO stock (cantidad, id_libro, fecha_modificacion) VALUES (:cantidad, :id_libro, NOW())",
            { cantidad, id_libro }
        );

        res.status(201).send({ cantidad, id_libro, id_stock: rows.insertId });
    });


stockRouter.put("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({ min: 1, max: 2147483647 }),
    body("cantidad").isInt({ min: 1, max: 2147483647 }),
    async (req, res) => {
        console.log(req.body.stock);
        const validacion= validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({errors:validacion.array()})
            return
        }
        const  {id} = req.params;
        const {cantidad} = req.body;
        await db.execute(
        `UPDATE stock SET cantidad=:cantidad, fecha_modificacion=NOW() ${generarWhere(id)}`,
        { id,  cantidad}
        );
        res.send("ok");
   
})

stockRouter.delete("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({ min: 1, max: 2147483647 }),
    async (req, res) => {
        const validacion = validationResult(req)
        if (!validacion.isEmpty()) {
            res.status(400).send({ errors: validacion.errors })
            return 
        }
        const { id } = req.params
        await db.execute(`DELETE FROM stock ${generarWhere(id)}`, { id });
        res.send("Se ha borrado el registro.");
        
})