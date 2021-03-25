import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  body: [],
  status: ['idle', 'idle'],
  error: {renderError: null, updateError: null},
  orders: [],
  ordersStatus: 'idle',
  ordersError: null,
  modifiedOrder: [],
  modifiedStatus: 'idle',
  modifiedError: null
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

    const { admin } = params

    const requestOptions = {
      method: 'GET',
      headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${body.token}`
        }
    };

    const url = admin ? '/api/orders' : '/api/orders/mine'

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message)
      error.name = response.status + '';
      throw error
    }
    return data;
})

export const deleteUpdateOrder = createAsyncThunk('order/deleteUpdateOrder', async (params, {getState}) => {
  const {
      user: { body },
  } = getState();

  const { updateId, deleteId } = params
  const _id = updateId || deleteId

  const url = deleteId ? `/api/orders/${_id}` : `/api/orders/${_id}/deliver`;
  const method = deleteId ? 'DELETE' : 'PUT';
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state, action) {
        state.body = action.payload
        state.status = ['idle', 'idle']
        state.error = {renderError: null, updateError: null}
    },
    resetOrders(state, action) {
        state.orders = []
        state.ordersStatus = 'idle'
        state.ordersError = null
    },
    resetModified(state, action) {
        state.modifiedOrder = []
        state.modifiedStatus = 'idle'
        state.modifiedStatus = null
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
    },
    [deleteUpdateOrder.pending]: (state, action) => {
      state.modifiedStatus = 'loading'
    },
    [deleteUpdateOrder.fulfilled]: (state, action) => {
      state.modifiedStatus = 'succeeded'
      // Add any fetched posts to the array
      state.modifiedOrder = action.payload
    },
    [deleteUpdateOrder.rejected]: (state, action) => {
      state.modifiedStatus = 'failed'
      state.modifiedError = action.error
    }
  }
})

export const orderState = state => state.order.body

export const ordersState = state => state.order.orders

export const modifiedOrder = state => state.order.modifiedOrder

export const orderStatus = state => state.order.status;

export const ordersStatus = state => state.order.ordersStatus;

export const modifiedStatus = state => state.order.modifiedStatus;

export const orderError = state => state.order.error;

export const ordersError = state => state.order.ordersError;

export const modifiedError = state => state.order.modifiedError;

export const singleOrderState = (state, id) => state.order.body.find((product) => product._id === id)

export const { resetOrder, resetOrders, resetModified } = orderSlice.actions

export default orderSlice.reducer