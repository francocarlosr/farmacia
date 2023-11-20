import { Link, Outlet } from "react-router-dom";
import { AuthStatus } from "../context/AuthStatus";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

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
          <li>
            <Link to="/ventas">Ventas</Link>
          </li>
          <li>
            <Link to="/empleados">Empleados</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};
