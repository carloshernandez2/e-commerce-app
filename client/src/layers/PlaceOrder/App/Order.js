import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MessageBox from '../../Carrito/features/MessageBox';
import { PayPalButton } from 'react-paypal-button-v2';
import { userState } from '../../SignIn/features/SignInSlice';
import { deleteUpdateOrder, fetchOrder, modifiedError, modifiedStatus, orderError, orderState, orderStatus, resetModified, resetOrder } from '../features/OrderSlice';
import LoadingBox from '../features/LoadingBox';

export default function Order(props) {

    const orderId = props.match.params.id;
    const user = useSelector(userState);
    const order = useSelector(orderState);
    const status = useSelector(orderStatus);
    const error = useSelector(orderError);
    const updateStatus = useSelector(modifiedStatus);
    const updateError = useSelector(modifiedError);

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const addPayPalScript = async () => {
        const response = await fetch('/api/config/paypal');
        const data = await response.text();
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };

    useEffect(() => {
        if (!order._id) {
            dispatch(fetchOrder({ orderId }));
        } else {
            if (!order.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }
    }, [dispatch, order, orderId, sdkReady]);
    
    const successPaymentHandler = (paymentResult) => {
        dispatch(fetchOrder({ order, paymentResult }));
    };

    const deliverHandler = () => {
        dispatch(deleteUpdateOrder({ updateId: order._id }));
      };

    useEffect(() => {
        if (!user) {
            props.history.push('/placeorder');
        }
    }, [props.history, user]);

    useEffect(() => {
        return () => {
            dispatch(resetModified());
            dispatch(resetOrder([]));
        }
    }, [dispatch]);

    useEffect(() => {
        if (updateStatus === "succeeded") {
            dispatch(fetchOrder({ orderId }));
        }
    }, [dispatch, orderId, updateStatus]);

    return status[1] === "loading" ? (
        <LoadingBox variant="big"/>
    ) : status[1] === "failed" && error.renderError ? (
        <MessageBox variant="danger">{error.renderError.message}
        <a href={window.location.href} className="link"> intenta nuevamente</a></MessageBox>
    ) : status[1] === "idle" ? (
        null
    ) : (
        <div>
            <h1>Pedido {order._id}</h1>
            <div className="container top">
                <div className="foco">
                    <ul>
                    <li>
                        <div className="carta cuerpo-carta">
                        <h2>Envío</h2>
                        <p>
                            <strong>Nombre:</strong> {order.shippingAddress.fullName} <br />
                            <strong>Dirección: </strong> {order.shippingAddress.address},
                            {order.shippingAddress.city},{' '}
                            {order.shippingAddress.postalCode},
                            {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <MessageBox variant="success">
                                Entregado en {order.deliveredAt}
                            </MessageBox>
                        ) : (
                            <MessageBox variant="danger">No entregado</MessageBox>
                        )}
                        </div>
                    </li>
                    <li>
                        <div className="carta cuerpo-carta">
                        <h2>Pago</h2>
                        <p>
                            <strong>Método:</strong> {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <MessageBox variant="success">
                            Pagado en {order.paidAt}
                            </MessageBox>
                        ) : (
                            <MessageBox variant="danger">No pagado</MessageBox>
                        )}
                        </div>
                    </li>
                    <li>
                        <div className="carta cuerpo-carta">
                        <h2>Elementos del pedido</h2>
                        <ul>
                            {order.orderItems.map((item) => (
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
                                    <Link to={`/products/${item.product}`}>
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
                                <div>${order.itemsPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="container">
                                <div>Envío</div>
                                <div>${order.shippingPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="container">
                                <div>Impuestos</div>
                                <div>${order.taxPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="container">
                                <div>
                                    <strong>Total</strong>
                                </div>
                                <div>
                                    <strong>${order.totalPrice.toFixed(2)}</strong>
                                </div>
                            </div>
                        </li>
                        {!order.isPaid && (
                            <li>
                            {!sdkReady ? (
                                <LoadingBox />
                            ) : (
                                <>
                                <PayPalButton
                                amount={order.totalPrice}
                                onSuccess={successPaymentHandler}
                                />
                                
                                {error.updateError && (
                                    <MessageBox variant="danger">{error.updateError.message}</MessageBox>
                                )}
                                </>
                            )}
                            </li>
                        )}
                        {user.isAdmin && order.isPaid && !order.isDelivered && (
                            <li>
                            {updateStatus === "loading" && <LoadingBox />}
                            {updateStatus === "failed" && (
                                <MessageBox variant="danger">{updateError.message}</MessageBox>
                            )}
                            <button
                                type="button"
                                className="primary block"
                                onClick={deliverHandler}
                            >
                                Marcar como Entregado
                            </button>
                            </li>
                        )}
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}