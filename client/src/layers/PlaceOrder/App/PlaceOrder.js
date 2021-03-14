import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { carritoItems, carritoState, compraState, paymentMethodState } from '../../Carrito/features/CarritoSlice';
import CheckoutSteps from '../../Carrito/features/CheckoutSteps';

export default function PlaceOrder(props) {
  const cart = useSelector(carritoState);
  const cartItems = useSelector(carritoItems);
  const metodo = useSelector(paymentMethodState);
  const compra = useSelector(compraState);

  useEffect(() => {
    if (!metodo) {
        props.history.push('/payment');
      }
}, [props.history, metodo]);

  const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
  const itemsPrice = toPrice(
    cart.reduce((a, c) => a + c.qty * c.price, 0)
  );
  const shippingPrice = itemsPrice > 100 ? toPrice(0) : toPrice(10);
  const taxPrice = toPrice(0.15 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  const placeOrderHandler = () => {
    // TODO: dispatch place order action
  };
  
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="container top">
        <div className="foco">
          <ul>
            <li>
              <div className="carta cuerpo-carta">
                <h2>Datos de compra</h2>
                <p>
                  <strong>Name:</strong> {compra.fullName} <br />
                  <strong>Dirección: </strong> {compra.address},{' '}
                  {compra.city}, {compra.postalCode}
                  , {compra.country}
                </p>
              </div>
            </li>
            <li>
              <div className="carta cuerpo-carta">
                <h2>Pago</h2>
                <p>
                  <strong>Método:</strong> {metodo}
                </p>
              </div>
            </li>
            <li>
              <div className="carta cuerpo-carta">
                <h2>Elementos del pedido</h2>
                <ul>
                  {cart.map((item) => (
                    <li key={item.product}>
                      <div className="container">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="pequeño"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="contenido-producto">
          <div className="carta cuerpo-carta">
            <ul>
              <li>
                <h2>Resumen del pedido</h2>
              </li>
              <li>
                <div className="container">
                  <div>Items</div>
                  <div>${itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="container">
                  <div>Envío</div>
                  <div>${shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="container">
                  <div>Impuestos</div>
                  <div>${taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="container">
                  <div>
                    <strong>Orden final</strong>
                  </div>
                  <div>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  className="primary block"
                  disabled={cartItems === 0}
                >
                  Realizar pedido
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}