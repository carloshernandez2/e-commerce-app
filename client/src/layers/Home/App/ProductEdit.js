import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageBox from '../../Carrito/features/MessageBox';
import LoadingBox from '../../PlaceOrder/features/LoadingBox';
import { userState } from '../../SignIn/features/SignInSlice';
import { createdProductState, createProduct, productErrorCreate, productStatusCreate, resetCreatedProduct, resetProductState, singleProductState } from '../features/ProductSlice';

export default function ProductEdit(props) {

  const productId = props.match.params.id;
  const product = useSelector(state => singleProductState(state, productId));
  const createdProduct = useSelector(createdProductState)
  const statusCreate = useSelector(productStatusCreate)
  const errorCreate = useSelector(productErrorCreate)

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(product.image);
  const [category, setCategory] = useState(product.category);
  const [countInStock, setCountInStock] = useState(product.countInStock);
  const [brand, setBrand] = useState(product.brand);
  const [description, setDescription] = useState(product.description);

  const dispatch = useDispatch();

  useEffect(() => {
    if (statusCreate === 'succeeded') {
      dispatch(resetProductState());
      dispatch(resetCreatedProduct());
      props.history.push('/productlist');
    }
  }, [createdProduct, dispatch, props.history, statusCreate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProduct({
        _id: productId,
        name,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
      }));
  };

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  const userInfo = useSelector(userState);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);
    try {
        const requestOptions = {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${userInfo.token}`
            },
        body: bodyFormData
        };
        const response = await fetch('/api/uploads', requestOptions);
        const data = await response.text();
        if (!response.ok) {
            const error = new Error(data.message)
            error.name = response.status + '';
            throw error  
          } 
        setImage(data);
        setLoadingUpload(false);
    } catch (error) {
        setErrorUpload(error.message);
        setLoadingUpload(false);
    }
  };

  return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Editar producto {productId}</h1>
                </div>
                {statusCreate === 'loading' && <LoadingBox />}
                {statusCreate === 'failed' && <MessageBox variant="danger">{errorCreate.message}</MessageBox>}
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
                    <label htmlFor="image">Imagen</label>
                    <input
                        id="image"
                        type="text"
                        placeholder="Ingresa imagen"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="imageFile">Archivo imagen</label>
                    <input
                        type="file"
                        id="imageFile"
                        label="Escoge imagen"
                        onChange={uploadFileHandler}
                    ></input>
                    {loadingUpload && <LoadingBox />}
                    {errorUpload && (
                        <MessageBox variant="danger">{errorUpload}</MessageBox>
                    )}
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
  )
}