import "dotenv/config";
import express from "express";
import cors from "cors";

import { comprasRouter } from "./src/rutas/compras.js";
import { ventasRouter } from "./src/rutas/ventas.js";
import { productoRouter } from "./src/rutas/producto.js";
import { empleadosRouter } from "./src/rutas/empleados.js";
import { authConfig, authRouter } from "./src/componentes/auth.js";

// Creo aplicacion express
const app = express();
app.use(express.json());
app.use(cors());

authConfig();


app.use("/auth", authRouter);
app.use("/compras", comprasRouter);
app.use("/ventas", ventasRouter);
app.use("/producto", productoRouter);
app.use("/empleados", empleadosRouter);

// Registrar metodo GET en ruta raiz ('/')
app.get("/", (req, res) => {
  res.send("Hola mundo");
});
// Pongo en funcionamiento la API en puerto 3000
app.listen(3000, () => {
  console.log("API en funcionamiento");
});