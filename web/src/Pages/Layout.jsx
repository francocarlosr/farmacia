import { Link, Outlet } from "react-router-dom";
import { AuthStatus } from "../context/AuthStatus";

export const Layout = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/productos" className="nav-link">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/compras" className="nav-link">
                Compras
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/ventas" className="nav-link">
                Ventas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/empleados" className="nav-link">
                Empleados
              </Link>
            </li>
          </ul>
          <AuthStatus />
        </div>
      </nav>
      <Outlet />
    </>
  );
};
