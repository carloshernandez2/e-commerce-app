import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../layers/Home/features/ProductSlice";
import carritoReducer from "../layers/Carrito/features/CarritoSlice";
import userReducer from "../layers/SignIn/features/SignInSlice";
import orderReducer from "../layers/PlaceOrder/features/OrderSlice";

export default configureStore({
  reducer: {
    product: productReducer,
    carrito: carritoReducer,
    user: userReducer,
    order: orderReducer,
  },
});
