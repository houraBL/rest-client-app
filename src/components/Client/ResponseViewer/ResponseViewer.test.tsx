import { describe, expect, it, vi } from 'vitest';
import { ResponseViewer } from './ResponseViewer';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@/providers/ThemeProvider';
import clientReducer, { ClientState } from '@/store/clientSlice';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Provider } from 'react-redux';

vi.mock('@/components/Loader/Loader', () => ({
  Loader: () => <div>Loading</div>,
}));

function renderWithStoreAndTheme(
  children: React.ReactElement,
  preloadedClient?: Partial<ClientState>
) {
  const store = configureStore({
    reducer: { client: clientReducer },
    preloadedState: {
      client: {
        method: 'GET',
        url: '',
        headers: {},
        body: '',
        ...preloadedClient,
      },
    } as RootState,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    ),
  };
}

describe('ResponseViewer', () => {
  it('renders HTTP success status correctly', () => {
    renderWithStoreAndTheme(<ResponseViewer />, {
      response: { status: 201, data: '{"ok":true}' },
    });
    expect(screen.getByText('Response Status: 201')).toBeDefined();
    const statusDiv = screen.getByText(/Response Status:/);
    expect(statusDiv).toHaveClass('badge-success');
  });

  it('renders HTTP error status correctly', () => {
    renderWithStoreAndTheme(<ResponseViewer />, {
      response: { status: 400, data: '{"ok":true}' },
    });
    expect(screen.getByText('Response Status: 400')).toBeDefined();
    const statusDiv = screen.getByText(/Response Status:/);
    expect(statusDiv).toHaveClass('badge-error');
  });

  it('renders empty editor if no data or error, and yellow status', () => {
    renderWithStoreAndTheme(<ResponseViewer />, { response: { status: 0 } });
    expect(screen.getByText(/Response Status: 0/)).toBeDefined();
    const statusDiv = screen.getByText(/Response Status:/);
    expect(statusDiv).toHaveClass('badge-warning');
  });
});
