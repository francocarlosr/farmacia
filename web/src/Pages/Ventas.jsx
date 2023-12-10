import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Ventas = () => {
  const { sesion } = useAuthContext();
  const [ventas, setVentas] = useState([]);
  const [fechaVenta, setFechaVenta] = useState("");
  const [clienteVenta, setClienteVenta] = useState("");
  const [empleado_id, setEmpleado_id] = useState("");
  const [productos, setProductos] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [ingreseVenta, setIngreseVenta] = useState("");
  const [totalVenta, setTotalVenta] = useState(0);

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
      setDetallesVenta((prevDetalles) => [...prevDetalles, detalle]);
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
      const response = await axios.post(
        "http://localhost:3000/ventas",
        {
          nuevaVenta: {
            fecha: fechaVenta,
            cliente: clienteVenta,
            empleado_id: empleado_id,
          },
          detallesVenta: detallesVenta,
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      setVentas((prevVentas) => [...prevVentas, response.data]);
      setFechaVenta("");
      setClienteVenta("");
      setEmpleado_id("");
      setDetallesVenta([]);
      // No es necesario cargarVentas aquí, ya se actualiza con setVentas
    } catch (error) {
      console.error("Error al agregar venta:", error.response);
    }
  };

  const eliminarVenta = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/ventas/${id}`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      const updatedVentas = ventas.filter((venta) => venta.id !== id);
      setVentas(updatedVentas);
    } catch (error) {
      console.error("Error al eliminar venta:", error);
    }
  };

  const buscarVenta = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/ventas/${ingreseVenta}`,
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      // Si ingreseVenta está vacío, cargar todas las ventas nuevamente
      if (!ingreseVenta.trim()) {
        cargarVentas();
      } else {
        setVentas([response.data]);
      }
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
            <button className="btn btn-primary" onClick={cargarVentas}>
              Refrescar Tabla
            </button>
            <br />
            <br />
            <label htmlFor="fechaVenta">Fecha:</label>
            <input
              type="date"
              id="fechaVenta"
              value={fechaVenta}
              onChange={(e) => setFechaVenta(e.target.value)}
              className="form-control"
            />
            <label htmlFor="clienteVenta">Cliente:</label>
            <input
              type="text"
              id="clienteVenta"
              value={clienteVenta}
              onChange={(e) => setClienteVenta(e.target.value)}
              className="form-control"
            />
            <label htmlFor="empleado_id">ID empleado:</label>
            <input
              type="text"
              id="empleado_id"
              value={empleado_id}
              onChange={(e) => setEmpleado_id(e.target.value)}
              className="form-control"
            />
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
            <button className="btn btn-success" onClick={agregarVenta}>
              Vender
            </button>
          </div>
          <div className="col-md-6">
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Empleado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id}>
                    <td>{venta.id}</td>
                    <td>{venta.fecha}</td>
                    <td>{venta.cliente}</td>
                    <td>{venta.empleado_id}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarVenta(venta.id)}
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
      </div>
    </>
  );
};
