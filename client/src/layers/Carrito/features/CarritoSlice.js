import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState =  localStorage.getItem('cartItems')
                      ? JSON.parse(localStorage.getItem('cartItems'))
                      :  {cartItems: 0,
                          body: [],
                          compra: {},
                          paymentMethod: '',
                          status: 'idle',
                          error: null}


export const fetchCarrito = createAsyncThunk('carrito/fetchCarrito', async () => {
  let url = "/api/products";
  const response = await fetch(url);
  const jsonResponse = await response.json();
  const data = jsonResponse.products
  if(!data.length) throw new Error('no products available');
  return data;
})

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    carritoUpdated: {
        reducer(state, action) {
            let content = state.body.filter(product => {
                return product.product !== action.payload.product;
            })
            content.push(action.payload);
            content = content.sort((a, b) => a.product - b.product);
            state.cartItems = content.length;
            state.body = content
            localStorage.setItem('cartItems', JSON.stringify(state));
        },
        prepare(product, qty) {
            return {
                payload: {
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    countInStock: product.countInStock,
                    product: product._id || product.product,
                    qty,
                }
            }
        }
    },
    deleteItem(state, action) {
      state.body = state.body.filter(product => {
        return product.product !== action.payload;
      })
      state.cartItems = state.body.length;
      localStorage.setItem('cartItems', JSON.stringify(state));
    },
    restoreCart(state, action) {
      localStorage.removeItem('cartItems');
      state.cartItems = 0
      state.body = []
      state.status = 'idle'
      state.error = null
      state.compra = {}
      state.paymentMethod = ''
    },
    guardarCompra(state, action) {
      state.compra = action.payload
      localStorage.setItem('cartItems', JSON.stringify(state));
    },
    metodoPago(state, action) {
      state.paymentMethod = action.payload
      localStorage.setItem('cartItems', JSON.stringify(state));
    }
  },
  extraReducers: {
    [fetchCarrito.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchCarrito.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.body = action.payload
    },
    [fetchCarrito.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
})

export const carritoState = state => state.carrito.body

export const singleCarritoState = (state, id) => state.carrito.body.find((product) => product.product === id)

export const compraState = state => state.carrito.compra

export const carritoItems = state => state.carrito.cartItems 

export const paymentMethodState = state => state.carrito.paymentMethod 

export const productStatus = state => state.product.status;

export const productError = state => state.product.error;

export const singleProductState = (state, id) => state.product.body.find((product) => product._id === id)

export const { carritoUpdated, deleteItem, restoreCart, guardarCompra, metodoPago } = carritoSlice.actions

export default carritoSlice.reducer