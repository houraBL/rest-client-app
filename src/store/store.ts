import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clientSlice';

export const store = configureStore({
  reducer: {
    client: clientReducer,
  },
});

store.subscribe(() => {
  try {
    localStorage.setItem(
      'clientState',
      JSON.stringify(store.getState().client)
    );
  } catch (err) {
    console.error('Failed to save client state', err);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
