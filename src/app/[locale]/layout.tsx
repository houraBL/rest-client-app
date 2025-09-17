import '../globals.css';

export default async function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="text-center py-20">{children}</div>;
}
