import PublicGuard from '@/components/AuthGuards/PublicGuard/PublicGuard';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicGuard>{children}</PublicGuard>;
}
