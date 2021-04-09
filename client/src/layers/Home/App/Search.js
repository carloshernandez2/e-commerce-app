import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  categoriesError,
  categoriesState,
  categoriesStatus,
  fetchProducts,
  productError,
  productState,
  productStatus,
  resetProductState,
} from "../features/ProductSlice";
import MessageBox from "../../Carrito/features/MessageBox";
import LoadingBox from "../../PlaceOrder/features/LoadingBox";
import Home from "../features/Home";
import Rating from "../features/Rating";
import { prices, ratings } from "../features/utils";

export default function Search(props) {
  const {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "newest",
  } = useParams();

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
        name: name !== "all" ? name : "",
        category: category !== "all" ? category : "",
        min,
        max,
        rating,
        order,
      })
    );
    return () => dispatch(resetProductState());
  }, [category, dispatch, max, min, name, order, rating]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
  };

  return status === "idle" ? null : status === "loading" ? (
    <LoadingBox variant="big" />
  ) : status === "failed" ? (
    <MessageBox variant="danger">{error.message}</MessageBox>
  ) : (
    <div>
      <div className="container top">
        <div className="contenido-producto">
          <div>
            Sort by{" "}
            <select
              value={order}
              onChange={(e) => {
                props.history.push(getFilterUrl({ order: e.target.value }));
              }}
            >
              <option value="newest">Mas reciente</option>
              <option value="lowest">Precio: bajo a alto</option>
              <option value="highest">Pricio: alto a bajo</option>
              <option value="toprated">Calificación</option>
            </select>
          </div>
          {statusCategories === "idle" ? null : statusCategories ===
            "loading" ? (
            <LoadingBox />
          ) : statusCategories === "failed" ? (
            <MessageBox variant="danger">{errorCategories.message}</MessageBox>
          ) : (
            <div className="carta cuerpo-carta">
              <div>{products.length} Resultados</div>
              <h3>Departamento</h3>
              <ul>
                <li>
                  <Link
                    className={"all" === category ? "active link" : "link"}
                    to={getFilterUrl({ category: "all" })}
                  >
                    Any
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      className={c === category ? "active link" : "link"}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
              <div>
                <h3>Price</h3>
                <ul>
                  {prices.map((p) => (
                    <li key={p.name}>
                      <Link
                        to={getFilterUrl({ min: p.min, max: p.max })}
                        className={
                          `${p.min}-${p.max}` === `${min}-${max}`
                            ? "active link"
                            : "link"
                        }
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Avg. Customer Review</h3>
                <ul>
                  {ratings.map((r) => (
                    <li key={r.name}>
                      <Link
                        to={getFilterUrl({ rating: r.rating })}
                        className={
                          `${r.rating}` === `${rating}` ? "active link" : "link"
                        }
                      >
                        <Rating caption={" & up"} rating={r.rating} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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
