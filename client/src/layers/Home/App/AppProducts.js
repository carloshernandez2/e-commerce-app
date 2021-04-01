import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";

import Home from "../features/Home";
import { Product } from "../features/Product"
import MessageBox from "../../Carrito/features/MessageBox";
import { fetchProducts, productState, successActionState, resetSuccessAction, resetProductState } from "../features/ProductSlice";
import { productStatus } from "../features/ProductSlice";
import { productError } from "../features/ProductSlice";

import "./AppProducts.css";
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import ProductEdit from './ProductEdit';

function AppProducts() {

    let { path } = useRouteMatch();

    const products = useSelector(productState);
    const status = useSelector(productStatus);
    const error = useSelector(productError);
    const successAction = useSelector(successActionState);

    const dispatch = useDispatch();

    const closeAlert = () => {
        dispatch(resetSuccessAction())
    }

    useEffect(() => {
        dispatch(fetchProducts({}))
        return () => {
            dispatch(resetSuccessAction())
            dispatch(resetProductState())
        }
    }, [dispatch])

    let content;

    if (status === 'idle') {
        content = null;
    } else if (status === 'loading') {
        content = (
            <LoadingBox variant="big"/>
        )
    } else if (status === 'succeeded') {
        content = (
            <Switch>
                <Route exact path={`${path}`}>
                    {successAction && <MessageBox variant="success" close={closeAlert}>{successAction}</MessageBox>}
                    <div className="container centro">
                        {products.length? products.map((product) => (
                            <Home key={product._id} product={product} />
                        )) : <MessageBox>{error.message}</MessageBox>}
                    </div>
                </Route>
                <Route exact path="/products/:id" component={Product} />
                <Route exact path="/products/:id/edit" component={ProductEdit} />
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

    return content
}

export default AppProducts;
