import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/[locale]/page';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('@/firebase/firebase', () => ({
  registerWithEmailAndPassword: vi.fn(),
}));

test('Page', () => {
  render(
    <NextIntlClientProvider
      locale="en"
      messages={{ Test: { home: 'Home', about: 'About' } }}
    >
      <Page />
    </NextIntlClientProvider>
  );
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined();
});
