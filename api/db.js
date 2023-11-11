import "dotenv/config";
import mysql from "mysql2/promise";

// Conectar a base de datos
export const db = await mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  // No hay contraseña en este caso
  password: process.env.DB_PASS ,
  database: process.env.DB_NAME ,
  namedPlaceholders: true,
});

console.log("Conectado a base de datos");