import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Productos = () => {
  const { sesion } = useAuthContext();
  const [productos, setProductos] = useState([]);
  const [nombreProd, setNombreProd] = useState("");
  const [codigoProd, setCodigoProd] = useState("");
  const [precioProd, setPrecioProd] = useState("");
  const [stockProd, setStockProd] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/producto`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((response) => setProductos(response.data));
  }, [sesion]);

  const agregarProducto = async () => {
    try {
      // Enviar datos del nuevo producto al backend
      const response = await axios.post(
        "http://localhost:3000/producto",
        {
          producto: {
            nombre: nombreProd,
            codigo: codigoProd,
            precio: precioProd,
            stock: stockProd,
          },
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );

      // Actualizar la lista de productos en el estado
      setProductos([...productos, response.data]);
      
      // Limpiar los campos del formulario
      setNombreProd("");
      setCodigoProd("");
      setPrecioProd("");
      setStockProd("");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <>
      <h2>Productos</h2>
      <div className="container">
        <label htmlFor="nombreProd">Nombre del Producto:</label>
        <input
          type="text"
          id="nombreProd"
          value={nombreProd}
          onChange={(e) => setNombreProd(e.target.value)}
        />

        <label htmlFor="codigoProd">Código:</label>
        <input
          type="text"
          id="codigoProd"
          value={codigoProd}
          onChange={(e) => setCodigoProd(e.target.value)}
        />

        <label htmlFor="precioProd">Precio:</label>
        <input
          type="text"
          id="precioProd"
          value={precioProd}
          onChange={(e) => setPrecioProd(e.target.value)}
        />

        <label htmlFor="stockProd">Stock:</label>
        <input
          type="text"
          id="stockProd"
          value={stockProd}
          onChange={(e) => setStockProd(e.target.value)}
        />

        <button onClick={agregarProducto}>Agregar</button>

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
}