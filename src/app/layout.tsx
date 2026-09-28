import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '../i18n/useTranslation';
import { DemoModeBanner } from '../components/common/DemoModeBanner';
import { BackendWarmer } from '../components/common/BackendWarmer';

export const metadata: Metadata = {
  title: 'KABADIWALA - Smart Collection. Fair Prices. Responsible Recycling.',
  description: 'E-Waste collection platform designed specifically for informal scrap collectors and Kabadiwalas in India.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#065f46',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <BackendWarmer />
        <DemoModeBanner />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

