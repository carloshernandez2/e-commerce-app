import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { categoriesError, categoriesState, categoriesStatus, fetchProducts, productError, productState, productStatus, resetProductState } from '../features/ProductSlice';
import MessageBox from "../../Carrito/features/MessageBox";
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import Home from '../features/Home';

export default function Search() {
  const { name = 'all', category = 'all' } = useParams();

  const dispatch = useDispatch();

  const products = useSelector(productState);
  const status = useSelector(productStatus);
  const error = useSelector(productError);
  const errorCategories = useSelector(categoriesError);
  const categories = useSelector(categoriesState);
  const statusCategories = useSelector(categoriesStatus);

  useEffect(() => {
    dispatch(
      fetchProducts({
        name: name !== 'all' ? name : '',
        category: category !== 'all' ? category : '',
      })
    );
    return () => dispatch(resetProductState())
  }, [category, dispatch, name]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    return `/search/category/${filterCategory}/name/${filterName}`;
  };

  return status === 'idle' ? (
    null
  ) : status === 'loading' ? (
    <LoadingBox variant="big"/>
  ) : status === 'failed' ? (
    <MessageBox variant="danger">{error.message}</MessageBox>
  ) : (
    <div>
      <div className="container top">
        <div className="contenido-producto">
          <div className="carta cuerpo-carta">
            <div>{products.length} Resultados</div>
            <h3>Departmento</h3>
            {statusCategories === 'idle' ? (
              null
            ) : statusCategories === 'loading' ? (
              <LoadingBox />
            ) : statusCategories === 'failed' ? (
              <MessageBox variant="danger">{errorCategories.message}</MessageBox>
            ) : (
              <ul>
                {categories.map((c) => (
                  <li key={c}>
                    <Link 
                      className={`${c === category ? 'active' : ''} link`}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
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