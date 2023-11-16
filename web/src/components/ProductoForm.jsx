// src/components/Productos/ProductoForm.js
import React, { useState } from 'react';
import axios from '../../services/api';

const ProductoForm = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    codigo: '',
    precio: '',
    stock: '',
  });

  const handleInputChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const ingresarProducto = async () => {
    try {
      await axios.post('/productos', producto);
      console.log('Producto ingresado con éxito');
      // Puedes agregar lógica adicional, como actualizar la lista de productos
    } catch (error) {
      console.error('Error al ingresar producto:', error);
    }
  };

  return (
    <div>
      <h2>Ingresar Producto</h2>
      <form>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={producto.nombre} onChange={handleInputChange} />
        <label>Código:</label>
        <input type="text" name="codigo" value={producto.codigo} onChange={handleInputChange} />
        <label>Precio:</label>
        <input type="text" name="precio" value={producto.precio} onChange={handleInputChange} />
        <label>Stock:</label>
        <input type="text" name="stock" value={producto.stock} onChange={handleInputChange} />
        <button type="button" onClick={ingresarProducto}>Ingresar</button>
      </form>
    </div>
  );
};

export default ProductoForm;
