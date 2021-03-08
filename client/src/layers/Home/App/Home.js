import React from 'react';
import { Link } from "react-router-dom";

import './Home.css';
import data from "./data";
import Rating from "../features/Rating"

function Home() {
  return (
    <div className="container centro">
      {data.products.map(product => {
        return (
        <div key={product._id} className="carta">
          <Link to={`/products/${product._id}`}><img src={product.image} alt={product.name} className="medio"/></Link>
          <div className="cuerpo-carta">
            <Link to={`/products/${product._id}`} className="link">
              <h2>{product.name}</h2>
            </Link>
            <Rating rating={product.rating} numReviews={product.numReviews}/>
            <div className="precio">${product.price}</div>
        </div>
      </div>
      )
      })}
    </div>
  );
}

export default Home;
