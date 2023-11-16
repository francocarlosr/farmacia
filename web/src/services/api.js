// src/services/api.js
import axios from 'axios';

const apiUrl = 'http://localhost:3000'; // Reemplaza con la URL real de tu API

const api = axios.create({
  baseURL: apiUrl,
});

export const getProductos = async () => {
  try {
    const response = await api.get('/productos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

export const buscarProducto = async (nombre) => {
  try {
    const response = await api.get(`/productos/${nombre}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar producto:', error);
    throw error;
  }
};

export const ingresarProducto = async (nuevoProducto) => {
  try {
    const response = await api.post('/productos', nuevoProducto);
    return response.data;
  } catch (error) {
    console.error('Error al ingresar producto:', error);
    throw error;
  }
};

export const actualizarNombreProducto = async (id, nuevoNombre) => {
  try {
    const response = await api.put(`/productos/${id}`, { nombre: nuevoNombre });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar nombre del producto:', error);
    throw error;
  }
};

export const eliminarProducto = async (nombre) => {
  try {
    const response = await api.delete(`/productos/${nombre}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

// Agrega más funciones según sea necesario para otras secciones de tu aplicación
