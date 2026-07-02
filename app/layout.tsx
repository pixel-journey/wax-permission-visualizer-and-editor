import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Permission Visualizer & Editor | Pixel Journey',
  description: 'Interactive, safe visualizer and editor for Antelope/EOSIO account permissions on WAX. Retro pixel glassmorphic excellence.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
