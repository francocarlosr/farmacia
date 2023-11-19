import React, { useState, useEffect } from "react";

const ProductoForm = ({ onAgregarProducto, onEditarProducto }) => {
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    codigo: "",
    precio: "",
    stock: "",
  });

  const handleInputChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoProducto.id) {
      // Si hay un ID, estamos editando
      onEditarProducto(nuevoProducto);
    } else {
      onAgregarProducto(nuevoProducto);
    }
    setNuevoProducto({
      nombre: "",
      codigo: "",
      precio: "",
      stock: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nombre">Nombre:</label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        value={nuevoProducto.nombre}
        onChange={handleInputChange}
      />

      <label htmlFor="codigo">Código:</label>
      <input
        type="text"
        id="codigo"
        name="codigo"
        value={nuevoProducto.codigo}
        onChange={handleInputChange}
      />

      <label htmlFor="precio">Precio:</label>
      <input
        type="text"
        id="precio"
        name="precio"
        value={nuevoProducto.precio}
        onChange={handleInputChange}
      />

      <label htmlFor="stock">Stock:</label>
      <input
        type="text"
        id="stock"
        name="stock"
        value={nuevoProducto.stock}
        onChange={handleInputChange}
      />

      <button type="submit">{nuevoProducto.id ? "Editar" : "Agregar"} Producto</button>
    </form>
  );
};

<br />

const ProductoList = ({ productos, onEditar, onEliminar }) => {
  return (
    <ul>
      {productos.map((producto) => (
        <li key={producto.id}>
          {producto.nombre} - {producto.codigo} - ${producto.precio} - Stock: {producto.stock}
          <button onClick={() => onEditar(producto)}>Editar</button>
          <button onClick={() => onEliminar(producto.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    // Simulación de carga de productos desde la API
    fetch("http://localhost:3000/producto")
      .then((res) => res.json())
      .then((data) => setProductos(data));
  }, []);
  

  const handleAgregarProducto = (nuevoProducto) => {
    // Simulación de creación de un ID único (deberías hacerlo en el servidor)
    nuevoProducto.id = new Date().getTime();
    setProductos([...productos, nuevoProducto]);
  };

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
  };

  const handleEditarProductoSubmit = (productoEditado) => {
    // Simulación de actualización en la API
    const nuevosProductos = productos.map((p) =>
      p.id === productoEditado.id ? productoEditado : p
    );
    setProductos(nuevosProductos);
    setProductoEditando(null);
  };

  const handleEliminarProducto = (productoId) => {
    // Simulación de eliminación en la API
    setProductos(productos.filter((p) => p.id !== productoId));
  };

  const handleBuscarProducto = () => {
    // Lógica para buscar productos según el filtro (puedes personalizar según tus necesidades)
    // Aquí podrías hacer una nueva llamada a la API para obtener los productos filtrados
    // o simplemente filtrar los productos actuales en el estado
    const productosFiltrados = productos.filter((p) =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    setProductos(productosFiltrados);
  };

  const handleResetFiltro = () => {
    // Lógica para resetear el filtro y mostrar todos los productos nuevamente
    // Aquí podrías hacer una nueva llamada a la API para obtener todos los productos
    // o simplemente cargar los productos originales en el estado
    setFiltro("");
  };

  return (
    <div>
      <h1>Gestión de Productos</h1>

      {/* Formulario para agregar/editar productos */}
      <ProductoForm
        onAgregarProducto={handleAgregarProducto}
        onEditarProducto={handleEditarProductoSubmit}
      />

      {/* Filtro y botones para buscar y resetear filtro */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <button onClick={handleBuscarProducto}>Buscar</button>
      <button onClick={handleResetFiltro}>Mostrar Todos</button>

      {/* Lista de productos */}
      <ProductoList
        productos={productos}
        onEditar={handleEditarProducto}
        onEliminar={handleEliminarProducto}
      />
    </div>
  );
};

export default App;