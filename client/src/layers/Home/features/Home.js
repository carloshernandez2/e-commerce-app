import React from 'react';
import { Link } from "react-router-dom";

import './Home.css';
import Rating from "./Rating"

function Home(props) {

  const {product} = props;

  return (
    <div key={product._id} className="carta">
      <Link to={`/products/${product._id}`}>
        <img 
        src={`${product.image}?v=${Date.now()}`} 
        alt={product.name} 
        className="medio"
        onError={(e) => e.target.src = '/images/fallback.jpg'}
        />
      </Link>
      <div className="cuerpo-carta">
        <Link to={`/products/${product._id}`} className="link">
          <h2>{product.name}</h2>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews}/>
        <div className="container">
          <div className="precio">${product.price}</div>
          <div>
            <Link to={`/seller/${product.seller._id}`} className="link">
              {product.seller.seller.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
      )
}

export default Home;
