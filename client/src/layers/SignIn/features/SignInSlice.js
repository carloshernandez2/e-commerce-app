import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  body: localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null,
  status: 'idle',
  error: null,
  modifiedUsers: null,
  modifiedStatus: 'idle',
  modifiedError: null,
  users: [],
  usersStatus: 'idle',
  usersError: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (params, {getState}) => {

  const {
      user: { body },
  } = getState();

  const {userId, email, password, name, sellerName, sellerLogo, sellerDescription} = params;

  const url = userId? '/api/users/profile' : name? "/api/users/register" : "/api/users/signin";
  const method = userId? 'PUT' : 'POST';
  const headers = userId ? { 
                              'Content-Type': 'application/json', 
                              'Authorization': `Bearer ${body.token}`
                            } : {'Content-Type': 'application/json'}
  const main = userId 
    ? { name, email, password, sellerName, sellerLogo, sellerDescription}
    : name ? { name, email, password }
    : {email, password}

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

export const modifyUsers = createAsyncThunk('user/modifyUsers', async (params, {getState}) => {
  const {
    user: { body },
  } = getState();

  const { updateId, deleteId, name, email, isSeller, isAdmin } = params
  const _id = updateId || deleteId

  const url = `/api/users/${_id}`;
  const method = deleteId ? 'DELETE' : 'PUT';
  const headers = { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${body.token}`
                  }
  const main = deleteId ? {} : { name, email, isSeller, isAdmin }

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

export const getUsers = createAsyncThunk('user/getUsers', async (params, {getState}) => {
  const {
      user: { body },
  } = getState();

  const { userId } = params
  const token = body && body.token

  const requestOptions = {
    method: 'GET',
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      }
  };

  const url = userId ? `/api/users/${userId}` : '/api/users'

  const response = await fetch(url, requestOptions);
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message)
    error.name = response.status + '';
    throw error
  }
  return data;
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    restoreState(state, action) {
        state.error = action.payload
        state.status = 'idle';
    },
    restoreModifiedUser(state, action) {
        state.modifiedError = null
        state.modifiedStatus = 'idle';
        state.modifiedUsers = null
    },
    restoreUsers(state, action) {
        state.usersError = null
        state.usersStatus = 'idle';
        state.users = []
    },
    signOut(state, action) {
      localStorage.removeItem('user');
      state.body = null
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: {
    [fetchUser.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.body = action.payload
      localStorage.setItem('user', JSON.stringify(state.body));
    },
    [fetchUser.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error
    },
    [modifyUsers.pending]: (state, action) => {
      state.modifiedStatus = 'loading'
    },
    [modifyUsers.fulfilled]: (state, action) => {
      state.modifiedStatus = 'succeeded'
      // Add any fetched posts to the array
      state.modifiedUsers = action.payload
    },
    [modifyUsers.rejected]: (state, action) => {
      state.modifiedStatus = 'failed'
      state.modifiedError = action.error
    },
    [getUsers.pending]: (state, action) => {
      state.usersStatus = 'loading'
    },
    [getUsers.fulfilled]: (state, action) => {
      state.usersStatus = 'succeeded'
      // Add any fetched posts to the array
      state.users = action.payload
    },
    [getUsers.rejected]: (state, action) => {
      state.usersStatus = 'failed'
      state.usersError = action.error
    }
  }
})

export const userState = state => state.user.body

export const userStatus = state => state.user.status;

export const userError = state => state.user.error;

export const modifiedUsersState = state => state.user.modifiedUsers

export const modifiedUsersStatus = state => state.user.modifiedStatus;

export const modifiedUsersError = state => state.user.modifiedError;

export const usersState = state => state.user.users

export const singleUserState = (state, id) => state.user.users.find((user) => user._id === id)

export const usersStatus = state => state.user.usersStatus;

export const usersError = state => state.user.usersError;

export const { restoreState, signOut, restoreModifiedUser, restoreUsers } = userSlice.actions

export default userSlice.reducer