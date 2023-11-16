// src/components/Productos/ProductoSearch.js
import React, { useState } from 'react';
import axios from '../../services/api';

const ProductoSearch = () => {
  const [nombre, setNombre] = useState('');
  const [productoEncontrado, setProductoEncontrado] = useState(null);

  const buscarProducto = async () => {
    try {
      const response = await axios.get(`/productos/${nombre}`);
      setProductoEncontrado(response.data);
    } catch (error) {
      console.error('Producto no encontrado:', error);
      setProductoEncontrado(null);
    }
  };

  return (
    <div>
      <h2>Buscar Producto</h2>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={buscarProducto}>Buscar</button>
      {productoEncontrado && (
        <div>
          <h3>Producto Encontrado:</h3>
          <p>ID: {productoEncontrado.id}</p>
          <p>Nombre: {productoEncontrado.nombre}</p>
          {/* Mostrar más detalles según tus necesidades */}
        </div>
      )}
    </div>
  );
};

export default ProductoSearch;
