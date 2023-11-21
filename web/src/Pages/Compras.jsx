import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Compras = () => {
  const { sesion } = useAuthContext();
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/compras`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((response) => setCompras(response.data));
  }, [sesion]);

  return (
    <>
      <h2>Compras</h2>
      <div className="container">
      <table className="table table-hover">
        <thead className="table-success">
          <tr>
            <th>Id</th>
            <th>Fecha</th>
            <th>Proveedor</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id} onDoubleClick={() => compra(compra)}>
              <td>{compra.id}</td>
              <td>{compra.fecha}</td>
              <td>{compra.proveedor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

