import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AdminRoute from "./layers/SignIn/features/AdminRoute";

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
import ProductList from './layers/Home/App/ProductList';

function App() {
  
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header container">
          <Navbar />
        </header>
        <main className="App-main">
          <Switch>
            <Route path="/products" component={AppProducts} />
            <Route path="/registro" component={SignIn} />
            <Route path="/inscripcion" component={Register} />
            <Route path="/cart/:id?" component={Carrito} />
            <Route path="/order/:id" component={Order} />
            <Route path="/compra" component={Compra} />
            <Route path="/pago" component={Pago} />
            <Route path="/placeorder" component={PlaceOrder} />
            <Route path="/orderhistory" component={OrderHistory} />
            <Route path="/profile" component={Profile} />
            <AdminRoute path="/productlist" component={ProductList} />
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
