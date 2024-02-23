import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

export const librosRouter = express.Router()

const generarWhere=(id)=>{
    if (id!=null) {
        return "WHERE id_libro=:id";
        
    }
    return "";
}



// GET /libros - Obtener todas las libros 
librosRouter.get("/",
passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    const [rows,fields] = await db.execute("call get_all_libros()");
    const response = rows[0].map((item)=>{
        return {
                "id_libro": item.id_libro,
                "nombre" : item.libro_nombre,
                "año": item.libro_año,
                "tipo": item.libro_tipo,
                "isbn": item.libro_isbn,
                "fecha_alta": item.libro_fecha_alta,
                "precio": item.libro_precio,
                "nombre_autor": item.autor_nombre,
                "nombre_categoria": item.categoria_nombre,
                "nombre_editorial": item.editorial_nombre,
                "nombre_proveedor": item.proveedor_nombre,
                "id_autor": item.id_autor,
                "id_categoria": item.id_categoria,
                "id_editorial": item.id_editorial,
                "id_proveedor": item.id_proveedor,
                "stock": item.stock != null ? parseInt(item.stock) : 0,
                "ventas": item.ventas != null ? parseInt(item.ventas) : 0,
        }
    })
        res.send(response);
});

//GET /libros/:id - Obtener una tabla por id
librosRouter.get("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({min:1, max:2147483647}),
    async (req, res) => {
        const validacion= validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({errors:validacion.errors})
            return
            
        }
    const {id} = req.params;
    const [rows, fields] = await db.execute('CALL get_libro(?)', [id])
    if (rows.length > 0){
        const response = rows[0].map((item)=>{
            return {
                "id_libro": item.id_libro,
                "nombre" : item.libro_nombre,
                "año": item.libro_año,
                "tipo": item.libro_tipo,
                "isbn": item.libro_isbn,
                "fecha_alta": item.libro_fecha_alta,
                "precio": item.libro_precio,
                "nombre_autor": item.autor_nombre,
                "nombre_categoria": item.categoria_nombre,
                "nombre_editorial": item.editorial_nombre,
                "nombre_proveedor": item.proveedor_nombre,
                "id_autor": item.id_autor,
                "id_categoria": item.id_categoria,
                "id_editorial": item.id_editorial,
                "id_proveedor": item.id_proveedor,
                
            }
        })
        res.send(response);
    } else {
        res.status(404).send({mensaje: "Registro no encontrado"});
    }
})

// { "tabla" : { }}
// POST /libros - Crear una nueva tabla
librosRouter.post("/",
    passport.authenticate("jwt", { session: false }),
    body('nombre').isString().isLength({ min: 1, max: 45 }),
    body('año'),
    body('tipo'),
    body('isbn'),    
    body('id_categoria'),
    body('id_proveedor'),
    body('id_autor'),
    body('id_editorial'),
    body('precio').isFloat({ min: 1, max: 2147483647 }),
    async (req, res) => {
        const validacion = validationResult(req);
    if (!validacion.isEmpty()) {        
        res.status(400).send({errors:validacion.errors})
        return
    }
    const { nombre, año, tipo, isbn, id_categoria, id_proveedor, id_autor, id_editorial, precio } = req.body;
  
    const [rows] = await db.execute(
        "INSERT INTO libros (nombre, año, tipo, isbn, id_categoria, id_proveedor, id_autor, id_editorial, fecha_modificacion, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(),?)",
        [nombre, año, tipo, isbn, id_categoria, id_proveedor, id_autor, id_editorial, precio]
    );
    
        const libroId = rows.insertId
      
        
    //Hacer funcion     
    const [rowsLibro, fields] = await db.execute('CALL get_libro(?)', [libroId])
        const response = rowsLibro[0].map((item)=>{
                return {
                    "id_libro": item.id_libro,
                    "nombre" : item.libro_nombre,
                    "año": item.libro_año,
                    "tipo": item.libro_tipo,
                    "isbn": item.libro_isbn,
                    "fecha_alta": item.libro_fecha_alta,
                    "precio": item.libro_precio,
                    "nombre_autor": item.autor_nombre,
                    "nombre_categoria": item.categoria_nombre,
                    "nombre_editorial": item.editorial_nombre,
                    "nombre_proveedor": item.proveedor_nombre,
                    "id_autor": item.id_autor,
                    "id_categoria": item.id_categoria,
                    "id_editorial": item.id_editorial,
                    "id_proveedor": item.id_proveedor,
            }
        })
        res.status(201).send( response[0]);
    
  });
  
  


// PUT /libros/:id - Modificar una tabla por id
librosRouter.put("/:id",
    passport.authenticate("jwt", { session: false }),
    param("id").isInt({ min: 1, max: 2147483647 }),
    body('nombre').isString().isLength({ min: 1, max: 45 }),
    body('año').isInt({ min: 1, max: 2147483647 }),
    body('precio').isFloat({ min: 1, max: 2147483647 }),
    body('tipo').isString().isLength({ min: 1, max: 45 }),
    body('isbn').custom(value => {
        const cleanedISBN = value.replace(/-|\s/g, '');
        if (cleanedISBN.length === 10 || cleanedISBN.length === 13) {
            return true;
        }
        throw new Error('El ISBN debe ser válido (ISBN-10 o ISBN-13).');
    }),    
    body('id_autor').isInt({ min: 1, max: 2147483647 }),
    body('id_categoria').isInt({ min: 1, max: 2147483647 }),
    body('id_proveedor').isInt({ min: 1, max: 2147483647 }),
    body('id_editorial').isInt({ min: 1, max: 2147483647 }),

    async (req, res) => {
        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({ errors: validacion.errors })
            return
        }
        
        const { id } = req.params;
        const { nombre, año, tipo, isbn, precio, id_autor, id_categoria, id_proveedor, id_editorial } = req.body;
        
        await db.execute(
            "UPDATE libros SET nombre = ?, año= ?, tipo = ?, isbn = ?, fecha_modificacion = NOW(), precio=?, id_autor=?, id_categoria=?,id_proveedor=?, id_editorial=? WHERE id_libro = ?",
            [nombre, año, tipo, isbn, precio, id_autor, id_categoria, id_proveedor, id_editorial, id]
        );
        
        res.send("Registro actualizado correctamente");
    });


// DELETE /libros/:id - Quitar una tabla por id
librosRouter.delete("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({min:1, max:2147483647}),
    async (req, res) => {
        const validacion= validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({errors:validacion.errors})
            return
            
        }
    const {id} = req.params;
    await db.execute(`DELETE FROM libros ${generarWhere(id)}`, { id });
    res.send("Se ha borrado el registro.");
})


