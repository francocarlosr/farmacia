/*export const Productos = () => {
  return (
    <form>
      <label>
        Nombre:
        <input type="text" />
      </label>
      <br />
      <br />
      <label>
        Apellido:
        <input type="text" />
      </label>
      <br />
      <br />
      <label>
        DNI:
        <input type="number" />
      </label>
      <br />
      <br />
      <label>
        Fecha de Nacimiento:
        <input type="date" />
      </label>
      <br />
      <br />
      <button type="button">Agregar pasajero</button>
      <button type="button">Borrar pasajero</button>
    </form>
  );
};
*/


import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Productos = () => {
  const { sesion } = useAuthContext();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/productos`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((response) => setProductos(response.data));
  }, [sesion]);

  return (
    <>
      <h2>Productos</h2>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} {producto.codigo}
          </li>
        ))}
      </ul>
    </>
  );
};

/*

<tbody>
          {productos.map((prod) => (
            <tr key={prod.id} onDoubleClick={() => producto(prod)}>
              <td>{prod.nombre}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.stock}</td>
              <td>{prod.precioCompra}</td>
              <td>{prod.precioVenta}</td>
            </tr>
          ))}
        </tbody>

*/