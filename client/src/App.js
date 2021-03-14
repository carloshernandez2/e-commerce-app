import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import './App.css';

import { Navbar } from "./app/Navbar/Navbar"
import AppProducts from "./layers/Home/App/AppProducts"
import Carrito from "./layers/Carrito/App/Carrito";
import SignIn from "./layers/SignIn/App/SignIn";
import Register from "./layers/SignIn/App/Register";

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
            <Route path="/registro" component={SignIn}></Route>
            <Route path="/inscripcion" component={Register}></Route>
            <Route path="/cart/:id?" component={Carrito}></Route>
            <Route path="/compra"></Route>
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
