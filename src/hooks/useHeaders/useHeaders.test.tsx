import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useHeaders from './useHeaders';
import clientReducer from '@/store/clientSlice';

vi.mock('next-intl', async () => {
  const actual = await import('next-intl');
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

function renderUseHeaders(initialHeaders: Record<string, string> = {}) {
  const store = configureStore({
    reducer: { client: clientReducer },
    preloadedState: {
      client: { headers: initialHeaders },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...renderHook(() => useHeaders(), { wrapper }),
  };
}

describe('useHeaders', () => {
  it('initializes from store headers', () => {
    const { result } = renderUseHeaders({ 'Content-Type': 'application/json' });
    expect(result.current.headers).toEqual([
      { name: 'Content-Type', value: 'application/json' },
    ]);
  });

  it('adds a header and syncs with store', () => {
    const { result, store } = renderUseHeaders();
    act(() => {
      result.current.setNewHeader({
        name: 'Authorization',
        value: 'Bearer token',
      });
    });

    act(() => {
      result.current.addHeader();
    });

    expect(result.current.headers).toEqual([
      { name: 'Authorization', value: 'Bearer token' },
    ]);

    const state = store.getState().client.headers;
    expect(state).toEqual({ Authorization: 'Bearer token' });
  });

  it('updates a header and syncs with store', () => {
    const { result, store } = renderUseHeaders({
      Authorization: 'Bearer old',
    });

    act(() => {
      result.current.updateHeader(0, 'value', 'Bearer new');
    });

    expect(result.current.headers[0].value).toBe('Bearer new');
    expect(store.getState().client.headers.Authorization).toBe('Bearer new');
  });

  it('deletes a header and syncs with store', () => {
    const { result, store } = renderUseHeaders({
      Authorization: 'Bearer token',
    });

    act(() => {
      result.current.deleteHeader(0);
    });

    expect(result.current.headers).toEqual([]);
    expect(store.getState().client.headers).toEqual({});
  });
});
