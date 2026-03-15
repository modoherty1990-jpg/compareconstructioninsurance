import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm',
})

export const metadata = {
  title: 'Compare Construction Insurance Brokers Australia | Free Matching Tool',
  description: 'Compare specialist construction insurance brokers across Australia. Answer 5 quick questions and get matched to the right broker for your trade, cover needs and state. Free for builders, tradies and contractors.',
  keywords: 'construction insurance broker, tradie insurance, builder insurance, compare insurance brokers australia',
  metadataBase: new URL('https://www.compareconstructioninsurance.com.au'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.compareconstructioninsurance.com.au',
    title: 'Compare Construction Insurance Brokers Australia',
    description: 'Answer 5 quick questions and get matched to specialist construction insurance brokers. Free for builders, tradies and contractors.',
    siteName: 'compareconstructioninsurance.com.au',
  },
  twitter: {
    card: 'summary',
    title: 'Compare Construction Insurance Brokers Australia',
    description: 'Answer 5 quick questions and get matched to specialist construction insurance brokers.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}