import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { userState } from "../../layers/SignIn/features/SignInSlice";

export default function PrivateRoute({ component: Component, ...rest }) {
  const userInfo = useSelector(userState);
  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="/signin" />
        )
      }
    ></Route>
  );
}