import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Productos = () => {
  const { sesion } = useAuthContext();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/producto`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((response) => setProductos(response.data));
  }, [sesion]);

  return (
    <>
      <h2>Productos</h2>
      <div className="container">
      <table className="table table-hover">
        <thead className="table-success">
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Codigo</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} onDoubleClick={() => producto(producto)}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.codigo}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

