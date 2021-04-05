import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { singleProductState } from '../../Home/features/ProductSlice';
import { carritoItems, carritoState, carritoUpdated, deleteItem, messageState, resetMessage } from '../features/CarritoSlice';
import MessageBox from '../features/MessageBox';

export default function Carrito(props) {

    const id = props.match.params.id;
    const qty = props.location.search
    ? Number(props.location.search.split('=')[1])
    : 1;

    const dispatch = useDispatch();

    const product = useSelector(state => singleProductState(state, id));
    const cartItems = useSelector(carritoItems);
    const cart = useSelector(carritoState);
    const { text, type } = useSelector(messageState);

    const [error, setError] = useState({});

    useEffect(() => {
        if (product) dispatch(carritoUpdated(product, qty));
    }, [dispatch, product, qty])

    useEffect(() => {
        return () => dispatch(resetMessage())
    }, [dispatch])

    // elimina el alert de error cuando una cantidad es ingresada satisfactoriamente
    useEffect(() =>{
      let newError = error
      for (let obj of cart) {
        newError[obj.product] = false
      }
      setError(newError)
    }, [cart, error])

    const removeFromCartHandler = (id) => {
        // delete action
        dispatch(deleteItem(id))
    };

    const closeAlert = () => {
      dispatch(resetMessage())
    }

    const checkoutHandler = () => {
        props.history.push('/registro?redirect=compra');
    };

    return (
      <div className="container top">
        <div className="foco">
          {text && <MessageBox variant={type} close={closeAlert}>{text}</MessageBox>}
          <h1>Carrito</h1>
          {cartItems === 0 ? (
            <MessageBox>
              El carrito está vacio. <Link to="/products">Ir a comprar</Link>
            </MessageBox>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.product}>
                  <div className="container">
                    <div>
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => e.target.src = '/images/fallback.jpg'}
                        className="pequeño"
                      ></img>
                    </div>
                    <div className="min-30">
                      <Link to={`/products/${item.product}`}>{item.name}</Link>
                    </div>
                    <div>
                        <input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                            e.target.validity.valid? 
                                dispatch(
                                    carritoUpdated(item, Number(e.target.value))
                                )
                                : setError({...error, [item.product]: true})
                            }
                            max={item.countInStock}
                            min="1"
                            required
                        />
                    </div>
                    {error[item.product] && <div>
                    <MessageBox variant="danger">No deberias ingresar cantidades que no se encuentren disponibles</MessageBox>
                    </div>}
                    <div>${item.price}</div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="contenido-producto">
          <div className="carta cuerpo-carta">
            <ul>
              <li>
                <h2>
                  Subtotal ({cart.reduce((a, c) => a + c.qty, 0)} items) : $
                  {cart.reduce((a, c) => a + c.price * c.qty, 0)}
                </h2>
              </li>
              <li>
                <button
                  type="button"
                  onClick={checkoutHandler}
                  className="primary block"
                  disabled={cartItems === 0}
                >
                  Proceder a la compra
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}