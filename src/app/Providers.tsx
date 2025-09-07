'use client';

import { ThemeProvider } from '@/providers/ThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
