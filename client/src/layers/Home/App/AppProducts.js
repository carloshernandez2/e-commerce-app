import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";

import Home from "../features/Home";
import { Product } from "../features/Product"
import MessageBox from "../../Carrito/features/MessageBox";
import { fetchProducts, productState } from "../features/ProductSlice";
import { productStatus } from "../features/ProductSlice";
import { productError } from "../features/ProductSlice";

import "./AppProducts.css";
import { resetOrder } from '../../PlaceOrder/features/OrderSlice';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';

function AppProducts() {

    let { path } = useRouteMatch();

    const products = useSelector(productState);
    const status = useSelector(productStatus);
    const error = useSelector(productError);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts())
        dispatch(resetOrder([]))
    }, [dispatch])

    let content;

    if (status === 'loading') {
        content = (
            <LoadingBox variant="big"/>
        )
    } else if (status === 'succeeded') {
        content = (
            <Switch>
                <Route exact path={`${path}`}>
                    <div className="container centro">
                        {products.length? products.map((product) => (
                            <Home key={product._id} product={product} />
                        )) : <MessageBox>{error.message}</MessageBox>}
                    </div>
                </Route>
                <Route exact path="/products/:id" component={Product} />
                <Redirect to="/products"/>
            </Switch>
        )
    } else if (status === 'failed') {
        content = (
        <div className="container centro">
            <MessageBox variant="danger">{error.message}</MessageBox>
        </div>
        )
    }

    return (
        <React.Fragment>
            {content}
        </React.Fragment>
    );
}

export default AppProducts;
