import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import './App.css';

import { Navbar } from "./app/Navbar/Navbar"
import AppProducts from "./layers/Home/App/AppProducts"
import Carrito from "./layers/Carrito/App/Carrito";

function App() {
  
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header container">
          <Navbar />
        </header>
        <main className="App-main">
          <Switch>
            <Route path="/products" component={AppProducts}/>
            <Route path="/cart/:id?" component={Carrito}></Route>
            <Redirect to="/products"/>
          </Switch>
        </main>
        <footer className="App-footer container">
          <p>Todos los derechos reservados</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
