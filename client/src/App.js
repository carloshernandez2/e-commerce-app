import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import './App.css';

import Home from "./layers/Home/App/Home";
import { Navbar } from "./app/Navbar/Navbar"
import { Product } from "./layers/Home/App/Product"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header container">
          <Navbar />
        </header>
        <main className="App-main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/products/:id" component={Product} />
            <Redirect to="/"/>
          </Switch>
        </main>
        <footer className="App-footer container">
          <p>All rights reserved</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
