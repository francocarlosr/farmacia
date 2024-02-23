import "dotenv/config";
import express from "express";
import cors from "cors";

import { personasRouter } from "./personas.js";
import { usuariosRouter } from "./usuarios.js";
import { librosRouter } from "./libros.js";
import { rolesRouter } from "./roles.js";
import { stockRouter } from "./stock.js";
import { ventasRouter } from "./ventas.js";
import { ventaProductoRouter } from "./ventasPorProductos.js";
import { authConfig, authRouter } from "./auth.js";

const app = express();
app.use(express.json());
app.use(cors());
authConfig();

app.use("/auth", authRouter);
app.use("/personas", personasRouter);
app.use("/libros", librosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/roles", rolesRouter);
app.use("/stock", stockRouter);
app.use("/ventas", ventasRouter)
app.use("/ventas-productos", ventaProductoRouter);

app.get("/", (req, res) => {
  res.send("Check!");
});

app.listen(3000, () => {
  console.log("API en funcionamiento");
});
