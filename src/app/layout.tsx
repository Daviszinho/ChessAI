import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from '@/i18n/provider';

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
  themeColor: '#1c1917',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon.svg"></link>
      </head>
      <body className="font-body antialiased">
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
