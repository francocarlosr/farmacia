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
      <div className="row align-items-center justify-content-center">
        <div className="col-md-6">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <input
                name="usuario"
                type="text"
                className="form-control"
                placeholder="Usuario"
              />
            </div>
            <div className="mb-3">
              <input
                placeholder="Contraseña"
                name="password"
                type="password"
                className={`form-control ${error ? "is-invalid" : ""}`}
              />
              {error && (
                <div className="invalid-feedback">
                  Usuario o contraseña inválido
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary float-end">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
