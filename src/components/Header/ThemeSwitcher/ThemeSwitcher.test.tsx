import { describe, expect, it, vi } from 'vitest';
import ThemeSwitcher from './ThemeSwitcher';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/providers/ThemeProvider';

const toggleTheme = vi.fn();

vi.mock('@/hooks/useTheme', () => ({
  default: () => ({
    theme: 'light',
    toggleTheme: toggleTheme,
  }),
}));

describe('ThemeSwitcher', () => {
  it('renders theme switcher with 2 icons', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByTestId('sun-icon')).toHaveClass('swap-off');
    expect(screen.getByTestId('moon-icon')).toHaveClass('swap-on');

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls toggleTheme and toggles checkbox when clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(toggleTheme).toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });
});
