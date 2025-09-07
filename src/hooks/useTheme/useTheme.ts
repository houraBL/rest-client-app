'use client';

import { ThemeContext } from '@/providers/ThemeProvider';
import { useContext } from 'react';

export default function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('no ThemeProvider');
  }
  return context;
}
