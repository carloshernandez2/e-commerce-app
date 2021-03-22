import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  body: [],
  status: ['idle', 'idle'],
  error: {renderError: null, updateError: null},
  orders: [],
  ordersStatus: 'idle',
  ordersError: null
}

export const fetchOrder = createAsyncThunk('order/fetchOrder', async (params, {getState}) => {
    const {
        user: { body },
    } = getState();

    const { newOrder, orderId, order, paymentResult } = params
    const url = newOrder? '/api/orders' : orderId? `/api/orders/${orderId}` : `/api/orders/${order._id}/pay`
    const method = newOrder? 'POST' : orderId? 'GET' : 'PUT'
    const container = newOrder || paymentResult
    const cuerpo = orderId ? undefined : JSON.stringify({ 
        container
    })

    const requestOptions = {
      method: method,
      headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${body.token}`
        },
      body: cuerpo
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message)
      error.name = response.status + '';
      error.stack = data.method
      throw error
    }
    return data;
})

export const listOrderMine = createAsyncThunk('order/listOrderMine', async (params, {getState}) => {
    const {
        user: { body },
    } = getState();

    if (!body) return [];

    const requestOptions = {
      method: 'GET',
      headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${body.token}`
        }
    };

    const response = await fetch('/api/orders/mine', requestOptions);
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message)
      error.name = response.status + '';
      throw error
    }
    return data;
})

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state, action) {
        state.body = action.payload
        state.status = ['idle', 'idle']
        state.error = {renderError: null, updateError: null}
    }
  },
  extraReducers: {
    [fetchOrder.pending]: (state, action) => {
      state.status = ['loading', 'loading']
    },
    [fetchOrder.fulfilled]: (state, action) => {
      const status = action.payload._id? ['idle', 'succeeded'] : ['succeeded', 'idle']
      state.status = status
      // Add any fetched posts to the array
      state.body = action.payload
    },
    [fetchOrder.rejected]: (state, action) => {
      state.status = ['failed', 'failed']
      const renderError = action.error.stack === 'PUT'? null : action.error
      const updateError = action.error.stack === 'PUT'? action.error : null
      state.error = {renderError, updateError}
    },
    [listOrderMine.pending]: (state, action) => {
      state.ordersStatus = 'loading'
    },
    [listOrderMine.fulfilled]: (state, action) => {
      state.ordersStatus = 'succeeded'
      // Add any fetched posts to the array
      state.orders = action.payload
    },
    [listOrderMine.rejected]: (state, action) => {
      state.ordersStatus = 'failed'
      state.ordersError = action.error
    }
  }
})

export const orderState = state => state.order.body

export const ordersState = state => state.order.orders

export const orderStatus = state => state.order.status;

export const ordersStatus = state => state.order.ordersStatus;

export const orderError = state => state.order.error;

export const ordersError = state => state.order.ordersError;

export const singleOrderState = (state, id) => state.order.body.find((product) => product._id === id)

export const { resetOrder } = orderSlice.actions

export default orderSlice.reducer