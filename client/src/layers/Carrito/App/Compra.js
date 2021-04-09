import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compraState, guardarCompra } from "../features/CarritoSlice";
import { userState } from "../../SignIn/features/SignInSlice";
import CheckoutSteps from "../features/CheckoutSteps";

export default function Compra(props) {
  const user = useSelector(userState);
  const compra = useSelector(compraState);
  const [fullName, setFullName] = useState(compra.fullName || "");
  const [address, setAddress] = useState(compra.address || "");
  const [city, setCity] = useState(compra.city || "");
  const [postalCode, setPostalCode] = useState(compra.postalCode || "");
  const [country, setCountry] = useState(compra.country || "");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      props.history.push("/registro");
    }
  }, [props.history, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(guardarCompra({ fullName, address, city, postalCode, country }));
    props.history.push("/pago");
  };

  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Dirección de compra</h1>
        </div>
        <div>
          <label htmlFor="fullName">Nombre completo</label>
          <input
            type="text"
            id="fullName"
            placeholder="Ingresa tu nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            placeholder="Ingresa tu dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="city">Ciudad</label>
          <input
            type="text"
            id="city"
            placeholder="Ingresa tu ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="postalCode">Código postal</label>
          <input
            type="text"
            id="postalCode"
            placeholder="Ingresa tu código postal"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="country">País</label>
          <input
            type="text"
            id="country"
            placeholder="Ingresa tu país"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          ></input>
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
