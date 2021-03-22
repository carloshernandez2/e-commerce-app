import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import './App.css';

import { Navbar } from "./app/Navbar/Navbar"
import AppProducts from "./layers/Home/App/AppProducts"
import Carrito from "./layers/Carrito/App/Carrito";
import Compra from "./layers/Carrito/App/Compra";
import SignIn from "./layers/SignIn/App/SignIn";
import Register from "./layers/SignIn/App/Register";
import Pago from './layers/Carrito/App/Pago';
import PlaceOrder from './layers/PlaceOrder/App/PlaceOrder';
import Order from './layers/PlaceOrder/App/Order';
import OrderHistory from './layers/PlaceOrder/App/OrderHistory';
import Profile from './layers/SignIn/App/Profile';

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
            <Route path="/order/:id" component={Order}></Route>
            <Route path="/compra" component={Compra}></Route>
            <Route path="/pago" component={Pago}></Route>
            <Route path="/placeorder" component={PlaceOrder}></Route>
            <Route path="/orderhistory" component={OrderHistory}></Route>
            <Route path="/profile" component={Profile}></Route>
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
