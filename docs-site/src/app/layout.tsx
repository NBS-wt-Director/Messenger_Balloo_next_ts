import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Balloo Platform Documentation',
  description: 'Official documentation for the Balloo platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
