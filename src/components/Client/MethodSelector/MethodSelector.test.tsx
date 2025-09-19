import '@testing-library/jest-dom';

import { RootState } from '@/store/store';
import clientReducer, { ClientState } from '@/store/clientSlice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MethodSelector } from './MethodSelector';
import { Methods } from '@/types/methods';
import { replaceUrl } from '@/utils/replaceUrl';

const mockRouter = { push: vi.fn() };

vi.mock('@/utils/replaceUrl', () => ({
  replaceUrl: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => mockRouter,
}));

function renderWithStore(
  ui: React.ReactElement,
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
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}

describe('MethodSelector', () => {
  it('renders all methods as options', () => {
    renderWithStore(<MethodSelector />);

    Object.values(Methods).forEach((method) => {
      expect(screen.getByRole('option', { name: method })).toBeInTheDocument();
    });
  });

  it('renders the selected method from the store', () => {
    renderWithStore(<MethodSelector />, { method: Methods.POST });

    const select = screen.getByRole('combobox') as HTMLSelectElement;

    expect(select.value).toBe(Methods.POST);
  });

  it('dispatches setMethod when user selects a new method', () => {
    const { store } = renderWithStore(<MethodSelector />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: Methods.PUT } });

    expect(store.getState().client.method).toBe(Methods.PUT);
  });

  it('calls replaceUrl with new method', () => {
    renderWithStore(<MethodSelector />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: Methods.PATCH } });

    expect(replaceUrl).toHaveBeenCalledWith(
      mockRouter,
      expect.objectContaining({ method: Methods.PATCH })
    );
  });
});
