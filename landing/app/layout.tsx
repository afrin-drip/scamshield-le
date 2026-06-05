import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScamShield LE — Stop Scam Calls Before They Cost You',
  description:
    'ScamShield LE detects law enforcement impersonation scams in real time using AI, fires an instant alert, and connects you to verified agencies — before the scammer gets a cent.',
  keywords: ['scam protection', 'law enforcement impersonation', 'IRS scam', 'phone scam detector', 'AI scam detection'],
  metadataBase: new URL('https://scamshieldle.com'),
  openGraph: {
    title: 'ScamShield LE — Stop Scam Calls Before They Cost You',
    description: 'Real-time AI detection for law enforcement impersonation scams.',
    url: 'https://scamshieldle.com',
    siteName: 'ScamShield LE',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ScamShield LE' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScamShield LE — Stop Scam Calls Before They Cost You',
    description: 'Real-time AI detection for law enforcement impersonation scams.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-bg text-white antialiased`}>{children}</body>
    </html>
  )
}
