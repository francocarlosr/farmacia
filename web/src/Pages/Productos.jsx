import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Productos = () => {
  const { sesion } = useAuthContext();
  const [productos, setProductos] = useState([]);
  const [nombreProd, setNombreProd] = useState("");
  const [codigoProd, setCodigoProd] = useState("");
  const [precioProd, setPrecioProd] = useState("");
  const [ingreseProduct, setIngreseProduct] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

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

  const agregarProducto = async () => {
    try {
      const existingProductByName = productos.find((producto) => producto.nombre === nombreProd);
      const existingProductByCode = productos.find((producto) => producto.codigo === codigoProd);
  
      if (existingProductByName || existingProductByCode) {
        setModalMessage("El producto ya existe");
        toggleModal();
      } else {
        const response = await axios.post(
          "http://localhost:3000/producto",
          {
            producto: {
              nombre: nombreProd,
              codigo: codigoProd,
              precio: precioProd,
            },
          },
          {
            headers: { Authorization: `Bearer ${sesion.token}` },
          }
        );
        setProductos([...productos, response.data]);
        setNombreProd("");
        setCodigoProd("");
        setPrecioProd("");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };
  

  const buscarProducto = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/producto/${ingreseProduct}`,
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      if (!ingreseProduct.trim()) {
        cargarProductos();
      } else {
        setProductos([response.data]);
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/producto/${id}`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      const updatedProductos = productos.filter((producto) => producto.id !== id);
      setProductos(updatedProductos);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <>
      <h2>Productos</h2>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-primary" onClick={cargarProductos}>
              Refrescar Tabla
            </button>
            <br />
            <br />
            <label htmlFor="nombreProd">Nombre:</label>
            <input
              type="text"
              id="nombreProd"
              value={nombreProd}
              onChange={(e) => setNombreProd(e.target.value)}
              className="form-control"
            />
            <label htmlFor="codigoProd">Código:</label>
            <input
              type="text"
              id="codigoProd"
              value={codigoProd}
              onChange={(e) => setCodigoProd(e.target.value)}
              className="form-control"
            />
            <label htmlFor="precioProd">Precio:</label>
            <input
              type="text"
              id="precioProd"
              value={precioProd}
              onChange={(e) => setPrecioProd(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={agregarProducto}>
              Agregar
            </button>
            <br />
            <br />
            <label htmlFor="ingreseProduct">Buscar:</label>
            <input
              type="text"
              id="ingreseProduct"
              value={ingreseProduct}
              onChange={(e) => setIngreseProduct(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={buscarProducto}>
              Buscar
            </button>
          </div>
          <div className="col-md-6">
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Codigo</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.codigo}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarProducto(producto.id)}
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

      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ backgroundColor: "black" , color: "white"}}>
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "white" }}>Mensaje</h5>
                <button type="button" className="close" style={{ backgroundColor: "red" }} onClick={toggleModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">{modalMessage}</div>
              <div className="modal-footer d-flex justify-content-center">
                <button type="button" className="btn btn-primary" onClick={toggleModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
