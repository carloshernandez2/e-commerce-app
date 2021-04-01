import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageBox from '../../Carrito/features/MessageBox';
import Home from '../../Home/features/Home';
import { fetchProducts, productError, productState, productStatus, resetProductState } from '../../Home/features/ProductSlice';
import Rating from '../../Home/features/Rating';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import { getUsers, restoreUsers, usersError, usersState, usersStatus } from '../features/SignInSlice';

export default function Seller(props) {
  
  const sellerId = props.match.params.id;
  const [user] = useSelector(usersState)
  const status = useSelector(usersStatus)
  const error = useSelector(usersError)
  const productsStatus = useSelector(productStatus)
  const errorProducts = useSelector(productError)
  const products = useSelector(productState)

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getUsers({ userId: sellerId }));
    dispatch(fetchProducts({ seller: sellerId }));
    return () => {
      dispatch(restoreUsers())
      dispatch(resetProductState())
    }
  }, [dispatch, sellerId]);

  return (
    <div className="container top">
      <div className="contenido-producto">
        {status === 'idle' ? (
          null
        ) : status === 'loading' ? (
          <LoadingBox/>
        ) : status === 'failed' ? (
          <MessageBox variant="danger">{error.message}</MessageBox>
        ) : (
          <ul className="carta cuerpo-carta">
            <li>
              <div className="container start">
                <div className="p-1">
                  <img
                    className="pequeño"
                    src={user.seller.logo}
                    alt={user.seller.name}
                    onError={(e) => e.target.src = '/images/fallback.jpg'}
                  ></img>
                </div>
                <div className="p-1">
                  <h1>{user.seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating
                rating={user.seller.rating}
                numReviews={user.seller.numReviews}
              ></Rating>
            </li>
            <li>
              <a href={`mailto:${user.email}`}>Contacto vendedor</a>
            </li>
            <li>{user.seller.description}</li>
          </ul>
        )}
      </div>
      <div className="extrafoco">
        {productsStatus === 'idle' ? (
          null
        ) : productsStatus === 'loading' ? ( 
          <LoadingBox variant="big"/>
        ) : productsStatus === 'failed' ? (
          <MessageBox variant="danger">{errorProducts.message}</MessageBox>
        ) : (
          <>
            {products.length === 0 && <MessageBox>Sin productos a la venta</MessageBox>}
            <div className="container centro">
              {products.map((product) => (
                <Home key={product._id} product={product}></Home>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}