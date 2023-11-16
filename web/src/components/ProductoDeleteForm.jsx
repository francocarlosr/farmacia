// src/components/Productos/ProductoDeleteForm.js
import React, { useState } from 'react';
import axios from '../../services/api';

const ProductoDeleteForm = () => {
  const [nombre, setNombre] = useState('');

  const eliminarProducto = async () => {
    try {
      await axios.delete(`/productos/${nombre}`);
      console.log('Producto eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }}
