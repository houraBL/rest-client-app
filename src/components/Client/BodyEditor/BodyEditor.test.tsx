import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect, Mock } from 'vitest';
import { BodyEditor } from './BodyEditor';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '@/hooks/useTheme';
import { setBody, setBodyHeader } from '@/store/clientSlice';
import { EditorProps } from '@monaco-editor/react';

vi.mock('react-redux');
vi.mock('@/hooks/useTheme');
vi.mock('next-intl', async () => {
  const actual = await import('next-intl');
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('@monaco-editor/react', () => ({
  Editor: ({ value, onChange, language, theme }: EditorProps) => (
    <textarea
      data-testid="editor"
      value={value}
      data-language={language}
      data-theme={theme}
      onChange={(e) =>
        onChange?.(e.target.value, {
          changes: [],
          eol: '\n',
          versionId: 1,
          isUndoing: false,
          isRedoing: false,
          isFlush: false,
          isEolChange: false,
          detailedReasonsChangeLengths: [],
        })
      }
    />
  ),
}));

describe('BodyEditor', () => {
  const mockDispatch = vi.fn();
  const mockState = {
    client: {
      body: '{"test":1}',
      bodyHeader: 'application/json',
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (useDispatch as unknown as Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    (useTheme as unknown as Mock).mockReturnValue({ theme: 'light' });
  });

  it('renders body label and buttons', () => {
    render(<BodyEditor />);
    expect(screen.getByText('body')).toBeInTheDocument();
    expect(screen.getByText('JSON')).toBeInTheDocument();
    expect(screen.getByText('XML')).toBeInTheDocument();
    expect(screen.getByText('Plain')).toBeInTheDocument();
  });

  it('renders editor with correct initial value and language', () => {
    render(<BodyEditor />);
    const editor = screen.getByTestId('editor');
    expect(editor).toHaveValue('{"test":1}');
    expect(editor.dataset.language).toBe('json');
  });

  it('changes language and dispatches setBodyHeader on button click', () => {
    render(<BodyEditor />);
    const xmlButton = screen.getByText('XML');
    fireEvent.click(xmlButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      setBodyHeader({ value: 'application/xml' })
    );

    const editor = screen.getByTestId('editor');
    expect(editor.dataset.language).toBe('xml');
  });

  it('dispatches setBody when editor value changes', () => {
    render(<BodyEditor />);
    const editor = screen.getByTestId('editor');
    fireEvent.change(editor, { target: { value: '{"new":123}' } });

    expect(mockDispatch).toHaveBeenCalledWith(setBody('{"new":123}'));
  });

  it('updates language automatically when bodyHeader changes', () => {
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        client: { body: '{"test":1}', bodyHeader: 'application/xml' },
      })
    );

    render(<BodyEditor />);
    const editor = screen.getByTestId('editor');
    expect(editor.dataset.language).toBe('xml');
  });
});
