import { NextIntlClientProvider } from 'next-intl';
import { render } from '@testing-library/react';

const messages = {
  Auth: {
    nameLabel: 'Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    welcomeBack: 'Welcome Back!',
    getStarted: 'Get Started Now',
    enterCredentials: 'Enter your credentials',
    createAccount: 'Create a new account',
    noAccount: "Don't have an account? ",
    haveAccount: 'Have an account? ',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    accountCreated: 'Account created successfully!',
    userNotFound: 'User with this email not found',
    wrongCredentials: 'Wrong password or email',
    emailInUse: 'Email already in use',
    unknownAuthError: 'An unknown authentication error occurred',
    unknownError: 'An unknown error occurred',
  },
};

export function renderWithMessages(ui: React.ReactNode) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}
