import React from "react";
import ReactDOM from "react-dom";

export function PayPalButton(props) {
  // eslint-disable-next-line no-undef
  const PayPalButtonV2 = window.paypal.Buttons.driver("react", {
    React,
    ReactDOM,
  });

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        { amount: { currency_code: "USD", value: props.amount } },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (paymentResult) {
      props.onSuccess(paymentResult);
    });
  };

  const onError = (err) => {
    console.error("error from the onError callback", err);
  };

  return (
    <PayPalButtonV2
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      onError={(err) => onError(err)}
    />
  );
}
