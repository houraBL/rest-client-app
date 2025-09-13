import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';
import { ReactNode } from 'react';
import { MENTORS, TEAM_MEMBERS } from '@/constants/constants';

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props} data-testid="mock-link">
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ ...props }) => <img {...props} />,
}));

describe('Footer', () => {
  it('renders course section with RS School logo and year', () => {
    render(<Footer />);
    expect(screen.getByAltText('RS School icon')).toBeInTheDocument();
    expect(screen.getByText(/course/i)).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it('renders all team members and mentors with GitHub icons', () => {
    render(<Footer />);
    const teamTitle = screen.getByText('team');
    expect(teamTitle).toBeInTheDocument();

    [...TEAM_MEMBERS, ...MENTORS].forEach((m) => {
      expect(screen.getByText(m.name)).toBeInTheDocument();
    });

    const githubIcons = screen.getAllByAltText('GitHub logo');
    expect(githubIcons.length).toBeGreaterThanOrEqual(6);
  });

  it('renders correct number of links', () => {
    render(<Footer />);
    const links = screen.getAllByTestId('mock-link');
    expect(links.length).toBe(7);
  });
});
