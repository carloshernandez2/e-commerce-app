import { createSlice } from '@reduxjs/toolkit'

const initialState =  localStorage.getItem('cartItems')
                      ? JSON.parse(localStorage.getItem('cartItems'))
                      :  {cartItems: 0,
                          body: [],
                          compra: {},
                          paymentMethod: '',
                          status: 'idle',
                          error: null}

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
  }
})

export const carritoState = state => state.carrito.body

export const singleCarritoState = (state, id) => state.carrito.body.find((product) => product.product === id)

export const compraState = state => state.carrito.compra

export const carritoItems = state => state.carrito.cartItems 

export const paymentMethodState = state => state.carrito.paymentMethod 

export const { carritoUpdated, deleteItem, restoreCart, guardarCompra, metodoPago } = carritoSlice.actions

export default carritoSlice.reducer