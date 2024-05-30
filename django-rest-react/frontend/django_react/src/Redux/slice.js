import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logoutUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, setError, logoutUser } = slice.actions;
export default slice.reducer;