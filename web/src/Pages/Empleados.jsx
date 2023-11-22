import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';

export const Empleados = () => {
  const { sesion } = useAuthContext();
  const [empleados, setEmpleados] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/empleados', {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((response) => setEmpleados(response.data));
  }, [sesion]);

  useEffect(() => {
    cargarEmpleados();
  }, []);

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
      setPassword(empleado.password); // Asegúrate de manejar la contraseña de manera segura
      setRol(empleado.rol);
      setIdSeleccionado(id);
    } catch (error) {
      console.error('Error al cargar datos del empleado:', error);
    }
  };

  const agregarEmpleado = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/empleados',
        {
          usuario,
          password, // Asegúrate de manejar la contraseña de manera segura
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
          password, // Asegúrate de manejar la contraseña de manera segura
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

  return (
    <>
        <div className="container mt-4">
      <h2 className="mb-4">Empleados</h2>
      <div className="row">
        {/* Formulario */}
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
                  <button className="btn btn-primary" onClick={editarEmpleado}>
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
                <button className="btn btn-primary" onClick={agregarEmpleado}>
                  Agregar
                </button>
              )}
            </div>
          </form>
        </div>
  
          {/* Tabla */}
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
    </>
  );
}