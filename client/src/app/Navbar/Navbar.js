import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route } from 'react-router-dom'
import { carritoItems } from '../../layers/Carrito/features/CarritoSlice';
import MessageBox from '../../layers/Carrito/features/MessageBox';
import { categoriesError, categoriesState, categoriesStatus, listCategories, resetCategories, resetProductState } from '../../layers/Home/features/ProductSlice';
import SearchBox from '../../layers/Home/features/SearchBox';
import LoadingBox from '../../layers/PlaceOrder/features/LoadingBox';
import Name from '../../layers/SignIn/features/Name';
import { userState } from '../../layers/SignIn/features/SignInSlice';

import './NavBar.css';

export function Navbar() {

  const cartItems = useSelector(carritoItems);
  const user = useSelector(userState);
  const error = useSelector(categoriesError);
  const categories = useSelector(categoriesState);
  const status = useSelector(categoriesStatus);

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(listCategories());
    return () => {
        dispatch(resetCategories())
    }
  }, [dispatch])

  const handleClick = () => {
    dispatch(resetProductState())
    setSidebarIsOpen(false)
  }

  return (
    <>
      <header className="App-header container">
        <figure className="logo">
          <button
            type="button"
            className="open-sidebar"
            onClick={() => setSidebarIsOpen(true)}
          >
            <i className="fa fa-bars"></i>
          </button>
          <Link to="/" className="link"><img src="/images/Free_Sample_By_Wix.png" alt="Logo"/></Link>
        </figure>
        <div>
          <Route
            render={({ history }) => (
              <SearchBox history={history}></SearchBox>
            )}
          ></Route>
        </div>
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
            {user && user.isSeller && (
              <li>
                <div className="dropdown">
                  <Link to="#vendedor" className="link">
                    Vendedor <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/productlist/seller" className="link">Productos</Link>
                    </li>
                    <li>
                      <Link to="/orderlist/seller" className="link">Pedidos</Link>
                    </li>
                  </ul>
                </div>
              </li>
            )}
            {user && user.isAdmin && (
              <li>
                <div className="dropdown">
                  <Link to="#admin" className="link">
                    Admin <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/dashboard" className="link">Tablero</Link>
                    </li>
                    <li>
                      <Link to="/productlist" className="link">Productos</Link>
                    </li>
                    <li>
                      <Link to="/orderlist"className="link">Pedidos</Link>
                    </li>
                    <li>
                      <Link to="/userlist"className="link">Usuarios</Link>
                    </li>
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <aside className={sidebarIsOpen ? 'open' : ''}>
        <ul className="categories">
          <li>
            <strong>Categorias</strong>
            <button
              onClick={() => setSidebarIsOpen(false)}
              className="close-sidebar"
              type="button"
            >
              <i className="fa fa-close"></i>
            </button>
          </li>
          {status === 'idle' ? (
            null
          ) : status === 'loading' ? (
            <LoadingBox />
          ) : status === 'failed' ? (
            <MessageBox variant="danger">{error.message}</MessageBox>
          ) : (
            categories.map((c) => (
              <li key={c}>
                <Link
                  to={`/search/category/${c}`}
                  onClick={handleClick}
                  className="link"
                >
                  {c}
                </Link>
              </li>
            ))
          )}
        </ul>
      </aside>
    </>
  )
}
