import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Ventas = () => {
  const { sesion } = useAuthContext();
  const [ventas, setVentas] = useState([]);
  const [fechaVenta, setFechaVenta] = useState("");
  const [clienteVenta, setClienteVenta] = useState("");
  const [ingreseVenta, setIngreseVenta] = useState("");
  const [empleado_id, setEmpleado_id] = useState("");

  useEffect(() => {
    cargarVentas();
  }, []);

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
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      setVentas((prevVentas) => [...prevVentas, response.data]);
      setFechaVenta("");
      setClienteVenta("");
      cargarVentas();
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
            <label htmlFor="descripcion">ID empleado:</label>
            <input
              type="text"
              id="empleado_id"
              value={empleado_id}
              onChange={(e) => setEmpleado_id(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={agregarVenta}>
              Agregar
            </button>
            <br />
            <br />
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
          </div>
          <div className="col-md-6">
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>empleado</th>
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
      </div>
    </>
  );
};
