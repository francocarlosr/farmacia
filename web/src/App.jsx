import { Route, Routes } from "react-router-dom";
import { Layout } from "./Pages/Layout";
import { LoginPage } from "./Pages/LoginPage";
import { Productos } from "./Pages/Productos";
import { Compras } from "./Pages/Compras";
import { Ventas } from "./Pages/Ventas";
import { Empleados } from "./Pages/Empleados";
import { RequiredAuth } from "./context/RequireAuth";

function App() {
  return (
    <>
      <h1>
        <center>Farmacias P@ssw0rd</center>
      </h1>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
          <Route
            path="/" 
            element={
              <RequiredAuth>
                <Layout/>
              </RequiredAuth>}>
          <Route
            path="/productos"
            element={
              <RequiredAuth>
                <Productos/>
              </RequiredAuth>
            }
          />
          <Route
            path="/compras"
            element={
              <RequiredAuth>
                <Compras/>
              </RequiredAuth>
            }
          />
          <Route
            path="/ventas"
            element={
              <RequiredAuth>
                <Ventas/>
              </RequiredAuth>
            }
          />
          <Route
            path="/empleados"
            element={
              <RequiredAuth>
                <Empleados/>
              </RequiredAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;