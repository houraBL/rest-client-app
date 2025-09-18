import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import clientReducer, { setUrl } from '@/store/clientSlice';
import { Provider } from 'react-redux';
import { UrlInput } from './UrlInput';

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

  it('updates value when typing', () => {
    renderWithStore();
    const input = screen.getByPlaceholderText(/enter url/i);

    fireEvent.change(input, {
      target: { value: 'https://rickandmortyapi.com/api/' },
    });
    expect(
      screen.getByDisplayValue('https://rickandmortyapi.com/api/')
    ).toBeInTheDocument();
  });

  it('updates when store changes directly', async () => {
    const { store } = renderWithStore();

    store.dispatch(setUrl('https://rickandmortyapi.com/api/'));

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('https://rickandmortyapi.com/api/')
      ).toBeInTheDocument();
    });
  });
});
