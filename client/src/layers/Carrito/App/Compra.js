import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addressState,
  compraState,
  guardarCompra,
} from "../features/CarritoSlice";
import { userState } from "../../SignIn/features/SignInSlice";
import CheckoutSteps from "../../../app/components/CheckoutSteps";

export default function Compra(props) {
  const user = useSelector(userState);
  const compra = useSelector(compraState);
  const addressMap = useSelector(addressState);
  const shippingAddress = compra.shippingAddress || {} ;
  const [lat, setLat] = useState(shippingAddress.lat);
  const [lng, setLng] = useState(shippingAddress.lng);
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
    const newLat = addressMap ? addressMap.lat : lat;
    const newLng = addressMap ? addressMap.lng : lng;
    if (addressMap) {
      setLat(addressMap.lat);
      setLng(addressMap.lng);
    }
    let moveOn = true;
    if (!newLat || !newLng) {
      moveOn = window.confirm(
        "No colocaste una ubicación en el mapa. Continuar?"
      );
    }
    if (moveOn) {
      dispatch(
        guardarCompra({
          fullName,
          address,
          city,
          postalCode,
          country,
          lat: newLat,
          lng: newLng,
        })
      );
      props.history.push("/pago");
    }
  };
  
  const chooseOnMap = () => {
    dispatch(
      guardarCompra({
        fullName,
        address,
        city,
        postalCode,
        country,
        lat,
        lng,
      })
    );
    props.history.push("/map");
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
          <label htmlFor="chooseOnMap">Ubicación</label>
          <button type="button" onClick={chooseOnMap}>
            Escoger en el mapa
          </button>
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
