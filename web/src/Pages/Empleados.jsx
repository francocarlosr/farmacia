import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export const Empleados = () => {
  const { sesion } = useAuthContext();
  const [empleados, setEmpleados] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [idSeleccionado, setIdSeleccionado] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      if (busqueda === "") {
        const response = await axios.get("http://localhost:3000/empleados");
        setEmpleados(response.data);
      } else {
        const response = await axios.get(`http://localhost:3000/empleados/${busqueda}`);
        const empleado = response.data;
        setEmpleados([empleado]);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const cargarDatosEmpleado = async (usuario) => {
    try {
      const response = await axios.get(`http://localhost:3000/empleados/${usuario}`);
      const empleado = response.data;
      setUsuario(empleado.usuario);
      setPassword(empleado.password); // Asegúrate de manejar la contraseña de manera segura
      setRol(empleado.rol);
      setIdSeleccionado(empleado.id);
    } catch (error) {
      console.error("Error al cargar datos del empleado:", error);
    }
  };

  const agregarEmpleado = async () => {
    try {
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


  const buscarEmpleado = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/empleados/${busqueda}`);
      const empleado = response.data;
      setEmpleados([empleado]);
      limpiarFormulario();
    } catch (error) {
      console.error("Error al buscar empleado:", error);
    }
  };

  

  return (
    <>
      <div className="container mt-4">
     
        <h1 className="container mt-4 mb-4 text-center">Empleados</h1>
      
        <div className="row">
          {/* Formulario */}
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Usuario"
                  className="form-control"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <select
                  className="form-control"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option >Selecciona un Rol</option>
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
            <form>
  <div className="mb-3">
    <input
      type="text"
      placeholder="Buscar empleado"
      className="form-control"
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />
  </div>
  <div className="d-grid gap-2">
    <button
      type="button"
      className="btn btn-primary"
      onClick={buscarEmpleado}
    >
      Buscar
    </button>
  </div>
</form>
          </div>

          {/* Tabla */}
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