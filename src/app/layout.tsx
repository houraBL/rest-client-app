import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import Providers from './Providers';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RESTful API',
  description: 'Restful API by RS School students',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  console.log(locale);
  const messages = (await import(`../../messages/${locale || 'en'}.json`))
    .default;

  return (
    <html lang={locale || 'en'} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale || 'en'} messages={messages}>
          <Providers>
            <div className="min-h-screen flex flex-col relative w-full">
              <Header />
              <main className="flex-grow flex items-center justify-center text-xl">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
