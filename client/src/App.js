import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AdminRoute from "./app/components/AdminRoute";

import "./App.css";

import { Navbar } from "./app/Navbar/Navbar";
import AppProducts from "./layers/Home/App/AppProducts";
import Carrito from "./layers/Carrito/App/Carrito";
import Compra from "./layers/Carrito/App/Compra";
import SignIn from "./layers/SignIn/App/SignIn";
import Register from "./layers/SignIn/App/Register";
import Pago from "./layers/Carrito/App/Pago";
import PlaceOrder from "./layers/PlaceOrder/App/PlaceOrder";
import Order from "./layers/PlaceOrder/App/Order";
import OrderHistory from "./layers/PlaceOrder/App/OrderHistory";
import Profile from "./layers/SignIn/App/Profile";
import ProductList from "./layers/Home/App/ProductList";
import OrderList from "./layers/PlaceOrder/App/OrderList";
import UserList from "./layers/SignIn/App/UserList";
import UserEdit from "./layers/SignIn/App/UserEdit";
import SellerRoute from "./app/components/SellerRoute";
import PrivateRoute from "./app/components/PrivateRoute";
import Seller from "./layers/SignIn/App/Seller";
import Search from "./layers/Home/App/Search";
import MapScreen from "./layers/Carrito/App/Map";
import Dashboard from "./layers/PlaceOrder/App/Dashboard";
import Footer from "./app/footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="App-main">
          <Switch>
            <Route path="/seller/:id" component={Seller}></Route>
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
            <Route exact path="/search/name/:name?" component={Search} />
            <Route exact path="/search/category/:category" component={Search} />
            <Route
              exact
              path="/search/category/:category/name/:name"
              component={Search}
            />
            <Route
              exact
              path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
              component={Search}
            />
            <PrivateRoute path="/map" component={MapScreen} />
            <AdminRoute exact path="/productlist" component={ProductList} />
            <AdminRoute exact path="/productlist/pageNumber/:pageNumber"component={ProductList} />
            <AdminRoute exact path="/orderlist" component={OrderList} />
            <AdminRoute path="/userlist" component={UserList} />
            <AdminRoute path="/user/:id/edit" component={UserEdit} />
            <AdminRoute path="/dashboard" component={Dashboard} />
            <SellerRoute path="/productlist/seller" component={ProductList} />
            <SellerRoute path="/orderlist/seller" component={OrderList} />
            <Redirect to="/products" />
          </Switch>
        </main>
        <footer className="App-footer container">
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
