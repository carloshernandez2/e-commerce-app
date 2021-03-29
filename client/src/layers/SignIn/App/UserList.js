import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, modifiedUsersError, modifiedUsersStatus, modifyUsers, restoreModifiedUser, restoreUsers, usersError, usersState, usersStatus } from '../features/SignInSlice';
import MessageBox from '../../Carrito/features/MessageBox';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';

export default function UserList(props) {

    const error = useSelector(usersError);
    const users = useSelector(usersState);
    const status = useSelector(usersStatus);
    const modifiedError = useSelector(modifiedUsersError);
    const modifiedStatus = useSelector(modifiedUsersStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsers({}));
        return () => {
            dispatch(restoreUsers());
        }
    }, [dispatch]);

    useEffect(() => {
        if (modifiedStatus === "succeeded") {
            dispatch(restoreModifiedUser());
            dispatch(getUsers({}));
        }
    }, [dispatch, modifiedStatus]);

    const deleteHandler = (user) => {
        if (window.confirm('¿Estás seguro?')) {
          dispatch(modifyUsers({ deleteId: user._id }));
        }
      };

    return (
        <div>
            <h1>Usuarios</h1>
            {modifiedStatus === "loading" && <LoadingBox></LoadingBox>}
            {modifiedStatus === "failed" && <MessageBox variant="danger">{modifiedError.message}</MessageBox>}
            {status === 'idle' ? (
                null
            ) : status === 'loading' ? (
                <LoadingBox variant="big" />
            ) : status === 'failed' ? (
                <MessageBox variant="danger">{error.message}</MessageBox>
            ) : (
                <table className="table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>CORREO</th>
                    <th>ES VENDEDOR</th>
                    <th>ES ADMINISTRADOR</th>
                    <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isSeller ? 'Si' : ' NO'}</td>
                        <td>{user.isAdmin ? 'Si' : 'NO'}</td>
                        <td>
                            <button
                            type="button"
                            className="small"
                            onClick={() => props.history.push(`/user/${user._id}/edit`)}
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                className="small"
                                onClick={() => deleteHandler(user)}
                            >
                                Borrar
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    );
}