import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userState } from "../../layers/SignIn/features/SignInSlice";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";

export default function Review(props) {

  const { id, createReview, showResults, reviewStatus, reviewError, reviewReset, type } = props

  const userInfo = useSelector(userState);
  const statusReview = useSelector(reviewStatus);
  const errorReviewCreate = useSelector(reviewError);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (statusReview === "succeeded") {
      window.alert("Calificado satisfactoriamente");
      setRating("");
      setComment("");
      dispatch(reviewReset());
      showResults(id)
    }
  }, [dispatch, id, props, reviewReset, showResults, statusReview]);

  useEffect(() => {
    return () => dispatch(reviewReset());
  }, [dispatch, reviewReset]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      createReview(id, rating, comment)
    } else {
      alert("Porfavor ingresa tu comentario y calificación");
    }
  };

  return userInfo ? (
    <form className="form" onSubmit={submitHandler}>
      <div>
        <h2>Califica el {type}</h2>
      </div>
      <div>
        <label htmlFor="rating">Calificación</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">Selecciona...</option>
          <option value="1">1- Pobre</option>
          <option value="2">2- Justo</option>
          <option value="3">3- Bueno</option>
          <option value="4">4- Muy bueno</option>
          <option value="5">5- Excelente</option>
        </select>
      </div>
      <div>
        <label htmlFor="comment">Comentario</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label />
        <button className="primary" type="submit">
          Enviar
        </button>
      </div>
      <div>
        {statusReview === "loading" && <LoadingBox />}
        {statusReview === "failed" && (
          <MessageBox variant="danger">{errorReviewCreate.message}</MessageBox>
        )}
      </div>
    </form>
  ) : (
    <MessageBox>
      <div>Porfavor <Link to="/registro" className="link">Regístrate</Link> para dar una calificación</div>
    </MessageBox>
  );
}
