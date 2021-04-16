import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { userState } from "../../layers/SignIn/features/SignInSlice";

export default function SellerRoute({ component: Component, ...rest }) {
  const user = useSelector(userState);
  return (
    <Route
      {...rest}
      render={(props) =>
        user && user.isSeller ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="/registro" />
        )
      }
    ></Route>
  );
}
