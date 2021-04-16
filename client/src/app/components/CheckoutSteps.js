import React from "react";

import "./css/CheckoutSteps.css";

export default function CheckoutSteps(props) {
  return (
    <div className="container checkout-steps">
      <div className={props.step1 ? "active" : ""}>Registro</div>
      <div className={props.step2 ? "active" : ""}>Compra</div>
      <div className={props.step3 ? "active" : ""}>Pago</div>
      <div className={props.step4 ? "active" : ""}>Realizar pedido</div>
    </div>
  );
}
