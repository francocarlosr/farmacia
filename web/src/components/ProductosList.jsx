// src/components/Productos/ProductosList.js
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

const ProductosList = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/productos');
      setProductos(response.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Listado de Productos</h2>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>{producto.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductosList;
