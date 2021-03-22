import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageBox from '../../Carrito/features/MessageBox';
import { userState } from '../../SignIn/features/SignInSlice';
import LoadingBox from '../features/LoadingBox';
import { listOrderMine, ordersError, ordersState, ordersStatus } from '../features/OrderSlice';

import './OrderHistory.css';

export default function OrderHistory(props) {

    const status = useSelector(ordersStatus)
    const orders = useSelector(ordersState)
    const user = useSelector(userState)
    const error = useSelector(ordersError)

    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) props.history.push('/registro');
    }, [props.history, user])

    useEffect(() => {
    dispatch(listOrderMine());
    }, [dispatch]);

    return (
    <div>
        <h1>Historial de pedidos</h1>
        {status === "loading" ? (
            <LoadingBox variant="big"/>
        ) : status === "failed" ? (
            <MessageBox variant="danger">{error.message}</MessageBox>
        ) : (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>FECHA</th>
                    <th>TOTAL</th>
                    <th>PAGADO</th>
                    <th>ENTREGADO</th>
                    <th>ACCIONES</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                    <td>
                        {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : 'No'}
                    </td>
                    <td>
                        <button
                        type="button"
                        className="small"
                        onClick={() => {
                            props.history.push(`/order/${order._id}`);
                        }}
                        >
                        Detalles
                        </button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
        )}
    </div>
    );
}