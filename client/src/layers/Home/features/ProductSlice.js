import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  queryString: {
    string: ''
  },
  body: [],
  status: 'idle',
  error: null
}

export const fetchProducts = createAsyncThunk('product/fetchProducts', async () => {
  let url = "/api/products";
  const response = await fetch(url);
  const jsonResponse = await response.json();
  const data = jsonResponse.products
  if(!data.length) throw new Error('no products available');
  return data;
})

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    queryUpdated(state, action) {
      state.queryString.string = action.payload
    }
  },
  extraReducers: {
    [fetchProducts.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.body = action.payload
    },
    [fetchProducts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
})

export const productState = state => state.product.body

export const productStatus = state => state.product.status;

export const productError = state => state.product.error;

export const singleProductState = (state, id) => state.product.body.find((product) => product._id === id)

export const { queryUpdated } = productSlice.actions

export default productSlice.reducer