import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { carritoItems } from '../../layers/Carrito/features/CarritoSlice';

import './NavBar.css';

export function Navbar() {

  const cartItems = useSelector(carritoItems);

  return (
    <React.Fragment>
      <figure className="logo">
        <Link to="/" className="link"><img src="/images/Free_Sample_By_Wix.png" alt="Logo"/></Link>
      </figure>
      <nav className="nav">
        <ul className="list">
          <Link to="/cart" className="link">
            Carrito
            {cartItems > 0 && (
              <span className="badge">{cartItems}</span>
            )}
          </Link>
          <Link to="/registro" className="link">Regístrate</Link>
        </ul>
      </nav>
    </React.Fragment>
  )
}
