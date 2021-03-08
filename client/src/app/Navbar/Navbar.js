import React from 'react'
import { Link } from 'react-router-dom'

import './NavBar.css';

export function Navbar() {

  return (
    <React.Fragment>
      <figure className="logo">
        <Link to="/" className="link"><img src="/images/Free_Sample_By_Wix.png" alt="Logo"/></Link>
      </figure>
      <nav className="nav">
        <ul className="list">
          <Link to="/carrito" className="link">Carrito</Link>
          <Link to="/registro" className="link">Regístrate</Link>
        </ul>
      </nav>
    </React.Fragment>
  )
}
