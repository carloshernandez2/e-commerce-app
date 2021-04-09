import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  compraState,
  metodoPago,
  paymentMethodState,
} from "../features/CarritoSlice";
import CheckoutSteps from "../features/CheckoutSteps";

export default function Pago(props) {
  const compra = useSelector(compraState);
  const metodo = useSelector(paymentMethodState);
  const [paymentMethod, setPaymentMethod] = useState(metodo || "PayPal");
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(metodoPago(paymentMethod));
    props.history.push("/placeorder");
  };

  useEffect(() => {
    if (!compra.address) {
      props.history.push("/shipping");
    }
  }, [props.history, compra]);

  const checked1 = paymentMethod === "PayPal";
  const checked2 = paymentMethod === "Stripe";

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Método de pago</h1>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="paypal"
              value="PayPal"
              name="paymentMethod"
              checked={checked1}
              required
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="paypal">PayPal</label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="stripe"
              value="Stripe"
              name="paymentMethod"
              checked={checked2}
              required
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="stripe">Stripe</label>
          </div>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
