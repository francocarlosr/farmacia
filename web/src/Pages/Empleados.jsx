import { useEffect, useState } from 'react';
import axios from 'axios';

export const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    setIsButtonEnabled(!!usuario.trim() && !!password.trim() && !!rol.trim());
  }, [usuario, password, rol]);

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const cargarDatosEmpleado = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/empleados/${id}`);
      const empleado = response.data;
      setUsuario(empleado.usuario);
      setPassword(empleado.password);
      setRol(empleado.rol);
      setIdSeleccionado(id);
    } catch (error) {
      console.error('Error al cargar datos del empleado:', error);
    }
  };

  const agregarEmpleado = async () => {
    try {
      const existingUser = empleados.find((empleado) => empleado.usuario === usuario);
      if (existingUser) {
        setModalMessage('El usuario ya existe');
        setShowModal(true);
        return;
      }

      const response = await axios.post(
        'http://localhost:3000/empleados',
        {
          usuario,
          password,
          rol,
        }
      );
      setEmpleados([...empleados, response.data]);
      limpiarFormulario();
    } catch (error) {
      console.error('Error al agregar empleado:', error);
    }
  };

  const editarEmpleado = async () => {
    try {
      await axios.put(
        `http://localhost:3000/empleados/${idSeleccionado}`,
        {
          usuario,
          password,
          rol,
        }
      );
      const nuevosEmpleados = empleados.map((empleado) =>
        empleado.id === idSeleccionado ? { ...empleado, usuario, rol } : empleado
      );
      setEmpleados(nuevosEmpleados);
      limpiarFormulario();
    } catch (error) {
      console.error('Error al editar empleado:', error);
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/empleados/${id}`);
      const nuevosEmpleados = empleados.filter((empleado) => empleado.id !== id);
      setEmpleados(nuevosEmpleados);
      limpiarFormulario();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  const limpiarFormulario = () => {
    setIdSeleccionado(null);
    setUsuario('');
    setPassword('');
    setRol('');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="container mt-4">
        <h2 className="mb-4">Empleados</h2>
        <div className="row">
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <label htmlFor="usuario" className="form-label">
                  Usuario:
                </label>
                <input
                  type="text"
                  id="usuario"
                  className="form-control"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña:
                </label>
                <input
                  type="text"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="rol" className="form-label">
                  Rol:
                </label>
                <input
                  type="text"
                  id="rol"
                  className="form-control"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                />
              </div>

              <div className="d-grid gap-2">
                {idSeleccionado ? (
                  <>
                    <button className="btn btn-primary" onClick={editarEmpleado} disabled={!isButtonEnabled}>
                      Aceptar
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => cargarDatosEmpleado(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={agregarEmpleado} disabled={!isButtonEnabled}>
                    Agregar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="col-md-6">
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((empleado) => (
                  <tr key={empleado.id}>
                    <td>{empleado.id}</td>
                    <td>{empleado.usuario}</td>
                    <td>{empleado.rol}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => cargarDatosEmpleado(empleado.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarEmpleado(empleado.id)}
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
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ backgroundColor: 'black', color: 'white' }}>
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: 'white' }}>Mensaje</h5>
                <button type="button" className="close" style={{ backgroundColor: 'red' }} onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">{modalMessage}</div>
              <div className="modal-footer d-flex justify-content-center">
                <button type="button" className="btn btn-primary" onClick={closeModal}>
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
