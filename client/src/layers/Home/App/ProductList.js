import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageBox from '../../Carrito/features/MessageBox';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import { createdProductState, createProduct, fetchProducts, productError, productErrorCreate, productState, productStatus, productStatusCreate, resetCreatedProduct, resetProductState } from '../features/ProductSlice';

export default function ProductList(props) {

  const products = useSelector(productState);
  const status = useSelector(productStatus);
  const error = useSelector(productError);
  const createdProduct = useSelector(createdProductState)
  const statusCreate = useSelector(productStatusCreate)
  const errorCreate = useSelector(productErrorCreate)

  const dispatch = useDispatch();

  useEffect(() => {
    if (statusCreate === 'succeeded') {
      dispatch(resetProductState());
      props.history.push(`/products/${createdProduct._id}/edit`);
    }
  }, [createdProduct, dispatch, props.history, statusCreate]);

  useEffect(() => {
    dispatch(fetchProducts());
    return () => {
      dispatch(resetCreatedProduct());
    }
}, [dispatch])

  const deleteHandler = () => {
    /// TODO: dispatch delete action
  };

  const createHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <div className="container cuerpo-carta">
        <h1>Productos</h1>
        <button type="button" className="primary" onClick={createHandler}>
          Crear producto
        </button>
      </div>
      {statusCreate === 'loading' && <LoadingBox></LoadingBox>}
      {statusCreate === 'failed' && <MessageBox variant="danger">{errorCreate.message}</MessageBox>}
      {status === 'loading' ? (
        <LoadingBox variant="big"/>
      ) : status === 'failed' ? (
        <MessageBox variant="danger">{error.message}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>PRECIO</th>
              <th>CATEGORIA</th>
              <th>MARCA</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() =>
                      props.history.push(`/products/${product._id}/edit`)
                    }
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(product)}
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