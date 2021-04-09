import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut, userStatus } from "./SignInSlice";

import "./Name.css";

import { Link } from "react-router-dom";
import { restoreCart } from "../../Carrito/features/CarritoSlice";
import LoadingBox from "../../PlaceOrder/features/LoadingBox";

function Name(props) {
  const { user } = props;

  const status = useSelector(userStatus);

  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(signOut());
    dispatch(restoreCart());
  };

  const main = user && (
    <div className="dropdown">
      <Link to="#" className="link">
        {user.name} <i className="fa fa-caret-down"></i>{" "}
      </Link>
      <ul className="dropdown-content">
        <li>
          <Link to="/profile" className="link">
            Perfil
          </Link>
        </li>
        <li>
          <Link to="/orderhistory" className="link">
            Historial
          </Link>
        </li>
        <li>
          <Link to="#signout" onClick={signoutHandler} className="link">
            Salir
          </Link>
        </li>
      </ul>
    </div>
  );

  const register = (
    <Link to="/registro" className="link">
      Regístrate
    </Link>
  );

  let content;

  if (status === "idle") {
    content = user ? main : register;
  } else if (status === "loading") {
    content = <LoadingBox />;
  } else if (status === "succeeded") {
    content = main;
  } else if (status === "failed") {
    content = user ? main : register;
  }

  return content;
}

export default Name;
