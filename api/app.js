import "dotenv/config";
import express from "express";
import cors from "cors";

import { comprasRouter } from "./src/rutas/compras.js";
import { ventasRouter } from "./src/rutas/ventas.js";
import { productoRouter } from "./src/rutas/producto.js";
import { empleadoRouter } from "./src/rutas/empleado.js";

// Creo aplicacion express
const app = express();
app.use(express.json());
app.use(cors());


app.use("/compras", comprasRouter);
app.use("/ventas", ventasRouter);
app.use("/producto", productoRouter);
app.use("/empleado", empleadoRouter);

// Registrar metodo GET en ruta raiz ('/')
app.get("/", (req, res) => {
  res.send("Hola mundo");
});
// Pongo en funcionamiento la API en puerto 3000
app.listen(3000, () => {
  console.log("API en funcionamiento");
});

