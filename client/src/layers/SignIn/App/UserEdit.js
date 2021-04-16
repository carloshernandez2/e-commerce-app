import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBox from "../../../app/components/MessageBox";
import LoadingBox from "../../../app/components/LoadingBox";
import {
  getUsers,
  modifiedUsersError,
  singleUserState,
  userState,
  modifiedUsersStatus,
  modifyUsers,
  restoreModifiedUser,
  restoreUsers,
  usersError,
  usersStatus,
  fetchUser,
} from "../features/SignInSlice";

export default function UserEdit(props) {
  const userId = props.match.params.id;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const error = useSelector(usersError);
  const user = useSelector((state) => singleUserState(state, userId));
  const userInSession = useSelector(userState);
  const status = useSelector(usersStatus);
  const modifiedError = useSelector(modifiedUsersError);
  const modifiedStatus = useSelector(modifiedUsersStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    if (modifiedStatus === "succeeded") {
      dispatch(restoreModifiedUser());
      dispatch(restoreUsers());
      if (userId === userInSession._id)
        dispatch(fetchUser({ userId: userInSession._id }));
      props.history.push("/userlist");
    }
  }, [dispatch, modifiedStatus, props.history, userId, userInSession]);

  useEffect(() => {
    if (!user) {
      dispatch(getUsers({ userId }));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsSeller(user.isSeller);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, user, userId]);

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch update user
    dispatch(modifyUsers({ updateId: userId, name, email, isSeller, isAdmin }));
  };
  return status === "idle" ? null : status === "loading" ? (
    <LoadingBox variant="big" />
  ) : status === "failed" ? (
    <MessageBox variant="danger">{error.message}</MessageBox>
  ) : status === "succeeded" && !user ? (
    <MessageBox>No se encontró el usuario</MessageBox>
  ) : (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Editar usuario</h1>
          {modifiedStatus === "loading" && <LoadingBox />}
          {modifiedStatus === "failed" && (
            <MessageBox variant="danger">{modifiedError.message}</MessageBox>
          )}
        </div>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            placeholder="ingresa tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            placeholder="Ingresa el correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="isSeller">Es vendedor</label>
          <input
            id="isSeller"
            type="checkbox"
            checked={isSeller}
            onChange={(e) => setIsSeller(e.target.checked)}
          ></input>
        </div>
        <div>
          <label htmlFor="isAdmin">Es administrador</label>
          <input
            id="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          ></input>
        </div>
        <div>
          <button type="submit" className="primary">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}
