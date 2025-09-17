import PrivateGuard from '@/components/AuthGuards/PrivateGuard/PrivateGuard';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PrivateGuard>{children}</PrivateGuard>;
}
