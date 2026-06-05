import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScamShield LE — Law Enforcement Portal',
  description: 'Secure law enforcement portal for scam incident analysis',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.5.2/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body className="bg-[#0F1923] text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
