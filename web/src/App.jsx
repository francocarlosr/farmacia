import { Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { Layout } from "./Pages/Layout";
import { LoginPage } from "./Pages/LoginPage";
import { Productos } from "./Pages/Productos";
import { RequiredAuth } from "./context/RequireAuth";

function App() {
  return (
    <>
      <h1>
        <center>Farmacias</center>
      </h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/productos"
            element={
              <RequiredAuth>
                <Productos/>
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