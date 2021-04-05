import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, useRouteMatch, Redirect, Link } from "react-router-dom";

import Home from "../features/Home";
import { Product } from "../features/Product"
import MessageBox from "../../Carrito/features/MessageBox";
import { fetchProducts, productState, resetProductState } from "../features/ProductSlice";
import { productStatus } from "../features/ProductSlice";
import { productError } from "../features/ProductSlice";

import "./AppProducts.css";
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { Carousel } from 'react-responsive-carousel';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import ProductEdit from './ProductEdit';
import { getUsers, restoreUsers, usersError, usersState, usersStatus } from '../../SignIn/features/SignInSlice';
import { messageState, resetMessage } from '../../Carrito/features/CarritoSlice';

function AppProducts() {

    let { path } = useRouteMatch();

    const products = useSelector(productState);
    const status = useSelector(productStatus);
    const error = useSelector(productError);
    const errorSellers = useSelector(usersError);
    const sellers = useSelector(usersState);
    const statusSellers = useSelector(usersStatus);
    const { text, type } = useSelector(messageState);

    const dispatch = useDispatch();

    const closeAlert = () => {
        dispatch(resetMessage())
    }

    useEffect(() => {
        dispatch(fetchProducts({}))
        dispatch(getUsers({topSellers: true}))
        return () => {
            dispatch(resetMessage())
            dispatch(resetProductState())
            dispatch(restoreUsers())
        }
    }, [dispatch])

    const main = products.length? (
        <Switch>
            <Route exact path={`${path}`}>
                {text && <MessageBox variant={type} close={closeAlert}>{text}</MessageBox>}
                {statusSellers === 'idle' ? (
                    null
                ) : statusSellers === 'loading' ? (
                    <LoadingBox />
                ) : statusSellers === 'failed' ? (
                    <MessageBox variant="danger">{errorSellers}</MessageBox>
                ) : (
                    <>
                    <h2>Top Sellers</h2>
                    <Carousel showArrows autoPlay showThumbs={false}>
                        {sellers.map((seller) => (
                        <div key={seller._id}>
                            <Link to={`/seller/${seller._id}`}>
                                <img 
                                src={`${seller.seller.logo}?v=${Date.now()}`} 
                                alt={seller.seller.name} 
                                className="medio"
                                onError={(e) => e.target.src = '/images/fallback.jpg'}
                                />
                                <p className="legend">{seller.seller.name}</p>
                            </Link>
                        </div>
                        ))}
                    </Carousel>
                    </>
                )}
                <h2>Featured Products</h2>
                <div className="container centro">
                    {products.map((product) => (
                        <Home key={product._id} product={product} />
                    ))}
                </div>
            </Route>
            <Route exact path="/products/:id" component={Product} />
            <Route exact path="/products/:id/edit" component={ProductEdit} />
            <Redirect to="/products"/>
        </Switch>
    ) : <MessageBox>No content available</MessageBox>

    let content;

    if (status === 'idle') {
        content = null;
    } else if (status === 'loading') {
        content = (
            <LoadingBox variant="big"/>
        )
    } else if (status === 'succeeded') {
        content = main
    } else if (status === 'failed') {
        content = (
        <div className="container centro">
            <MessageBox variant="danger">{error.message}</MessageBox>
        </div>
        )
    }

    return content
}

export default AppProducts;
