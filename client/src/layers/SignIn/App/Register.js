import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MessageBox from "../../../app/components/MessageBox";
import {
  fetchUser,
  restoreState,
  userError,
  userState,
} from "../features/SignInSlice";

export default function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const error = useSelector(userError);
  const user = useSelector(userState);

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Tus contraseñas son diferentes");
    } else {
      dispatch(fetchUser({ email, password, name }));
    }
  };
  useEffect(() => {
    if (user) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, user]);

  useEffect(() => {
    dispatch(restoreState(null));
  }, [dispatch, email, password, name, confirmPassword]);

  useEffect(() => {
    return () => {
      dispatch(restoreState(null));
    };
  }, [dispatch]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Crear cuenta</h1>
        </div>
        {error && (
          <div className="container centro">
            <MessageBox variant="danger">{error.message}</MessageBox>
          </div>
        )}
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            placeholder="Ingresa tu nombre"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa la contraseña"
            minLength="8"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirma tu contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirma la contraseña"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Inscríbete
          </button>
        </div>
        <div>
          <label />
          <div>
            Ya tienes una cuenta?{" "}
            <Link to={`/registro?redirect=${redirect}`}>Regístrate</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
