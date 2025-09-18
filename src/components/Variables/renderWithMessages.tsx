import { NextIntlClientProvider } from 'next-intl';
import { render } from '@testing-library/react';

export function renderWithMessages(ui: React.ReactNode) {
  const messages = {
    variables: {
      variables: 'Variables',
      variable: 'Variable',
      value: 'Value',
      add: 'Add',
    },
  };

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}
