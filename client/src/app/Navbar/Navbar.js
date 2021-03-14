import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { carritoItems } from '../../layers/Carrito/features/CarritoSlice';
import Name from '../../layers/SignIn/features/Name';
import { userState } from '../../layers/SignIn/features/SignInSlice';

import './NavBar.css';

export function Navbar() {

  const cartItems = useSelector(carritoItems);
  const user = useSelector(userState);

  return (
    <React.Fragment>
      <figure className="logo">
        <Link to="/" className="link"><img src="/images/Free_Sample_By_Wix.png" alt="Logo"/></Link>
      </figure>
      <nav className="nav">
        <ul className="list">
          <li>
            <Link to="/cart" className="link">
              Carrito
              {cartItems > 0 && (
                <span className="badge">{cartItems}</span>
              )}
            </Link>
          </li>
          <li>
            <Name user={user}/>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  )
}
