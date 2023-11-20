import { Link, Outlet } from "react-router-dom";
import { AuthStatus } from "../context/AuthStatus";

export const Layout = () => {
  return (
    <>
      <AuthStatus />
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/productos">Productos</Link>
          </li>
          <li>
            <Link to="/compras">Compras</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};
