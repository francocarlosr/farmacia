import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Empleados = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const { sesion } = useAuthContext();
  const [empleados, setEmpleados] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [idSeleccionado, setIdSeleccionado] = useState(false);
  const [usuarioError, setUsuarioError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get("http://localhost:3000/empleados");
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
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
      console.error("Error al cargar datos del empleado:", error);
    }
  };

  const handleUsuarioChange = (e) => {
    const value = e.target.value;

    // Validación de usuario
    const isValidUsuario = /^[a-zA-Z0-9]+$/.test(value);
    setUsuario(value);

    if (!isValidUsuario && value.trim() !== "") {
      setUsuarioError("Usuario inválido. Solo se permiten letras y números.");
    } else {
      setUsuarioError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    // Validación de contraseña
    const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/.test(value);
    setPassword(value);

    if (!isValidPassword && value.trim() !== "") {
      setPasswordError("Contraseña inválida. Debe tener entre 8 y 15 caracteres, al menos una letra mayúscula y un número.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = () => {
    if (password === confirmPassword) {
      // Las contraseñas coinciden, puedes proceder a agregar el registro
      console.log('Contraseña válida, agregar registro');
    } else {
      // Las contraseñas no coinciden, puedes mostrar un mensaje de error o realizar alguna acción
      console.log('Las contraseñas no coinciden');
    }
  };

  const agregarEmpleado = async () => {
    try {
      // Verificar si el usuario ya existe
      const usuarioExistente = empleados.find((empleado) => empleado.usuario === usuario);
      if (usuarioExistente) {
        // Mostrar mensaje en ventana modal o alert
        alert("Este usuario ya existe");
        return;
      }

      // El usuario no existe, proceder a agregarlo
      const response = await axios.post("http://localhost:3000/empleados", {
        usuario,
        password, // hay que poner el coso para manejar la contraseña de manera segura
        rol,
      });
      setEmpleados([...empleados, response.data]);
      limpiarFormulario();
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  const editarEmpleado = async () => {
    try {
      await axios.put(`http://localhost:3000/empleados/${idSeleccionado}`, {
        usuario,
        password, // hacer para qie la contraseña se vea con puntitos
        rol,
      });
      const nuevosEmpleados = empleados.map((empleado) =>
        empleado.id === idSeleccionado
          ? { ...empleado, usuario, rol }
          : empleado
      );
      setEmpleados(nuevosEmpleados);
      limpiarFormulario();
    } catch (error) {
      console.error("Error al editar empleado:", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/empleados/${id}`);
      const nuevosEmpleados = empleados.filter(
        (empleado) => empleado.id !== id
      );
      setEmpleados(nuevosEmpleados);
      limpiarFormulario();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  const limpiarFormulario = () => {
    setIdSeleccionado(null);
    setUsuario("");
    setPassword("");
    setRol("");
  };

  return (
    <>
      <div className="container mt-4">
        <h1 className="container mt-4 mb-4 text-center">Empleados</h1>
        <div className="row">
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Usuario"
                  className={`form-control ${usuarioError ? 'is-invalid' : ''}`}
                  value={usuario}
                  onChange={handleUsuarioChange}
                />
                {usuarioError && (
                  <div className="invalid-feedback">
                    {usuarioError}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                  value={password}
                  onChange={handlePasswordChange}
                />
                {passwordError && (
                  <div className="invalid-feedback">
                    {passwordError}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <select
                  className="form-control"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option>Selecciona un Rol</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="d-grid gap-2">
                {idSeleccionado ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={editarEmpleado}
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        limpiarFormulario();
                        cargarDatosEmpleado(null);
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={agregarEmpleado}
                  >
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
                  <th>ID</th>
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
};
