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
  const [precioCompra, setPrecioCompra] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [detallesCompra, setDetallesCompra] = useState([]);

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
      const response = await axios.get("http://localhost:3000/producto", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };


  const agregarDetalle = () => {
    const producto = productos.find(
      (p) => p.id === parseInt(productoSeleccionado)
    );
    const detalle = {
      producto_id: productoSeleccionado,
      nombreProducto: producto.nombre,
      cantidad: cantidadCompra,
      precio: precioCompra,
      fecha: fechaComp, // Agregar fecha
      proveedor: proveedorComp // Agregar proveedor
    };
    setDetallesCompra([...detallesCompra, detalle]);
    // Limpiar los campos después de agregar el detalle
    limpiarCampos();
  };

  const limpiarCampos = () => {
    setCantidadCompra("");
    setPrecioCompra("");
    setFechaComp("");
    setProveedorComp("");
    setProductoSeleccionado("");
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
      let response;
      if (!ingreseCompra.trim()) {
        response = await axios.get("http://localhost:3000/compras", {
          headers: { Authorization: `Bearer ${sesion.token}` },
        });
      } else {
        response = await axios.get(
          `http://localhost:3000/compras/${ingreseCompra}`,
          {
            headers: { Authorization: `Bearer ${sesion.token}` },
          }
        );
      }
      setCompras(response.data);
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
              id="seleccionarProducto"
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
            <label htmlFor="precioCompra">Precio:</label>
            <input
              type="number"
              id="precioCompra"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
              className="form-control"
            />
            <br />
            <button className="btn btn-primary" onClick={agregarDetalle}>
              Detalle de Compra
            </button>
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
            <button className="btn btn-primary" onClick={eliminarCompra}>
              eliminar
            </button>
          </div>
          <div className="col-md-6">
            <h3>Detalles de Compra</h3>
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                </tr>
              </thead>
              <tbody>
                {detallesCompra.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.nombreProducto}</td>
                    <td>{detalle.cantidad}</td>
                    <td>{detalle.precio}</td>
                    <td>{detalle.fecha}</td>
                    <td>{detalle.proveedor}</td>
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
