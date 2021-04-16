import React from "react";
import { Link } from "react-router-dom";

export default function Pagination(props) {
  const { pages, page, getFilterUrl } = props;

  const arrayToShow =
    pages < 7
      ? [...Array(pages).keys()].map((x) => {
          return x + 1;
        })
      : page === 1
      ? [...Array(pages).keys(), pages]
          .map((x) => {
            if (x === pages) {
              return ">";
            } else if (x + 1 < 3 || x + 1 > pages - 2) {
              return x + 1;
            }
            return false;
          })
          .filter((x) => x)
      : page === pages
      ? [...Array(pages).keys(), pages]
          .map((x) => {
            if (x === 0) {
              return "<";
            } else if (x < 3 || x > pages - 2) {
              return x;
            }
            return false;
          })
          .filter((x) => x)
      : [...Array(pages).keys(), pages, pages + 1]
          .map((x) => {
            if (x === 0) {
              return "<";
            } else if (x === pages + 1) {
              return ">";
            } else if (x === page) {
              return x;
            } else if (x < 3 || x > pages - 2) {
              return x;
            }
            return false;
          })
          .filter((x) => x);

  return (
    <div className="container centro pagination">
      {arrayToShow.map((x) => {
        const value = x === '<'? page - 1 : x === '>' ? page + 1 : x 
        return (
        <Link
          className={x === page ? "active" : ""}
          key={ x }
          to={getFilterUrl({ page: value })}
        >
          { x }
        </Link>
        )
      })}
    </div>
  );
}
