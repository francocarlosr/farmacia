// Importa las dependencias necesarias
import { db } from "../db/db.js";

// Función para obtener todos los roles
export const obtenerRoles = async () => {
  try {
    const [rows, fields] = await db.execute("SELECT * FROM rol");
    return rows;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw error;
  }
};

export const obtenerRolPorId = async (rol_id) => {
  try {
    const [rows, fields] = await db.execute("SELECT * FROM rol WHERE id = ?", [
      rol_id,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error al obtener rol por ID:", error);
    throw error;
  }
};

export const agregarRol = async (nombre) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      "INSERT INTO rol (nombre) VALUES (?)",
      [nombre]
    );

    await connection.commit();
    return { id: rows.insertId, nombre };
  } catch (error) {
    await connection.rollback();
    console.error("Error al agregar rol:", error);
    throw error;
  } finally {
    connection.release();
  }
};

export const actualizarRol = async (rol_id, nombre) => {
    await db.execute("UPDATE rol SET nombre = ? WHERE id = ?", [nombre, rol_id]);
    return { id: rol_id, nombre };
  };
  

export const eliminarRol = async (rol_id) => {
  await db.execute("DELETE FROM rol WHERE id = ?", [rol_id]);
  return { mensaje: "Rol eliminado correctamente" };
};