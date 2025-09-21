import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ClientState {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  bodyHeader: string;
  variables: Record<string, string>;
  response: {
    status: number;
    data?: unknown;
    error?: string;
  };
  initialized: boolean;
}
const loadState = (): ClientState => {
  return {
    method: 'GET',
    url: '',
    headers: {},
    bodyHeader: 'application/json',
    body: '',
    variables: {},
    response: {
      status: 0,
    },
    initialized: false,
  };
};

const initialState: ClientState = loadState();

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
    setBodyHeader(state, action: PayloadAction<{ value: string }>) {
      state.bodyHeader = action.payload.value;
    },
    setBody(state, action: PayloadAction<string>) {
      state.body = action.payload;
    },
    setVariables(state, action: PayloadAction<Record<string, string>>) {
      state.variables = action.payload;
    },
    setResponse(
      state,
      action: PayloadAction<{
        response: { status: number; data?: unknown; error?: string };
      }>
    ) {
      state.response = action.payload.response;
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
    resetClient() {
      return loadState();
    },
  },
});

export const {
  setMethod,
  setUrl,
  setHeaders,
  setBodyHeader,
  setBody,
  setResponse,
  setVariables,
  setInitialized,
  resetClient,
} = clientSlice.actions;

export default clientSlice.reducer;
