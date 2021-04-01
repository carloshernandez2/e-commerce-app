import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  body: [],
  status: 'idle',
  error: null,
  errorCreate: null,
  statusCreate: 'idle',
  createdProduct : null,
  errorDelete: null,
  statusDelete: 'idle',
  deletedProduct : null,
  successAction: ''
}

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (params) => {
  const { seller } = params
  let url = `/api/products?seller=${seller || ''}`
  const response = await fetch(url);
  const data = await response.json();
  if(!response.ok) throw data.error;
  return data;
})

export const createProduct = createAsyncThunk('product/createProduct', async (params, {getState}) => {

  const {
      user: { body },
  } = getState();

  const { _id, name, price, image, category, brand, countInStock, description } = params

  const url = _id ? `/api/products/${_id}` : "/api/products";
  const method = _id ? 'PUT' : 'POST';
  const headers = { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${body.token}`
                  }
  const main = _id ? { name, price, image, category, brand, countInStock, description } : {}

  const requestOptions = {
    method,
    headers,
    body: JSON.stringify(main)
  };

  const response = await fetch(url, requestOptions);
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message)
    error.name = response.status + '';
    throw error  
  } 
  return data;
})

export const deleteProduct = createAsyncThunk('product/deleteProduct', async (params, {getState}) => {

  const {
      user: { body },
  } = getState();

  const { _id } = params

  const url = `/api/products/${_id}`;
  const method = 'DELETE';
  const headers = { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${body.token}`
                  }

  const requestOptions = {
    method,
    headers,
    body: JSON.stringify({})
  };

  const response = await fetch(url, requestOptions);
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message)
    error.name = response.status + '';
    throw error  
  } 
  return data;
})

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetCreatedProduct(state, action) {
      state.statusCreate = 'idle';
      state.errorCreate = null;
      state.createdProduct = {};
    },
    resetDeletedProduct(state, action) {
      state.statusDelete = 'idle';
      state.errorDelete = null;
      state.deletedProduct = {};
    },
    resetProductState(state, action) {
      state.status = 'idle';
      state.error = null;
      state.body = [];
    },
    setSuccessAction(state, action) {
      state.successAction = action.payload;
    },
    resetSuccessAction(state, action) {
      state.successAction = ''
    },
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
      state.error = action.error
    },
    [createProduct.pending]: (state, action) => {
      state.statusCreate = 'loading'
    },
    [createProduct.fulfilled]: (state, action) => {
      state.statusCreate = 'succeeded'
      // Add any fetched posts to the array
      state.createdProduct = action.payload
    },
    [createProduct.rejected]: (state, action) => {
      state.statusCreate = 'failed'
      state.errorCreate = action.error
    },
    [deleteProduct.pending]: (state, action) => {
      state.statusDelete = 'loading'
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.statusDelete = 'succeeded'
      // Add any fetched posts to the array
      state.deletedProduct = action.payload
    },
    [deleteProduct.rejected]: (state, action) => {
      state.statusDelete = 'failed'
      state.errorDelete = action.error
    }
  }
})

export const productState = state => state.product.body

export const productStatus = state => state.product.status;

export const productError = state => state.product.error;

export const createdProductState = state => state.product.createdProduct

export const productStatusCreate = state => state.product.statusCreate;

export const productErrorCreate = state => state.product.errorCreate;

export const deletedProductState = state => state.product.deletedProduct

export const productStatusDelete = state => state.product.statusDelete;

export const productErrorDelete = state => state.product.errorDelete;

export const singleProductState = (state, id) => state.product.body.find((product) => product._id === id)

export const successActionState = state => state.product.successAction

export const { resetCreatedProduct, resetProductState, resetDeletedProduct, resetSuccessAction, setSuccessAction } = productSlice.actions

export default productSlice.reducer