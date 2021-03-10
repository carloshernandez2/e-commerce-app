import { configureStore } from '@reduxjs/toolkit';
import productReducer from "../layers/Home/features/ProductSlice";
import carritoReducer from "../layers/Carrito/features/CarritoSlice";

export default configureStore({
  reducer: {
    product: productReducer,
    carrito: carritoReducer
  },
});
