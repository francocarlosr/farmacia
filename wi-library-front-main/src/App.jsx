import { Route, Routes } from "react-router-dom";
import Login from "./componentes/login/Login.jsx"
import BarraLateral from "./componentes/barraLateral/BarraLateral.jsx"
import Libros from "./componentes/libros/Libros.jsx";
import Stock from "./componentes/stock/Stock.jsx"
import Dashboard from "./componentes/dashboard/Dashboard.jsx";
import Ventas from "./componentes/ventas/Ventas.jsx";
import Usuarios from "./componentes/usuarios/Usuarios.jsx"
import Personas from "./componentes/personas/Personas.jsx";
import ListadoVentas from "./componentes/listadoVentas/ListadoVentas.jsx";

function App() {
  return (
    <>
    <div style={{'display': 'flex' , 'flexDirection': 'row', 'minHeight': '800px'}}>
        <Routes>
            <Route path="/libros" element={<><BarraLateral></BarraLateral><Libros /></>}></Route>
            <Route path="/stock" element={<><BarraLateral></BarraLateral><Stock /></>}></Route>
            <Route path="/personas" element={<><BarraLateral></BarraLateral><Personas /></>}></Route>
            <Route path="/usuarios" element={<><BarraLateral></BarraLateral><Usuarios /></>}></Route>
            <Route path="/login" element={<><Login /></>}></Route>
            <Route path="/" element={<><BarraLateral></BarraLateral><Dashboard /></>}></Route>
            <Route path="/ventas" element={<><BarraLateral></BarraLateral><Ventas /></>}></Route>
            <Route path="/listado-ventas" element={<><BarraLateral></BarraLateral><ListadoVentas /></>}></Route>
        </Routes>
      </div>
      
    </>
  );
}

export default App;
