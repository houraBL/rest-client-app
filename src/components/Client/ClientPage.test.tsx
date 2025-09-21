import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect, Mock } from 'vitest';
import ClientPage from './ClientPage';
import { useDispatch, useSelector } from 'react-redux';
import { useParsedUrl } from '@/hooks/useParseUrl/useParseUrl';
import { useVariableLocalStorage } from '@/hooks/useVariableLocalStorage/useVariableLocalStorage';
import {
  setBody,
  setBodyHeader,
  setHeaders,
  setMethod,
  setUrl,
  setVariables,
} from '@/store/clientSlice';

vi.mock('./MethodSelector/MethodSelector', () => ({
  MethodSelector: () => <div>MethodSelector</div>,
}));
vi.mock('./UrlInput/UrlInput', () => ({
  UrlInput: () => <div>UrlInput</div>,
}));
vi.mock('./SendButton/SendButton', () => ({
  SendButton: () => <div>Send</div>,
}));
vi.mock('./Headers/Headers', () => ({
  Headers: () => <div>Headers</div>,
}));
vi.mock('./CodeGenerator/CodeGenerator', () => ({
  CodeGenerator: () => <div>Code Generator</div>,
}));
vi.mock('./BodyEditor/BodyEditor', () => ({
  BodyEditor: () => <div>Body</div>,
}));
vi.mock('./ResponseViewer/ResponseViewer', () => ({
  ResponseViewer: () => <div>Response Status</div>,
}));

vi.mock('react-redux');
vi.mock('@/hooks/useParseUrl/useParseUrl');
vi.mock('@/hooks/useVariableLocalStorage/useVariableLocalStorage');

describe('ClientPage', () => {
  const mockDispatch = vi.fn();
  const defaultState = { client: { headers: {} } };

  beforeEach(() => {
    vi.resetAllMocks();

    (useDispatch as unknown as Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector(defaultState)
    );

    (useParsedUrl as unknown as Mock).mockReturnValue({
      method: 'POST',
      url: '/test-url',
      body: '{"test":1}',
      headers: { Authorization: 'token', 'Content-Type': 'application/json' },
    });

    (useVariableLocalStorage as unknown as Mock).mockReturnValue([
      [
        { name: 'var1', value: 'val1' },
        { name: 'var2', value: 'val2' },
      ],
      vi.fn(),
    ]);
  });

  it('renders all child components', () => {
    render(<ClientPage />);

    expect(screen.getByText('MethodSelector')).toBeInTheDocument();
    expect(screen.getByText('UrlInput')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Code Generator')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Response Status')).toBeInTheDocument();
  });

  it('dispatches method, url, body, headers, bodyHeader, and variables on mount', () => {
    render(<ClientPage />);

    expect(mockDispatch).toHaveBeenCalledWith(setMethod('POST'));
    expect(mockDispatch).toHaveBeenCalledWith(setUrl('/test-url'));
    expect(mockDispatch).toHaveBeenCalledWith(setBody('{"test":1}'));
    expect(mockDispatch).toHaveBeenCalledWith(
      setBodyHeader({ value: 'application/json' })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      setHeaders({ Authorization: 'token' })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      setVariables({ var1: 'val1', var2: 'val2' })
    );
  });

  it('does not dispatch headers or bodyHeader when storedHeaders already exist', () => {
    vi.resetAllMocks();
    const stateWithHeaders = {
      client: { headers: { Authorization: 'existing' } },
    };
    (useDispatch as unknown as Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector(stateWithHeaders)
    );
    (useParsedUrl as unknown as Mock).mockReturnValue({
      method: 'POST',
      url: '/test-url',
      body: '{"test":1}',
      headers: { Authorization: 'token', 'Content-Type': 'application/json' },
    });
    (useVariableLocalStorage as unknown as Mock).mockReturnValue([[], vi.fn()]);

    render(<ClientPage />);

    expect(mockDispatch).toHaveBeenCalledWith(setMethod('POST'));
    expect(mockDispatch).not.toHaveBeenCalledWith(
      setBodyHeader({ value: 'application/json' })
    );
    expect(mockDispatch).not.toHaveBeenCalledWith(
      setHeaders({ Authorization: 'token' })
    );
  });

  // it('does not dispatch bodyHeader for unsupported Content-Type but still sets other headers', () => {
  //   vi.resetAllMocks();
  //   (useDispatch as unknown as Mock).mockReturnValue(mockDispatch);
  //   (useSelector as unknown as Mock).mockImplementation((selector) => selector(defaultState));
  //   (useParsedUrl as unknown as Mock).mockReturnValue({
  //     method: 'PUT',
  //     url: '/multipart',
  //     body: '---binary---',
  //     headers: { Authorization: 'token', 'Content-Type': 'multipart/form-data' },
  //   });
  //   (useVariableLocalStorage as unknown as Mock).mockReturnValue([[], vi.fn()]);

  //   render(<ClientPage />);

  //   expect(mockDispatch).toHaveBeenCalledWith(setMethod('PUT'));
  //   // unsupported Content-Type -> should NOT set body header
  //   expect(mockDispatch).not.toHaveBeenCalledWith(setBodyHeader({ value: 'multipart/form-data' }));
  //   // but other headers should be set (Content-Type removed)
  //   expect(mockDispatch).toHaveBeenCalledWith(setHeaders({ Authorization: 'token' }));
  // });

  it('dispatches empty variables object when there are no stored variables', () => {
    vi.resetAllMocks();
    (useDispatch as unknown as Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector(defaultState)
    );
    (useParsedUrl as unknown as Mock).mockReturnValue({
      method: 'GET',
      url: '/no-vars',
      body: '',
      headers: {},
    });
    (useVariableLocalStorage as unknown as Mock).mockReturnValue([[], vi.fn()]);

    render(<ClientPage />);

    expect(mockDispatch).toHaveBeenCalledWith(setMethod('GET'));
    expect(mockDispatch).toHaveBeenCalledWith(setVariables({}));
  });
});
