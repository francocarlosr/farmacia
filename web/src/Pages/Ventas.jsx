import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Ventas = () => {
  const { sesion } = useAuthContext();
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [ingreseVenta, setIngreseVenta] = useState("");
  const [totalVenta, setTotalVenta] = useState(0);
  const [fechaVenta, setFechaVenta] = useState("");
  const [clienteVenta, setClienteVenta] = useState("");
  const [ventasRegistradas, setVentasRegistradas] = useState([]);

  useEffect(() => {
    cargarVentas();
    cargarProductos();
    calcularTotalVenta();
  }, [detallesVenta]);

  const cargarVentas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/ventas", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setVentas(response.data);
    } catch (error) {
      console.error("Error al cargar ventas:", error.response);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/producto", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error.response);
    }
  };

  const agregarDetalleVenta = (producto) => {
    const cantidad = prompt(`Ingrese la cantidad de ${producto.nombre}:`);
    if (cantidad && !isNaN(cantidad) && cantidad > 0) {
      const detalle = {
        producto_id: producto.id,
        cantidad: parseInt(cantidad),
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        proveedor: producto.proveedor,
        precioTotal: parseInt(cantidad) * producto.precio,
      };
      setDetallesVenta([...detallesVenta, detalle]);
    }
  };

  const calcularTotalVenta = () => {
    const total = detallesVenta.reduce(
      (total, detalle) => total + detalle.precioTotal,
      0
    );
    setTotalVenta(total);
  };

  const agregarVenta = async () => {
    try {
      const nuevaVenta = {
        fecha: fechaVenta,
        cliente: clienteVenta,
        detallesVenta: detallesVenta,
      };

      const response = await axios.post(
        "http://localhost:3000/ventas",
        { nuevaVenta },
        { headers: { Authorization: `Bearer ${sesion.token}` } }
      );

      setVentas([...ventas, response.data]);

      // Limpiar campos de fecha, cliente y detalles de venta
      setFechaVenta("");
      setClienteVenta("");
      setDetallesVenta([]);
      setTotalVenta(0);

      // Agregar un objeto para cada detalle de venta a las ventas registradas
      setVentasRegistradas([...ventasRegistradas, ...detallesVenta.map((detalle, index) => ({
        id: detalle.id || index + 1,
        venta_id: response.data.id,
        fecha: response.data.fecha,
        cliente: response.data.cliente,
        producto: detalle.nombre,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precio,
        precioTotal: detalle.precioTotal,
      }))]);

    } catch (error) {
      console.error("Error al agregar venta:", error.response);
    }
  };

  const eliminarVenta = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/ventas/${id}`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setVentas(ventas.filter((venta) => venta.id !== id));
    } catch (error) {
      console.error("Error al eliminar venta:", error);
    }
  };

  const buscarVenta = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/ventas/${ingreseVenta}`,
        { headers: { Authorization: `Bearer ${sesion.token}` } }
      );
      setVentas(!ingreseVenta.trim() ? response.data : [response.data]);
    } catch (error) {
      console.error("Error al buscar venta:", error);
    }
  };

  return (
    <>
      <h2>Ventas</h2>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="fechaVenta">Fecha:</label>
            <input
              type="date"
              id="fechaVenta"
              value={fechaVenta}
              onChange={(e) => setFechaVenta(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="clienteVenta">Cliente:</label>
            <input
              type="text"
              id="clienteVenta"
              value={clienteVenta}
              onChange={(e) => setClienteVenta(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="ingreseVenta">Buscar por ID:</label>
            <input
              type="text"
              id="ingreseVenta"
              value={ingreseVenta}
              onChange={(e) => setIngreseVenta(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={buscarVenta}>
              Buscar
            </button>
            <br />
            <br />
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="seleccionarProducto">Seleccionar Producto:</label>
                <select
                  id="seleccionarProducto"
                  className="form-select"
                  onChange={(e) =>
                    agregarDetalleVenta(
                      productos.find(
                        (producto) => producto.id === parseInt(e.target.value)
                      )
                    )
                  }
                >
                  <option value="">Seleccionar Producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} - Precio: {producto.precio}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <br />
            <br />
          </div>
          <div className="col-md-6"></div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h3>Detalles de Venta</h3>
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {detallesVenta.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.nombre}</td>
                    <td>{detalle.cantidad}</td>
                    <td>{detalle.precio}</td>
                    <td>{detalle.precioTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h3>Total Venta: {totalVenta}</h3>
          </div>
        </div>
        <button className="btn btn-success" onClick={agregarVenta}>
          Vender
        </button>
        <br />
        <div className="row">
          <div className="col-md-12">
            <h3>Ventas Registradas</h3>
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>ID Venta</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {ventasRegistradas.map((venta, index) => (
                  <tr key={index}>
                    <td>{venta.id}</td>
                    <td>{venta.venta_id}</td>
                    <td>{venta.fecha}</td>
                    <td>{venta.cliente}</td>
                    <td>{venta.producto}</td>
                    <td>{venta.cantidad}</td>
                    <td>{venta.precioUnitario}</td>
                    <td>{venta.precioTotal}</td>
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
