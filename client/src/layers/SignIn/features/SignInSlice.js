import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  body: localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null,
  status: 'idle',
  error: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (params, {getState}) => {

  const {
      user: { body },
  } = getState();

  const {userId, email, password, name} = params;

  const url = userId? '/api/users/profile' : name? "/api/users/register" : "/api/users/signin";
  const method = userId? 'PUT' : 'POST';
  const headers = userId ? { 
                              'Content-Type': 'application/json', 
                              'Authorization': `Bearer ${body.token}`
                            } : {'Content-Type': 'application/json'}

  const requestOptions = {
    method,
    headers,
    body: JSON.stringify({ 
                          email, 
                          password,
                          name: name || undefined
                        })
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    restoreState(state, action) {
        state.error = action.payload
        state.status = 'idle';
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
    }
  }
})

export const userState = state => state.user.body

export const helperErrorState = state => state.user.helpers.helperError

export const userStatus = state => state.user.status;

export const userError = state => state.user.error;

export const { restoreState, signOut } = userSlice.actions

export default userSlice.reducer