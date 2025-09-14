import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useLocale: vi.fn().mockReturnValue('en'),
  };
});

vi.mock('@/i18n/navigation', () => {
  return {
    useRouter: vi.fn(() => ({ refresh: vi.fn() })),
  };
});
describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.cookie = '';
  });

  it('renders language switcher with default English', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByText(/en/i)).toBeInTheDocument();
    expect(screen.getByText(/ru/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders with Russian locale checked', () => {
    (useLocale as Mock).mockReturnValueOnce('ru');
    render(<LanguageSwitcher />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('switches language and sets cookie', async () => {
    const { rerender } = render(<LanguageSwitcher />);

    (useLocale as Mock).mockReturnValueOnce('ru');
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(useRouter as Mock).toHaveBeenCalled();
    expect(document.cookie).toContain('NEXT_LOCALE=ru');

    rerender(<LanguageSwitcher />);
    await userEvent.click(checkbox);

    expect(useRouter as Mock).toHaveBeenCalled();
    expect(document.cookie).toContain('NEXT_LOCALE=en');
  });
});
