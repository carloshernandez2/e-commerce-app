import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageBox from '../../Carrito/features/MessageBox';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import { fetchUser, restoreState, userError, userState, userStatus } from '../features/SignInSlice';

export default function Profile(props) {

    const error = useSelector(userError);
    const userInSession = useSelector(userState);
    const status = useSelector(userStatus);

    const [name, setName] = useState((userInSession && userInSession.name) || '');
    const [email, setEmail] = useState((userInSession && userInSession.email) || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(restoreState(null));
        }
    }, [dispatch])

    useEffect(() => {
        if (!userInSession) props.history.push('/registro');
    }, [dispatch, props.history, userInSession]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Tus contraseñas son diferentes');
          } else {
            dispatch(fetchUser({userId: userInSession._id, email, password, name}));
            setConfirmPassword('');
            setPassword('');
          }
    };

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Perfil</h1>
                </div>
                {status === 'loading' ? (
                    <LoadingBox variant="big"/>
                ) : (
                    <>
                        {status === 'failed' ? (
                            <MessageBox variant="danger">{error.message}</MessageBox>
                        ) : status === 'succeeded' ?(
                            <MessageBox variant="success">Perfil actualizado satisfactoriamente</MessageBox>
                        ) : null}
                        <div>
                            <label htmlFor="name">Nombre</label>
                            <input
                            id="name"
                            type="text"
                            placeholder="Ingresa nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="email">Correo</label>
                            <input
                            id="email"
                            type="email"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="password">Contraseña</label>
                            <input
                            id="password"
                            type="password"
                            placeholder="Ingresa la nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirmar contraseña</label>
                            <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirma tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label />
                            <button className="primary" type="submit">
                            Actualizar
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}