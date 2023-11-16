// src/components/Productos/ProductoUpdateForm.js
import React, { useState } from 'react';
import axios from '../../services/api';

const ProductoUpdateForm = () => {
  const [id, setId] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');

  const actualizarNombre = async () => {
    try {
      await axios.put(`/productos/${id}`, { nombre: nuevoNombre });
      console.log('Nombre del producto actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar nombre del producto:', error);
    }
  };

  return (
    <div>
      <h2>Actualizar Nombre del Producto</h2>
      <label>ID del Producto:</label>
      <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      <label>Nuevo Nombre:</label>
      <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
      <button type="button" onClick={actualizarNombre}>Actualizar Nombre</button>
    </div>
  );
};

export default ProductoUpdateForm;
