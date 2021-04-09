import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBox from "../../Carrito/features/MessageBox";
import { userState } from "../../SignIn/features/SignInSlice";
import LoadingBox from "../features/LoadingBox";
import {
  modifiedError,
  modifiedStatus,
  deleteUpdateOrder,
  listOrderMine,
  ordersError,
  ordersState,
  ordersStatus,
  resetModified,
  resetOrders,
} from "../features/OrderSlice";

export default function OrderList(props) {
  const user = useSelector(userState);
  const status = useSelector(ordersStatus);
  const orders = useSelector(ordersState);
  const error = useSelector(ordersError);
  const deleteStatus = useSelector(modifiedStatus);
  const deleteError = useSelector(modifiedError);

  const sellerMode = props.match.path.indexOf("/seller") >= 0;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      listOrderMine({ admin: true, seller: sellerMode ? user._id : "" })
    );
    return () => {
      dispatch(resetOrders());
      dispatch(resetModified());
    };
  }, [dispatch, sellerMode, user]);

  useEffect(() => {
    if (deleteStatus === "succeeded") {
      dispatch(resetModified());
      dispatch(
        listOrderMine({ admin: true, seller: sellerMode ? user._id : "" })
      );
    }
  }, [deleteStatus, dispatch, sellerMode, user]);

  const deleteHandler = (order) => {
    if (window.confirm("¿Estás seguro de que quieres borrarlo?")) {
      dispatch(deleteUpdateOrder({ deleteId: order._id }));
    }
  };

  return status === "idle" ? null : status === "loading" ? (
    <LoadingBox variant="big" />
  ) : status === "failed" ? (
    <MessageBox variant="danger">{error.message}</MessageBox>
  ) : status === "succeeded" && !orders.length ? (
    <MessageBox>No se encontraron pedidos</MessageBox>
  ) : (
    <div>
      <h1>Pedidos</h1>
      {deleteStatus === "loading" && <LoadingBox />}
      {deleteStatus === "failed" && (
        <MessageBox variant="danger">{deleteError.message}</MessageBox>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>USUARIO</th>
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
              <td>{order.user.name}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>{order.totalPrice.toFixed(2)}</td>
              <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
              <td>
                {order.isDelivered ? order.deliveredAt.substring(0, 10) : "No"}
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
                <button
                  type="button"
                  className="small"
                  onClick={() => deleteHandler(order)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
