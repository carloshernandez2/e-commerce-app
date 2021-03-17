import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { carritoItems, carritoState, compraState, paymentMethodState, restoreCart } from '../../Carrito/features/CarritoSlice';
import CheckoutSteps from '../../Carrito/features/CheckoutSteps';
import MessageBox from '../../Carrito/features/MessageBox';
import { userState } from '../../SignIn/features/SignInSlice';
import { orderState, orderStatus, orderError, fetchOrder, resetOrder } from "../features/OrderSlice";

export default function PlaceOrder(props) {
  const cart = useSelector(carritoState);
  const cartItems = useSelector(carritoItems);
  const metodo = useSelector(paymentMethodState);
  const compra = useSelector(compraState);
  const user = useSelector(userState);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!metodo) {
        props.history.push('/pago');
      }
  }, [props.history, metodo]);

  const order = useSelector(orderState);
  const status = useSelector(orderStatus);
  const error = useSelector(orderError);

  const dispatch = useDispatch();

  const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
  const itemsPrice = toPrice(
    cart.reduce((a, c) => a + c.qty * c.price, 0)
  );
  const shippingPrice = itemsPrice > 100 ? toPrice(0) : toPrice(10);
  const taxPrice = toPrice(0.15 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = () => {
    const orderItems = cart.map((item => {
      return {
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product
      }
    }))
    const newOrder = {
      orderItems,
      shippingAddress: compra,
      paymentMethod: metodo,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    }
    dispatch(fetchOrder({newOrder}));
  };

  useEffect(() => {

    if (status[0] === "idle") {
      setLoading(false)
    }

    if (status[0] === "succeeded") {
      setLoading(false)
      dispatch(resetOrder([]));
      const param = order.order && order.order._id
      if (user) props.history.push(`/order/${param}`);
      dispatch(restoreCart())
    }

    if (status[0] === "loading") {
      setLoading(true)
    }

    if (status[0] === "failed") {
      setLoading(false)
    }
  }, [dispatch, order, props.history, status, user]);
  
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
              {error.renderError && <MessageBox variant="danger">{error.renderError.message}</MessageBox>}
              {loading && (
                <div className="container centro">
                    <div className="lds-ring-small"><div></div><div></div><div></div><div></div></div>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}