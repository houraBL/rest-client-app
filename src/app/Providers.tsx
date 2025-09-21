'use client';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AuthProvider } from '@/providers/AuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
