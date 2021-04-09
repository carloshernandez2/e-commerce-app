import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const savedState = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : {
      cartItems: 0,
      body: [],
      compra: {},
      paymentMethod: "",
      status: "idle",
      error: null,
    };

const initialState = {
  ...savedState,
  uploadName: "",
  uploadStatus: "idle",
  uploadError: null,
  message: {
    type: null,
    text: "",
  },
};

export const uploadImage = createAsyncThunk(
  "carrito/uploadImage",
  async (params, { getState }) => {
    const {
      user: { body },
    } = getState();

    const { bodyFormData, uploadId } = params;

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${body.token}`,
      },
      body: bodyFormData,
    };
    const response = await fetch(`/api/uploads/${uploadId}`, requestOptions);
    const data = await response.text();
    if (!response.ok) {
      const error = new Error("Falló al subir la imagen");
      error.name = response.status + "";
      throw error;
    }
    return data;
  }
);

const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    carritoUpdated: {
      reducer(state, action) {
        const cart = state.body;
        if (cart.length && cart[0].seller._id !== action.payload.seller._id) {
          state.message = {
            text: "Recuerda elegir productos de un solo vendedor por orden",
            type: "danger",
          };
          return;
        }
        let content = state.body.filter((product) => {
          return product.product !== action.payload.product;
        });
        content.push(action.payload);
        content = content.sort((a, b) => a.product - b.product);
        state.cartItems = content.length;
        state.body = content;
        localStorage.setItem("cartItems", JSON.stringify(state));
      },
      prepare(product, qty) {
        return {
          payload: {
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            product: product._id || product.product,
            seller: product.seller,
            qty,
          },
        };
      },
    },
    deleteItem(state, action) {
      state.body = state.body.filter((product) => {
        return product.product !== action.payload;
      });
      state.cartItems = state.body.length;
      localStorage.setItem("cartItems", JSON.stringify(state));
    },
    restoreCart(state, action) {
      localStorage.removeItem("cartItems");
      state.cartItems = 0;
      state.body = [];
      state.status = "idle";
      state.error = null;
      state.compra = {};
      state.paymentMethod = "";
    },
    guardarCompra(state, action) {
      state.compra = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(state));
    },
    metodoPago(state, action) {
      state.paymentMethod = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(state));
    },
    restoreUpload(state, action) {
      state.uploadStatus = "idle";
      state.uploadName = "";
      state.uploadError = null;
    },
    resetMessage(state, action) {
      state.message = { text: "", type: null };
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
  },
  extraReducers: {
    [uploadImage.pending]: (state, action) => {
      state.uploadStatus = "loading";
    },
    [uploadImage.fulfilled]: (state, action) => {
      state.uploadStatus = "succeeded";
      // Add any fetched posts to the array
      state.uploadName = action.payload;
    },
    [uploadImage.rejected]: (state, action) => {
      state.uploadStatus = "failed";
      state.uploadError = action.error;
    },
  },
});

export const carritoState = (state) => state.carrito.body;

export const singleCarritoState = (state, id) =>
  state.carrito.body.find((product) => product.product === id);

export const compraState = (state) => state.carrito.compra;

export const carritoItems = (state) => state.carrito.cartItems;

export const uploadState = (state) => state.carrito.uploadName;

export const uploadStatus = (state) => state.carrito.uploadStatus;

export const uploadError = (state) => state.carrito.uploadError;

export const paymentMethodState = (state) => state.carrito.paymentMethod;

export const messageState = (state) => state.carrito.message;

export const {
  carritoUpdated,
  deleteItem,
  restoreCart,
  guardarCompra,
  metodoPago,
  restoreUpload,
  resetMessage,
  setMessage,
} = carritoSlice.actions;

export default carritoSlice.reducer;
