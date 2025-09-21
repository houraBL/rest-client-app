import { VariableType } from '@/hooks/useVariables/useVariables';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ClientState {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  bodyHeader: string;
  variables: VariableType[];
  response: {
    status: number;
    data?: unknown;
    error?: string;
  };
}
const loadState = (): ClientState => {
  return {
    method: 'GET',
    url: '',
    headers: {},
    bodyHeader: 'application/json',
    body: '',
    variables: [],
    response: {
      status: 0,
    },
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

    //setVariables()
    setResponse(
      state,
      action: PayloadAction<{
        response: { status: number; data?: unknown; error?: string };
      }>
    ) {
      state.response = action.payload.response;
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
  //setVariables,
} = clientSlice.actions;

export default clientSlice.reducer;
