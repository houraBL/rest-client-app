import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

vi.mock('@/firebase/firebase', () => ({
  registerWithEmailAndPassword: vi.fn(),
}));

test('Page', () => {
  render(<Page />);
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined();
});
