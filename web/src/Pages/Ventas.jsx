import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Ventas = () => {
  const { sesion } = useAuthContext();
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/ventas`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((response) => setVentas(response.data));
  }, [sesion]);

  return (
    <>
      <h2>Ventas</h2>
      <div className="container">
        <table className="table table-hover">
          <thead className="table-success">
            <tr>
              <th>Id</th>
              <th>Fecha</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} onDoubleClick={() => venta(venta)}>
                <td>{venta.id}</td>
                <td>{venta.fecha}</td>
                <td>{venta.cliente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};