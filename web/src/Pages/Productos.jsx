import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";

export const Productos = () => {
  const { handleSubmit } = useForm();
  const [mostrarFormularioAgregar, setMostrarFormularioAgregar] =
    useState(true);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    codigo: "",
    precio: "",
  });
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const cargarProductoPorId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/productos/${id}`);
      setProductoSeleccionado(response.data);
    } catch (error) {
      console.error(`Error al cargar producto con ID ${id}:`, error);
    }
  };

  const agregarProducto = async () => {
    try {
      await axios.post("http://localhost:3000/productos", nuevoProducto);
      cargarProductos();
      setNuevoProducto({ nombre: "", codigo: "", precio: "" });
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const actualizarProducto = async () => {
    try {
      await axios.put(
        `http://localhost:3000/productos/${productoSeleccionado.id}`,
        productoSeleccionado
      );
      cargarProductos();
      setProductoSeleccionado(null);
      setMostrarFormularioAgregar(true);
    } catch (error) {
      console.error(
        `Error al actualizar producto con ID ${productoSeleccionado.id}:`,
        error
      );
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/productos/${id}`);
      cargarProductos();
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error);
    }
  };

  return (
    <>
      <div className="container mt-4 text-center">
        <h1>Productos</h1>
      </div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 mt-2">
            {(mostrarFormularioAgregar || productoSeleccionado) && (
              <div>
                <h4>
                  {productoSeleccionado
                    ? "Editar Producto"
                    : "Agregar Producto"}
                </h4>
                <form
                  onSubmit={handleSubmit(
                    productoSeleccionado ? actualizarProducto : agregarProducto
                  )}
                >
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={
                        productoSeleccionado
                          ? productoSeleccionado.nombre
                          : nuevoProducto.nombre
                      }
                      onChange={(e) => {
                        if (productoSeleccionado) {
                          setProductoSeleccionado({
                            ...productoSeleccionado,
                            nombre: e.target.value,
                          });
                        } else {
                          setNuevoProducto({
                            ...nuevoProducto,
                            nombre: e.target.value,
                          });
                        }
                      }}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={
                        productoSeleccionado
                          ? productoSeleccionado.codigo
                          : nuevoProducto.codigo
                      }
                      onChange={(e) => {
                        if (productoSeleccionado) {
                          setProductoSeleccionado({
                            ...productoSeleccionado,
                            codigo: e.target.value,
                          });
                        } else {
                          setNuevoProducto({
                            ...nuevoProducto,
                            codigo: e.target.value,
                          });
                        }
                      }}
                      placeholder="Código"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={
                        productoSeleccionado
                          ? productoSeleccionado.precio
                          : nuevoProducto.precio
                      }
                      onChange={(e) => {
                        if (productoSeleccionado) {
                          setProductoSeleccionado({
                            ...productoSeleccionado,
                            precio: e.target.value,
                          });
                        } else {
                          setNuevoProducto({
                            ...nuevoProducto,
                            precio: e.target.value,
                          });
                        }
                      }}
                      placeholder="Precio"
                    />
                  </div>
                  <button type="submit" className="btn btn-success mt-2 mr-2">
                    {productoSeleccionado ? "Actualizar" : "Agregar"}
                  </button>
                  {productoSeleccionado && (
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={() => setProductoSeleccionado(null)}
                    >
                      Cancelar
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <table className="table table-hover mt-3">
              <thead className="table-success mt-2">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.codigo}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => cargarProductoPorId(producto.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default Productos;
