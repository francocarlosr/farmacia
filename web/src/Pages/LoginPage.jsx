import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const onSubmit = (event) => {
    const formData = new FormData(event.currentTarget);
    const usuario = formData.get("usuario");
    const password = formData.get("password");

    login(
      usuario,
      password,
      () => navigate(from, { replace: true }),
      () => setError(true)
    );

    event.preventDefault();
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "500px", background: "#f8f9fa", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div className="card-body">
          <h5 className="card-title text-center" style={{ color: "black" }}>Iniciar Sesión</h5>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label" style={{ color: "black" }}>
                Usuario:
              </label>
              <input name="usuario" type="text" className="form-control" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ color: "black" }}>
                Contraseña:
              </label>
              <input name="password" type="password" className="form-control" />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" style={{ background: "#007bff", border: "1px solid #007bff" }}>
                Ingresar
              </button>
            </div>
          </form>
          {error && (
            <p className="text-danger text-center mt-3">
              Usuario o contraseña inválido
            </p>
          )}
        </div>
      </div>
    </div>
  );
};