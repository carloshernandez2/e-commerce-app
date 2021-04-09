import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadError,
  restoreUpload,
  uploadImage,
  uploadStatus,
} from "../../Carrito/features/CarritoSlice";
import MessageBox from "../../Carrito/features/MessageBox";
import LoadingBox from "../../PlaceOrder/features/LoadingBox";
import {
  createdProductState,
  createProduct,
  productErrorCreate,
  productStatusCreate,
  resetCreatedProduct,
  resetProductState,
  singleProductState,
} from "../features/ProductSlice";

export default function ProductEdit(props) {
  const productId = props.match.params.id;
  const product = useSelector((state) => singleProductState(state, productId));
  const createdProduct = useSelector(createdProductState);
  const statusCreate = useSelector(productStatusCreate);
  const errorCreate = useSelector(productErrorCreate);
  const status = useSelector(uploadStatus);
  const error = useSelector(uploadError);

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);
  const [countInStock, setCountInStock] = useState(product.countInStock);
  const [brand, setBrand] = useState(product.brand);
  const [description, setDescription] = useState(product.description);

  const dispatch = useDispatch();

  useEffect(() => {
    if (statusCreate === "succeeded") {
      dispatch(resetProductState());
      dispatch(resetCreatedProduct());
      props.history.push("/productlist");
    }
  }, [createdProduct, dispatch, props.history, status, statusCreate]);

  useEffect(() => {
    return () => dispatch(restoreUpload());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        _id: productId,
        name,
        price,
        category,
        brand,
        countInStock,
        description,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    dispatch(uploadImage({ bodyFormData, uploadId: productId }));
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Editar producto {productId}</h1>
        </div>
        {statusCreate === "loading" && <LoadingBox />}
        {statusCreate === "failed" && (
          <MessageBox variant="danger">{errorCreate.message}</MessageBox>
        )}
        <div>
          <h2>Cambiar imagen</h2>
        </div>
        <div>
          <label htmlFor="imageFile">Archivo imagen</label>
          <input
            type="file"
            id="imageFile"
            label="Escoge imagen"
            onChange={uploadFileHandler}
          ></input>
          {status === "loading" && <LoadingBox />}
          {status === "failed" && (
            <MessageBox variant="danger">{error.message}</MessageBox>
          )}
          {status === "succeeded" && (
            <MessageBox variant="success">
              Archivo subido correctamente
            </MessageBox>
          )}
        </div>
        <div>
          <h2>Actualizar datos</h2>
        </div>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            placeholder="Ingresa nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength="20"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="price">Precio</label>
          <input
            id="price"
            type="text"
            placeholder="Ingresa precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="category">Categoría</label>
          <input
            id="category"
            type="text"
            placeholder="Ingresa categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="brand">Marca</label>
          <input
            id="brand"
            type="text"
            placeholder="Ingresa marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="countInStock">Stock disponible</label>
          <input
            id="countInStock"
            type="text"
            placeholder="Ingresa cantidad disponible"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            rows="3"
            type="text"
            placeholder="Ingresa descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <button className="primary" type="submit">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}
