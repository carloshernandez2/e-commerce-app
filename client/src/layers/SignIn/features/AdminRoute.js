import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { userState } from "./SignInSlice";

export default function AdminRoute({ component: Component, ...rest }) {
  const user = useSelector(userState);
  return (
    <Route
      {...rest}
      render={(props) =>
        user && user.isAdmin ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="/registro" />
        )
      }
    ></Route>
  );
}
