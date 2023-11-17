import "dotenv/config";
import express from "express";
import cors from "cors";

import { comprasRouter } from "./compras.js";
import { ventasRouter } from "./ventas.js";
import { empleadosRouter } from "./empleados.js";
import { authConfig, authRouter } from "./auth.js";

// Creo aplicacion express
const app = express();

app.use(express.json());
app.use(cors());

authConfig();

app.use("/auth", authRouter);
app.use("/compras", comprasRouter);
app.use("/ventas", ventasRouter);
app.use("/empleados", empleadosRouter);

// Registrar metodo GET en ruta raiz ('/')
app.get("/", (req, res) => {
  res.send("Hola mundo");
});
// Pongo en funcionamiento la API en puerto 3000
app.listen(3000, () => {
  console.log("API en funcionamiento");
});

