import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBox from "../../../app/components/MessageBox";
import LoadingBox from "../../../app/components/LoadingBox";
import { userState } from "../../SignIn/features/SignInSlice";
import {
  createdProductState,
  createProduct,
  resetDeletedProduct,
  deleteProduct,
  fetchProducts,
  productError,
  productErrorCreate,
  productErrorDelete,
  productState,
  productStatus,
  productStatusCreate,
  productStatusDelete,
  resetCreatedProduct,
  resetProductState,
  pagesState,
  pageState,
} from "../features/ProductSlice";
import { useParams } from "react-router";
import Pagination from "../../../app/components/Pagination";

export default function ProductList(props) {
  const { pageNumber = 1 } = useParams();

  const user = useSelector(userState);
  const products = useSelector(productState);
  const status = useSelector(productStatus);
  const error = useSelector(productError);
  const createdProduct = useSelector(createdProductState);
  const statusCreate = useSelector(productStatusCreate);
  const errorCreate = useSelector(productErrorCreate);
  const statusDelete = useSelector(productStatusDelete);
  const errorDelete = useSelector(productErrorDelete);
  const pages = useSelector(pagesState);
  const page = useSelector(pageState);

  const sellerMode = props.match.path.indexOf("/seller") >= 0;

  const dispatch = useDispatch();

  useEffect(() => {
    if (statusCreate === "succeeded") {
      dispatch(resetProductState());
      props.history.push(`/products/${createdProduct._id}/edit`);
    }
    if (statusDelete === "succeeded") {
      dispatch(resetDeletedProduct());
      dispatch(
        fetchProducts({ seller: sellerMode ? user._id : "", pageNumber })
      );
    }
  }, [
    createdProduct,
    dispatch,
    pageNumber,
    props.history,
    sellerMode,
    statusCreate,
    statusDelete,
    user,
  ]);

  useEffect(() => {
    dispatch(fetchProducts({ seller: sellerMode ? user._id : "", pageNumber }));
    return () => {
      dispatch(resetCreatedProduct());
    };
  }, [dispatch, sellerMode, user, pageNumber]);

  const deleteHandler = (product) => {
    if (window.confirm("¿Estás seguro de que quieres borrarlo?")) {
      dispatch(deleteProduct({ _id: product._id }));
    }
  };

  const createHandler = () => {
    dispatch(createProduct({}));
  };

  const getFilterUrl = (filter) => {
    return `/productlist/pageNumber/${filter.page}`;
  };

  return status === "loading" ? (
    <LoadingBox variant="big" />
  ) : status === "failed" ? (
    <MessageBox variant="danger">{error.message}</MessageBox>
  ) : status === "succeeded" && !products.length ? (
    <div>
      <div className="container cuerpo-carta">
        <h1>Productos</h1>
        <button type="button" className="primary" onClick={createHandler}>
          Crear producto
        </button>
      </div>
      <MessageBox>No se encontraron productos</MessageBox>
    </div>
  ) : (
    <div>
      <div className="container cuerpo-carta">
        <h1>Productos</h1>
        <button type="button" className="primary" onClick={createHandler}>
          Crear producto
        </button>
      </div>
      {statusCreate === "loading" && <LoadingBox></LoadingBox>}
      {statusCreate === "failed" && (
        <MessageBox variant="danger">{errorCreate.message}</MessageBox>
      )}
      {statusDelete === "loading" && <LoadingBox></LoadingBox>}
      {statusDelete === "failed" && (
        <MessageBox variant="danger">{errorDelete.message}</MessageBox>
      )}
      <>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>PRECIO</th>
              <th>CATEGORÍA</th>
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
        {user.isAdmin && <Pagination pages={pages} page={page} getFilterUrl={getFilterUrl} />}
      </>
    </div>
  );
}
