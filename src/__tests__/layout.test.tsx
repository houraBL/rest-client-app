import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import RootLayout from '@/app/layout';

vi.mock('@/app/globals.css', () => ({}));

vi.mock('next-intl/server', () => ({
  getMessages: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/components/Header/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/Footer/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('./Providers', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="intl-provider">{children}</div>
  ),
}));

describe('RootLayout', () => {
  it('renders Header, Footer, Providers, and children', async () => {
    const ui = await RootLayout({ children: <div>Test content</div> });

    render(ui);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
