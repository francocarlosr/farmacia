import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Clientes = () => {
  const { sesion } = useAuthContext();
  const [clientes, setProductos] = useState([]);
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
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [disableEliminarButton, setDisableEliminarButton] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false); // Modo de edición

  useEffect(() => {
    cargarProductos();
  }, []);

  

  const cargarProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/clientes", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      setProductos(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const handleNombreProdChange = (e) => {
    const value = e.target.value;
    const isValidNombre = /^[a-zA-Z0-9\s]{1,100}$/.test(value);
    setNombreProd(value);
    if (!isValidNombre && value.trim() !== "") {
      setNombreError("Caracter inválido. Solo se permiten letras, números y espacios, máximo 100 caracteres.");
    } else {
      setNombreError("");
    }
    checkAllFieldsFilled();
  };

  const handleCodigoProdChange = (e) => {
    const value = e.target.value;
    const isValidCodigo = /^[a-zA-Z0-9\s]{0,100}$/.test(value);
    setCodigoProd(value);
    if (!isValidCodigo && value.trim() !== "") {
        setCodigoError("Código inválido. Debe contener letras, números y espacios, con un máximo de 100 caracteres.");
    } else {
        setCodigoError("");
    }
    checkAllFieldsFilled();
};


const handlePrecioProdChange = (e) => {
  const value = e.target.value;
  const isValidPrecio = /^\d+$/.test(value);
  setPrecioProd(value);
  if (!isValidPrecio && value.trim() !== "") {
      setPrecioError("Precio inválido. Por favor, ingrese un número entero.");
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

  const agregarProducto = async () => {
    try {
      if (!allFieldsFilled) {
        alert("Por favor complete todos los campos obligatorios");
        return;
      }

      if (nombreError || codigoError || precioError) {
        alert("Corrija los errores de validación antes de agregar el clientes");
        return;
      }

      const existingProductByName = clientes.find((clientes) => clientes.nombre === nombreProd);

      if (existingProductByName) {
        const errorMessage = "Ya existe un clientes con el mismo nombre."
        setModalMessage(errorMessage);
        toggleModal();
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/clientes",
        {
          clientes: {
            nombre: nombreProd,
            direccion: codigoProd,
            telefono: precioProd,
          },
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );

      setProductos((prevProductos) => [...prevProductos, response.data]);
      setNombreProd("");
      setCodigoProd("");
      setPrecioProd("");
      setDisableAgregarButton(true);

      cargarProductos();
    } catch (error) {
      console.error("Error al agregar clientes:", error);
    }
  };

  const buscarProducto = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults(clientes);
    } else {
      const filteredResults = clientes.filter((clientes) =>
        clientes.nombre.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  };

  const eliminarProducto = async () => {
    try {
      if (selectedProductId) {
        await axios.delete(`http://localhost:3000/clientes/${selectedProductId}`, {
          headers: { Authorization: `Bearer ${sesion.token}` },
        });
        const updatedProductos = clientes.filter((clientes) => clientes.id !== selectedProductId);
        setProductos(updatedProductos);
        setSelectedProductId(null);
        setDisableEliminarButton(true);
        // Limpiar el formulario y establecer el modo de edición en falso
        setNombreProd("");
        setCodigoProd("");
        setPrecioProd("");
        setDisableAgregarButton(true); // Asegúrate de deshabilitar el botón Agregar
        setModoEdicion(false); // Desactivar modo de edición
        cargarProductos();
      }
    } catch (error) {
      console.error("Error al eliminar clientes:", error);
    }
  };
  

  const modificarProducto = async (id) => {
    try {
      setSelectedProductId(id);
      const response = await axios.get(`http://localhost:3000/clientes/${id}`);
      const { nombre, direccion, telefono } = response.data;
      setNombreProd(nombre);
      setCodigoProd(direccion);
      setPrecioProd(telefono);
      setDisableEliminarButton(false);
      setModoEdicion(true); // Establecer modo de edición
    } catch (error) {
      console.error("Error al cargar clientes para modificar:", error);
    }
  };

  const guardarCambiosProducto = async () => {
    try {
      await axios.put(
        `http://localhost:3000/clientes/${selectedProductId}`,
        {
          clientes: {
            nombre: nombreProd,
            direccion: codigoProd,
            telefono: precioProd,
          },
        },
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      );
      cargarProductos();
      setNombreProd("");
      setCodigoProd("");
      setPrecioProd("");
      setDisableAgregarButton(true);
      setModoEdicion(false); // Desactivar modo de edición
    } catch (error) {
      console.error("Error al modificar clientes:", error);
    }
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setIngreseProduct(searchTerm);
    buscarProducto(searchTerm);
  };

  return (
    <>
      <h2>Clientes</h2>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
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
            <label htmlFor="codigoProd">Direccion:</label>
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
            <label htmlFor="precioProd">Telefono:</label>
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
            {modoEdicion ? (
              <button
                className="btn btn-success"
                onClick={guardarCambiosProducto}
              >
                Guardar cambios
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={agregarProducto}
                disabled={disableAgregarButton}
              >
                Agregar
              </button>
            )}
            <br />
            <br />
            <label htmlFor="ingreseProduct">Buscar:</label>
            <input
              type="text"
              id="ingreseProduct"
              value={ingreseProduct}
              onChange={handleSearchChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Direccion</th>
                  <th>Telefono</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((clientes) => (
                  <tr key={clientes.id} onClick={() => modificarProducto(clientes.id)}>
                    <td>{clientes.id}</td>
                    <td>{clientes.nombre}</td>
                    <td>{clientes.direccion}</td>
                    <td>{clientes.telefono}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <button
                className="btn btn-danger"
                onClick={eliminarProducto}
                disabled={disableEliminarButton}
              >
                Eliminar
              </button>
            </div>
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