import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUpload, setMessage, uploadError, uploadImage, uploadStatus } from '../../Carrito/features/CarritoSlice';
import MessageBox from '../../Carrito/features/MessageBox';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import { fetchUser, restoreState, userError, userState, userStatus } from '../features/SignInSlice';

export default function Profile(props) {

    const error = useSelector(userError);
    const userInSession = useSelector(userState);
    const status = useSelector(userStatus);
    const statusUpload = useSelector(uploadStatus)
    const errorUpload = useSelector(uploadError)

    const seller = userInSession && userInSession.seller

    const [name, setName] = useState((userInSession && userInSession.name) || '');
    const [email, setEmail] = useState((userInSession && userInSession.email) || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sellerName, setSellerName] = useState((seller && seller.name) || '');
    const [sellerDescription, setSellerDescription] = useState((seller && seller.description) || '');

    const dispatch = useDispatch();

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        dispatch(uploadImage({ bodyFormData, uploadId: userInSession._id }))
      };

    useEffect(() => {
        return () => {
            dispatch(restoreState(null));
            dispatch(restoreUpload())
        }
    }, [dispatch])

    useEffect(() => {
        if (status === 'succeeded') {
            dispatch(setMessage({ text:'Perfil actualizado satisfactoriamente', type: 'success' }))
            props.history.push('/products');
        }
        if (!userInSession) props.history.push('/registro');
    }, [dispatch, props.history, status, userInSession]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Tus contraseñas son diferentes');
          } else {
            dispatch(fetchUser({
                userId: userInSession._id, 
                name,
                email,
                password,
                sellerName,
                sellerDescription
            }));
          }
    };

    return status === 'loading' ? (
    <LoadingBox variant="big"/>
    ) : (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Perfil</h1>
                </div>
                {status === 'failed' ? (
                    <MessageBox variant="danger">{error.message}</MessageBox>
                ) : null}
                <div>
                    <label htmlFor="name">Nombre</label>
                    <input
                    id="name"
                    type="text"
                    placeholder="Ingresa nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength="20"
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
                    required
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
                    required
                    minLength="8"
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
                    required
                    ></input>
                </div>
                {seller && (
                    <>
                        <h2>Vendedor</h2>
                        <h3 className="cuerpo-carta">Logo</h3>
                        <div>
                            <label htmlFor="sellerLogo">Logo del vendedor</label>
                            <input
                                type="file"
                                id="sellerLogo"
                                label="Escoge imagen"
                                onChange={uploadFileHandler}
                            ></input>
                            {statusUpload === 'loading' && <LoadingBox />}
                            {statusUpload === 'failed' && (
                                <MessageBox variant="danger">{errorUpload.message}</MessageBox>
                            )}
                            {statusUpload === 'succeeded' && (
                                <MessageBox variant="success">Archivo subido correctamente</MessageBox>
                            )}
                        </div>
                        <h3>Información</h3>
                        <div>
                            <label htmlFor="sellerName">Nombre del vendedor</label>
                            <input
                                id="sellerName"
                                type="text"
                                placeholder="Ingresa el nombre de vendedor"
                                value={sellerName}
                                onChange={(e) => setSellerName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="sellerDescription">Descripción del vendedor</label>
                            <input
                                id="sellerDescription"
                                type="text"
                                placeholder="Ingresa la descripción del vendedor"
                                value={sellerDescription}
                                onChange={(e) => setSellerDescription(e.target.value)}
                            ></input>
                        </div>
                    </>
                )}
                <div>
                    <label></label>
                    <button className="primary" type="submit">
                    Actualizar
                    </button>
                </div>
            </form>
        </div>
    )
}