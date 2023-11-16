// src/main.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProductosList from './src/components/ProductosList';
import ProductoSearch from './src/components/ProductoSearch';
import ProductoForm from './src/components/ProductoForm';
import ProductoUpdateForm from './src/components/ProductoUpdateForm';
import ProductoDeleteForm from './src/components/ProductoDeleteForm';

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/productos" exact component={ProductosList} />
          <Route path="/productos/buscar" component={ProductoSearch} />
          <Route path="/productos/ingresar" component={ProductoForm} />
          <Route path="/productos/actualizar" component={ProductoUpdateForm} />
          <Route path="/productos/eliminar" component={ProductoDeleteForm} />
          {/* Agrega rutas para otras secciones (ventas, compras, etc.) */}
        </Switch>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
