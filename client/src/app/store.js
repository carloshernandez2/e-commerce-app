import { configureStore } from '@reduxjs/toolkit';
import productReducer from "../layers/Home/features/ProductSlice";
import carritoReducer from "../layers/Carrito/features/CarritoSlice";
import userReducer from "../layers/SignIn/features/SignInSlice";

export default configureStore({
  reducer: {
    product: productReducer,
    carrito: carritoReducer,
    user: userReducer
  },
});
