import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'ChessAI',
  description: 'An intelligent chess game powered by AI.',
  manifest: '/manifest.json',
  applicationName: 'ChessAI',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ChessAI',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#100a09',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon.svg"></link>
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
