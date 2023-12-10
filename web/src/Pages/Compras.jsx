import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Compras = () => {
  const { sesion } = useAuthContext();
  const [compras, setCompras] = useState([]);
  const [fechaComp, setFechaComp] = useState("");
  const [proveedorComp, setProveedorComp] = useState("");
  const [ingreseCompra, setIngreseCompra] = useState("");
  const [productos, setProductos] = useState([]);
  const [cantidadCompra, setCantidadCompra] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState("");

  useEffect(() => {
    cargarCompras();
    cargarProductos();
  }, []);

  const cargarCompras = async () => {
    try {
      const response = await axios.get("http://localhost:3000/compras", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setCompras(response.data);
    } catch (error) {
      console.error("Error al cargar compras:", error);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/productos", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const agregarCompra = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/compras",
        {
          nuevaCompra: {
            fecha: fechaComp,
            proveedor: proveedorComp,
          },
          nuevoDetalle: {
            producto_id: productoSeleccionado,
            cantidad: cantidadCompra,
          },
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      setCompras([...compras, response.data]);
      setFechaComp("");
      setProveedorComp("");
      setProductoSeleccionado("");
      setCantidadCompra("");
    } catch (error) {
      console.error("Error al agregar compra:", error);
    }
  };

  const eliminarCompra = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/compras/${id}`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      const updatedCompras = compras.filter((compra) => compra.id !== id);
      setCompras(updatedCompras);
    } catch (error) {
      console.error("Error al eliminar compra:", error);
    }
  };

  const buscarCompra = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/compras/${ingreseCompra}`,
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      // Si ingreseCompra está vacío, cargar todas las compras nuevamente
      if (!ingreseCompra.trim()) {
        cargarCompras();
      } else {
        setCompras([response.data]);
      }
    } catch (error) {
      console.error("Error al buscar compra:", error);
    }
  };

  return (
    <>
      <h2 className="text-center">Compras</h2>
      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-primary" onClick={cargarCompras}>
              Refrescar Tabla
            </button>
            <br />
            <br />
            <label htmlFor="fechaComp">Fecha:</label>
            <input
              type="date"
              id="fechaComp"
              value={fechaComp}
              onChange={(e) => setFechaComp(e.target.value)}
              className="form-control"
            />
            <label htmlFor="proveedorComp">Proveedor:</label>
            <input
              type="text"
              id="proveedorComp"
              value={proveedorComp}
              onChange={(e) => setProveedorComp(e.target.value)}
              className="form-control"
            />
            <label htmlFor="productoSeleccionado">Producto:</label>
            <select
              className="form-select"
              onChange={(e) => setProductoSeleccionado(e.target.value)}
            >
              <option value="">Seleccionar Producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
            <label htmlFor="cantidadCompra">Cantidad:</label>
            <input
              type="number"
              id="cantidadCompra"
              value={cantidadCompra}
              onChange={(e) => setCantidadCompra(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={agregarCompra}>
              Agregar
            </button>
            <br />
            <br />
            <label htmlFor="ingreseCompra">Buscar por ID:</label>
            <input
              type="text"
              id="ingreseCompra"
              value={ingreseCompra}
              onChange={(e) => setIngreseCompra(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={buscarCompra}>
              Buscar
            </button>
          </div>
          <div className="col-md-6" style={{ overflow: "auto", maxHeight: "400px" }}>
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra) => (
                  <tr key={compra.id}>
                    <td>{compra.id}</td>
                    <td>{compra.fecha}</td>
                    <td>{compra.proveedor}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarCompra(compra.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => verDetalle(compra.id)}
                      >
                        Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <br />
      <br />
      <h2 className="text-center">Detalles de Compra</h2>
      <br />
      <br />
      <div className="container">
        <div className="row">
          {/* Detalles de Compra */}
        </div>
      </div>
      <br />
      <br />
    </>
  );
};
