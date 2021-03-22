import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, userError, userStatus } from './SignInSlice';

import './Name.css';

import MessageBox from '../../Carrito/features/MessageBox';
import { Link } from 'react-router-dom';
import { restoreCart } from '../../Carrito/features/CarritoSlice';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';

function Name(props) {

    const {user} = props;

    const status = useSelector(userStatus);
    const error = useSelector(userError);

    const dispatch = useDispatch();

    const signoutHandler = () => {
        dispatch(signOut())
        dispatch(restoreCart())
    }

    const main = user && (
        <div className="dropdown">
            <Link to="#" className="link">
                {user.name} <i className="fa fa-caret-down"></i>{' '}
            </Link>
            <ul className="dropdown-content">
                <li>
                    <Link to="/orderhistory" className="link">Historial</Link>
                </li>
                <li>
                    <Link to="#signout" onClick={signoutHandler} className="link">
                        Sign Out
                    </Link>
                </li>
            </ul>
        </div>
    )

    const register = (
        <Link to="/registro" className="link">Regístrate</Link>
    )

    let content;

    if (status === 'idle') {
        content = user? main : register;
    } else if (status === 'loading') {
        content = (
            <LoadingBox />
        )
    } else if (status === 'succeeded') {
        content = main
    } else if (status === 'failed') {
        const err = Number(error.name)
        if (err !== 401) {
            content = (
                <div className="container centro">
                    <MessageBox variant="danger">{error.message}</MessageBox>
                </div>
            )
        } else {
            content = register;
        }
    }

    return content

}

export default Name;
