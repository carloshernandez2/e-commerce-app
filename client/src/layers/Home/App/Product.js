import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../features/Rating';
import data from './data';

import "./Product.css";

export function Product({match}) {

  const product = data.products.find((x) => x._id === match.params.id);

  if (!product) {
    return <div> Product Not Found</div>;
  }

  return (
    <div>
      <Link to="/" className="link">Back to result</Link>
      <div className="container top">
        <div className="imagen">
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
                  <div>Price</div>
                  <div className="precio">${product.price}</div>
                </div>
              </li>
              <li>
                <div className="container">
                  <div>Status</div>
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
                <button className="primary block">Añadir al carrito</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}