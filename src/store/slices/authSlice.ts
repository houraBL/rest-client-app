import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  isAuthenticated: boolean;
  user: {
    uid: string;
    email: string;
  } | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: InitialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInStart(state) {
      state.isLoading = true;
      state.error = '';
    },
    signInSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    signInFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    signOut(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signOut } =
  authSlice.actions;

export default authSlice.reducer;
