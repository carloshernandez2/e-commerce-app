import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Rating from "../../../app/components/Rating";
import {
  createReviewProduct,
  fetchProducts,
  productReviewError,
  productReviewReset,
  productReviewStatus,
  singleProductState,
} from "./ProductSlice";

import "./Product.css";
import MessageBox from "../../../app/components/MessageBox";
import { singleCarritoState } from "../../Carrito/features/CarritoSlice";
import Review from "../../../app/components/Review";

export function Product(props) {
  const { id } = props.match.params;

  const cartItem = useSelector((state) => singleCarritoState(state, id));
  const product = useSelector((state) => singleProductState(state, id));

  const [qty, setQty] = useState((cartItem && cartItem.qty) || 1);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const addToCartHandler = () => {
    const input = document.getElementById("qty");
    input.validity.valid
      ? props.history.push(`/cart/${product._id}?qty=${qty}`)
      : setError(true);
  };

  const createReview = (id, rating, comment) => {
    dispatch(createReviewProduct({ productId: id, review: { rating, comment } }));
  }

  const showResults = () => {
    dispatch(fetchProducts({}));
  }

  return !product ? (
    <div className="container centro">
      <MessageBox>No se pudo encontrar el producto</MessageBox>
    </div>
  ) : (
    <div>
      <Link to="/" className="link">
        De vuelta a productos
      </Link>
      <div className="container top">
        <div className="foco">
          <img
            className="grande"
            src={`${product.image}`}
            alt={product.image}
            onError={(e) => (e.target.src = "/images/fallback.jpg")}
          ></img>
        </div>
        <div className="contenido-producto">
          <div className="carta cuerpo-carta">
            <ul>
              <li>
                Vendedor{" "}
                <h2>
                  <Link to={`/seller/${product.seller._id}`} className="link">
                    {product.seller.seller.name}
                  </Link>
                </h2>
                <Rating
                  rating={product.seller.seller.rating}
                  numReviews={product.seller.seller.numReviews}
                ></Rating>
              </li>
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
                  {error && (
                    <li>
                      <MessageBox variant="danger">
                        Verifica que la cantidad ingresada se encuentre
                        disponible
                      </MessageBox>
                    </li>
                  )}
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
      <div>
        <h2 id="reviews">Calificaciones</h2>
        {product.reviews.length === 0 && (
          <MessageBox>no hay calificación</MessageBox>
        )}
        <ul className="container centro">
          {product.reviews.map((review) => (
            <li key={review._id} className="carta cuerpo-carta">
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" " />
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
        <ul>
          <li>
            <Review 
            createReview={createReview} 
            showResults={showResults} 
            id={id}
            reviewStatus={productReviewStatus}
            reviewError={productReviewError}
            reviewReset={productReviewReset}
            type="Producto"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
