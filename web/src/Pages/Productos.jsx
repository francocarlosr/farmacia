import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Productos = () => {
  const { sesion } = useAuthContext();
  const [productos, setProductos] = useState([]);
  const [nombreProd, setNombreProd] = useState("");
  const [codigoProd, setCodigoProd] = useState("");
  const [precioProd, setPrecioProd] = useState("");
  const [ingreseProduct, setIngreseProduct] = useState("");
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [codigoEditado, setCodigoEditado] = useState("");
  const [precioEditado, setPrecioEditado] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/producto", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const agregarProducto = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/producto",
        {
          producto: {
            nombre: nombreProd,
            codigo: codigoProd,
            precio: precioProd,
          },
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      setProductos([...productos, response.data]);
      limpiarFormulario();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const buscarProducto = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/producto/${ingreseProduct}`,
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );

      // Si ingreseProduct está vacío, cargar todos los productos nuevamente
      if (!ingreseProduct.trim()) {
        cargarProductos();
      } else {
        setProductos([response.data]);
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/producto/${id}`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      const updatedProductos = productos.filter(
        (producto) => producto.id !== id
      );
      setProductos(updatedProductos);
      limpiarFormulario();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const editarProducto = async () => {
    try {
      await axios.put(
        `http://localhost:3000/producto/${idSeleccionado}`,
        {
          nombre: nombreEditado,
          codigo: codigoEditado,
          precio: precioEditado,
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      cargarProductos();
      limpiarFormulario();
    } catch (error) {
      console.error("Error al editar producto:", error);
    }
  };

  const seleccionarProducto = (producto) => {
    console.log("Producto seleccionado:", producto);
    setIdSeleccionado(producto.id);
    setNombreEditado(producto.nombre);
    setCodigoEditado(producto.codigo);
    setPrecioEditado(producto.precio);
  };

  const limpiarFormulario = () => {
    setIdSeleccionado(null);
    setNombreProd("");
    setCodigoProd("");
    setPrecioProd("");
    setNombreEditado("");
    setCodigoEditado("");
    setPrecioEditado("");
  };

  return (
    <>
      <h2>Productos</h2>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              onClick={() => cargarProductos()}
            >
              Refrescar Tabla
            </button>
            <br />
            <br />
            <label htmlFor="nombreEditado">Nombre:</label>
            <input
              type="text"
              id="nombreEditado"
              value={nombreEditado}
              onChange={(e) => setNombreEditado(e.target.value)}
              className="form-control"
            />

            <label htmlFor="codigoEditado">Código:</label>
            <input
              type="text"
              id="codigoEditado"
              value={codigoEditado}
              onChange={(e) => setCodigoEditado(e.target.value)}
              className="form-control"
            />

            <label htmlFor="precioEditado">Precio:</label>
            <input
              type="text"
              id="precioEditado"
              value={precioEditado}
              onChange={(e) => setPrecioEditado(e.target.value)}
              className="form-control"
            />
            {idSeleccionado ? (
              <>
                <button className="btn btn-primary" onClick={editarProducto}>
                  Aceptar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => limpiarFormulario()}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={agregarProducto}>
                Agregar
              </button>
            )}
            <br />
            <br />
            <label htmlFor="ingreseProduct">Buscar:</label>
            <input
              type="text"
              id="ingreseProduct"
              value={ingreseProduct}
              onChange={(e) => setIngreseProduct(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={buscarProducto}>
              Buscar
            </button>
            <br />
            <br />
          </div>
          <div className="col-md-6">
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Codigo</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td
                      onClick={() => seleccionarProducto(producto)}
                      style={{ cursor: "pointer" }}
                    >
                      {producto.nombre}
                    </td>
                    <td
                      onClick={() => seleccionarProducto(producto)}
                      style={{ cursor: "pointer" }}
                    >
                      {producto.codigo}
                    </td>
                    <td
                      onClick={() => seleccionarProducto(producto)}
                      style={{ cursor: "pointer" }}
                    >
                      {producto.precio}
                    </td>
                    <td
                      onClick={() => seleccionarProducto(producto)}
                      style={{ cursor: "pointer" }}
                    >
                      {producto.stock}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
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
