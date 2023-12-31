import React, { useEffect, useState } from "react";
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
  const [nombreError, setNombreError] = useState("");
  const [codigoError, setCodigoError] = useState("");
  const [precioError, setPrecioError] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [disableAgregarButton, setDisableAgregarButton] = useState(true);

  const handleNombreProdChange = (e) => {
    const value = e.target.value;

    // Validación de nombre
    const isValidNombre = /^[a-zA-Z\s]{1,30}$/.test(value);
    setNombreProd(value);

    if (!isValidNombre && value.trim() !== "") {
      setNombreError("Nombre inválido. Solo se permiten letras y espacios, máximo 30 caracteres.");
    } else {
      setNombreError("");
    }

    checkAllFieldsFilled();
  };

  const handleCodigoProdChange = (e) => {
    const value = e.target.value;

    // Validación de código
    const isValidCodigo = /^\d{5,10}$/.test(value);
    setCodigoProd(value);

    if (!isValidCodigo && value.trim() !== "") {
      setCodigoError("Código inválido. Debe contener entre 5 y 10 dígitos.");
    } else {
      setCodigoError("");
    }

    checkAllFieldsFilled();
  };

  const handlePrecioProdChange = (e) => {
    const value = e.target.value;

    // Validación de precio
    const isValidPrecio = /^(\d+|\d+\.\d*|\d*\.\d+)$/.test(value);
    setPrecioProd(value);

    if (!isValidPrecio && value.trim() !== "") {
      setPrecioError("Precio inválido. Ingrese un número entero o un número decimal con punto.");
    } else {
      setPrecioError("");
    }

    checkAllFieldsFilled();
  };

  const checkAllFieldsFilled = () => {
    const fieldsFilled = nombreProd.trim() !== "" && codigoProd.trim() !== "" && precioProd.trim() !== "";
    setAllFieldsFilled(fieldsFilled);
    setDisableAgregarButton(!fieldsFilled);
  };

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
      // Verificar si alguno de los campos obligatorios está vacío
      if (!allFieldsFilled) {
        alert("Por favor complete todos los campos obligatorios");
        return;
      }
  
      if (nombreError || codigoError || precioError) {
        // No permite agregar si hay errores de validación
        alert("Corrija los errores de validación antes de agregar el producto");
        return;
      }
  
      const existingProductByName = productos.find((producto) => producto.nombre === nombreProd);
      const existingProductByCode = productos.find((producto) => producto.codigo === codigoProd);
  
      if (existingProductByName || existingProductByCode) {
        const errorMessage = existingProductByName
          ? "Ya existe un producto con el mismo nombre."
          : "Ya existe un producto con el mismo código.";
        setModalMessage(errorMessage);
        toggleModal();
        return; // Salir de la función si el producto ya existe
      }
  
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
  
      // Actualizar el estado con la respuesta del servidor
      setProductos((prevProductos) => [...prevProductos, response.data]);
      setNombreProd("");
      setCodigoProd("");
      setPrecioProd("");
      setDisableAgregarButton(true);
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
              onChange={handleNombreProdChange}
              className={`form-control ${nombreError ? 'is-invalid' : ''}`}
            />
            {nombreError && (
              <div className="invalid-feedback">
                {nombreError}
              </div>
            )}
            <label htmlFor="codigoProd">Código:</label>
            <input
              type="text"
              id="codigoProd"
              value={codigoProd}
              onChange={handleCodigoProdChange}
              className={`form-control ${codigoError ? 'is-invalid' : ''}`}
            />
            {codigoError && (
              <div className="invalid-feedback">
                {codigoError}
              </div>
            )}
            <label htmlFor="precioProd">Precio:</label>
            <input
              type="text"
              id="precioProd"
              value={precioProd}
              onChange={handlePrecioProdChange}
              className={`form-control ${precioError ? 'is-invalid' : ''}`}
            />
            {precioError && (
              <div className="invalid-feedback">
                {precioError}
              </div>
            )}
            <button
              className="btn btn-primary"
              onClick={agregarProducto}
              disabled={disableAgregarButton}
            >
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
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", color: "white" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mensaje</h5>
                <button type="button" className="close" onClick={toggleModal}>
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
