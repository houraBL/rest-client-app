import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  isAuthenticated: boolean;
  user: {
    userName: string;
    email: string;
    password: string;
  } | null;
  isLoading: boolean;
  error: boolean;
};

const initialState: InitialState = {
  isAuthenticated: false,
  user: null, //данные юзера
  isLoading: false,
  error: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInStart(state) {
      state.isLoading = true;
      state.error = false;
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
