import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';


import Rating from './Rating';
import { singleProductState } from "./ProductSlice";

import "./Product.css";
import MessageBox from '../../Carrito/features/MessageBox';

export function Product(props) {

  const { id } = props.match.params
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const product = useSelector(state => singleProductState(state, id))

  if (!product) {
    return  <div className="container centro">
              <MessageBox>No se pudo encontrar el producto</MessageBox>
            </div>;
  }

  const addToCartHandler = () => {
    const input = document.getElementById("qty");
    input.validity.valid? props.history.push(`/cart/${product._id}?qty=${qty}`) : setError(true);
  };

  return (
    <div>
      <Link to="/" className="link">De vuelta a productos</Link>
      <div className="container top">
        <div className="foco">
          <img className="grande" src={product.image} alt={product.image}></img>
        </div>
        <div className="contenido-producto">
          <ul>
            <li>
              <h1>{product.name}</h1>
            </li>
            <li>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </li>
            <li>Precio : ${product.price}</li>
            <li>
              Descripción:
              <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div className="contenido-producto">
          <div className="carta cuerpo-carta">
            <ul>
              <li>
                <div className="container">
                  <div>Precio</div>
                  <div className="precio">${product.price}</div>
                </div>
              </li>
              <li>
                <div className="container">
                  <div>Estado</div>
                  <div>
                    {product.countInStock > 0 ? (
                      <span className="exito">Disponible</span>
                    ) : (
                      <span className="error">No disponible</span>
                    )}
                  </div>
                </div>
              </li>
              <li>
                <div className="container">
                  {product.countInStock > 0 ? (
                    <>
                      <div># Unidades</div>
                      <div>
                        <span>{product.countInStock}</span>
                      </div>
                    </>
                  ) : null}
                </div>
              </li>
              {product.countInStock > 0 && (
                <>
                  <li>
                    <div className="container">
                      <div>Cantidad</div>
                      <div>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                          max={product.countInStock}
                          min="1"
                          id="qty"
                          required
                        />
                      </div>
                    </div>
                  </li>
                  {error && <li>
                    <MessageBox variant="danger">Verifica que la cantidad ingresada se encuentre disponible</MessageBox>
                  </li>}
                  <li>
                    <button
                      onClick={addToCartHandler}
                      className="primary block"
                    >
                      Añadir al carrito
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}