import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ClientState {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
}
const loadState = (): ClientState => {
  try {
    const saved = localStorage.getItem('clientState');
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to load client state', err);
  }
  return {
    method: 'GET',
    url: '',
    headers: {},
    body: '',
  };
};

const initialState: ClientState = loadState();

// const initialState: ClientState = {
//   method: "GET",
//   url: "",
//   headers: {},
//   body: "",
//   // response: null,
// };

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setMethod(state, action: PayloadAction<string>) {
      state.method = action.payload;
    },
    setUrl(state, action: PayloadAction<string>) {
      state.url = action.payload;
    },
    setHeaders(state, action: PayloadAction<Record<string, string>>) {
      state.headers = action.payload;
    },
    setBody(state, action: PayloadAction<string>) {
      state.body = action.payload;
    },
  },
});

export const { setMethod, setUrl, setHeaders, setBody } = clientSlice.actions;

export default clientSlice.reducer;
