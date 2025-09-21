import '@testing-library/jest-dom';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect, Mock } from 'vitest';
import { CodeGenerator } from './CodeGenerator';
import { useSelector } from 'react-redux';
import useTheme from '@/hooks/useTheme';
import { LANGUAGES } from '@/types/languages';
import codegen from 'postman-code-generators';
import toast from 'react-hot-toast';
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
  Editor: ({ value, language, theme }: Partial<EditorProps>) => (
    <textarea
      data-testid="editor"
      data-language={language}
      data-theme={theme}
      value={value}
      readOnly
    />
  ),
}));
vi.mock('postman-code-generators', () => ({
  default: {
    convert: vi.fn(),
  },
}));
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
  },
}));

describe('CodeGenerator', () => {
  const mockState = {
    client: {
      url: '/test-url',
      method: 'POST',
      body: '{"test":1}',
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    (useTheme as unknown as Mock).mockReturnValue({ theme: 'light' });
  });

  it('renders select and label', () => {
    render(<CodeGenerator />);
    expect(screen.getByText('generatedCode')).toBeInTheDocument();
    expect(screen.getByText('selectLanguage')).toBeInTheDocument();
  });

  it('updates selected language and calls codegen.convert', async () => {
    const snippet = 'console.log("hello")';
    (codegen.convert as unknown as Mock).mockImplementation(
      (_lang, _variant, _req, _opts, cb) => {
        cb(null, snippet);
      }
    );

    render(<CodeGenerator />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: LANGUAGES[0].label } });

    await waitFor(() => {
      const editor = screen.getByTestId('editor') as HTMLTextAreaElement;
      expect(editor.value).toBe(snippet);
      expect(codegen.convert).toHaveBeenCalled();
    });
  });

  it('shows error toast if codegen fails', async () => {
    (codegen.convert as unknown as Mock).mockImplementation(
      (_lang, _variant, _req, _opts, cb) => {
        cb(new Error('fail'), '');
      }
    );

    render(<CodeGenerator />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: LANGUAGES[0].label } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('error');
    });
  });

  it('copies code to clipboard on button click', async () => {
    const writeTextMock = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });

    (codegen.convert as unknown as Mock).mockImplementation(
      (_lang, _variant, _req, _opts, cb) => {
        cb(null, 'console.log("copy")');
      }
    );

    render(<CodeGenerator />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: LANGUAGES[0].label } });

    const button = await screen.findByText('Copy');
    fireEvent.click(button);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith('console.log("copy")');
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });
});
