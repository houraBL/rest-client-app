export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid items-center justify-items-center p-8 pb-20 gap-4 sm:p-20">
      {children}
    </div>
  );
}
