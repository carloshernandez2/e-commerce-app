import React, { useState } from "react";

import "./css/SearchBox.css";

export default function SearchBox(props) {
  const [name, setName] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    props.history.push(`/search/name/${name}`);
    setName('')
  };

  return (
    <form className="search" onSubmit={submitHandler}>
      <div className="container">
        <input
          type="text"
          name="q"
          id="q"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <button className="primary" type="submit">
          <i className="fa fa-search"></i>
        </button>
      </div>
    </form>
  );
}
