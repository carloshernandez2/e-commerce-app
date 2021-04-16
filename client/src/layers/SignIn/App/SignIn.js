import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MessageBox from "../../../app/components/MessageBox";
import {
  fetchUser,
  userError,
  restoreState,
  userState,
} from "../features/SignInSlice";

import "./SignIn.css";

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const error = useSelector(userError);
  const user = useSelector(userState);

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  useEffect(() => {
    if (user) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(fetchUser({ email, password }));
  };

  useEffect(() => {
    dispatch(restoreState(null));
  }, [dispatch, email, password]);

  useEffect(() => {
    return () => {
      dispatch(restoreState(null));
    };
  }, [dispatch]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Registro</h1>
        </div>
        {error && (
          <div className="container centro">
            <MessageBox variant="danger">{error.message}</MessageBox>
          </div>
        )}
        <div>
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa la contraseña"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Registrate
          </button>
        </div>
        <div>
          <label />
          <div>
            Nuevo usuario?{" "}
            <Link to={`/inscripcion?redirect=${redirect}`}>Crea tu cuenta</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
