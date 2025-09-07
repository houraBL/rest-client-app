import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Loader } from './Loader';
import '@testing-library/jest-dom';

test('Render Loader component', () => {
  render(<Loader />);
  const loader = screen.getByTestId('loader');
  expect(loader).toBeInTheDocument();
});
