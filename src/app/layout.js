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

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.compareconstructioninsurance.com.au/#website',
      url: 'https://www.compareconstructioninsurance.com.au',
      name: 'Compare Construction Insurance',
      description: 'Australia\'s specialist construction insurance broker comparison platform',
      inLanguage: 'en-AU',
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.compareconstructioninsurance.com.au/#organization',
      name: 'Compare Construction Insurance',
      url: 'https://www.compareconstructioninsurance.com.au',
      description: 'Connecting Australian builders, tradies and contractors with specialist insurance brokers.',
      areaServed: 'AU',
      serviceType: 'Insurance Broker Comparison',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is this service really free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — completely free for tradies and builders. We may receive a referral fee from brokers when you make contact, but this never influences your match results.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you match me with brokers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We score every broker against your trade type, cover needed, business size and state. Only brokers who score above a minimum threshold appear in your results.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide financial advice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. This is a filtering and referral tool, not a financial advice service. Contact brokers directly for advice specific to your situation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are all brokers licensed?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every broker listed is either an AFSL holder or an authorised representative of an AFSL holder. You can verify credentials at moneysmart.gov.au.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}