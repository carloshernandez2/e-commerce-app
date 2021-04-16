import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";
import MessageBox from "../../../app/components/MessageBox";
import LoadingBox from "../../../app/components/LoadingBox";
import {
  resetSummary,
  summaryOrder,
  summaryError,
  summaryStatus,
  summaryState,
} from "../features/OrderSlice";

import "./Dashboard.css";

export default function Dashboard() {
  const summary = useSelector(summaryState);
  const status = useSelector(summaryStatus);
  const error = useSelector(summaryError);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(summaryOrder());
    return () => dispatch(resetSummary());
  }, [dispatch]);
  return (
    <div>
      <div className="container">
        <h1>Dashboard</h1>
      </div>
      {status === "idle" ? null : status === "loading" ? (
        <LoadingBox variant="big" />
      ) : status === "failed" ? (
        <MessageBox variant="danger">{error.message}</MessageBox>
      ) : (
        <>
          <ul className="container summary">
            <li>
              <div className="summary-title color1">
                <span>
                  <i className="fa fa-users" /> Usuarios
                </span>
              </div>
              <div className="summary-body">{summary.users[0].numUsers}</div>
            </li>
            <li>
              <div className="summary-title color2">
                <span>
                  <i className="fa fa-shopping-cart" /> Pedidos
                </span>
              </div>
              <div className="summary-body">
                {summary.orders[0] ? summary.orders[0].numOrders : 0}
              </div>
            </li>
            <li>
              <div className="summary-title color3">
                <span>
                  <i className="fa fa-money" /> Ventas
                </span>
              </div>
              <div className="summary-body">
                $
                {summary.orders[0]
                  ? summary.orders[0].totalSales.toFixed(2)
                  : 0}
              </div>
            </li>
          </ul>
          <div>
            <div>
              <h2>Ventas</h2>
              {summary.dailyOrders.length === 0 ? (
                <MessageBox>Sin ventas</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="AreaChart"
                  loader={<div>Cargando información</div>}
                  data={[
                    ["Date", "Sales"],
                    ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                  ]}
                ></Chart>
              )}
            </div>
          </div>
          <div>
            <h2>Categorias</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>Sin categorias</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Cargando información</div>}
                data={[
                  ["Category", "Products"],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
