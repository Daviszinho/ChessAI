import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from '@/i18n/provider';

const title = 'ChessAI';
const description = 'An intelligent chess game powered by AI.';

export const metadata: Metadata = {
  title: title,
  description: description,
  manifest: '/manifest.json',
  applicationName: 'ChessAI',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: title,
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#1c1917',
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: title,
    description: description,
    type: 'website',
    url: '/',
    images: [
      {
        url: 'https://picsum.photos/seed/chess/1200/630',
        width: 1200,
        height: 630,
        alt: 'A game of chess in progress.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: ['https://picsum.photos/seed/chess/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="font-body antialiased">
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
