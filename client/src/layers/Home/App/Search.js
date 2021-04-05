import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProducts, productError, productState, productStatus, resetProductState } from '../features/ProductSlice';
import MessageBox from "../../Carrito/features/MessageBox";
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import Home from '../features/Home';

export default function Search() {
  const { name = 'all' } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(productState);
  const status = useSelector(productStatus);
  const error = useSelector(productError);

  useEffect(() => {
    dispatch(fetchProducts({ name: name !== 'all' ? name : '' }));
    return () => dispatch(resetProductState())
  }, [dispatch, name]);

  return status === 'idle' ? (
    null
  ) : status === 'loading' ? (
    <LoadingBox />
  ) : status === 'failed' ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="container">
          <div>{products.length} Resultados</div>
      </div>
      <div className="container top">
        <div className="contenido-producto">
          <h3>Departmento</h3>
          <ul>
            <li>Categoría 1</li>
          </ul>
        </div>
        <div className="extrafoco">
          {products.length === 0 && (
            <MessageBox>No se encontraron productos</MessageBox>
          )}
          <div className="container centro">
            {products.map((product) => (
              <Home key={product._id} product={product}></Home>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}