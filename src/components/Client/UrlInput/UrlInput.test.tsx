import '@testing-library/jest-dom';

import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import clientReducer, { setUrl } from '@/store/clientSlice';
import { Provider } from 'react-redux';
import { UrlInput } from './UrlInput';
import userEvent from '@testing-library/user-event';

function renderWithStore(preloadedUrl = '') {
  const store = configureStore({
    reducer: { client: clientReducer },
    preloadedState: {
      client: {
        method: 'GET',
        url: preloadedUrl,
        headers: {},
        body: '',
      },
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <UrlInput />
      </Provider>
    ),
  };
}

describe('UrlInput', () => {
  it('renders with placeholder', () => {
    renderWithStore();
    expect(screen.getByPlaceholderText(/enter url/i)).toBeInTheDocument();
  });

  it('shows initial value from store', () => {
    renderWithStore('https://rickandmortyapi.com/api/');
    expect(
      screen.getByDisplayValue('https://rickandmortyapi.com/api/')
    ).toBeInTheDocument();
  });

  it('updates value when typing', async () => {
    renderWithStore();
    const input = screen.getByPlaceholderText(/enter url/i);

    await userEvent.type(input, 'https://rickandmortyapi.com/api/');
    expect(
      screen.getByDisplayValue('https://rickandmortyapi.com/api/')
    ).toBeInTheDocument();
  });

  it('updates when store changes directly', async () => {
    const { store } = renderWithStore();
    act(() => {
      store.dispatch(setUrl('https://rickandmortyapi.com/api/'));
    });

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('https://rickandmortyapi.com/api/')
      ).toBeInTheDocument();
    });
  });
});
