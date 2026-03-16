import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Disclaimer | compareconstructioninsurance.com.au',
}

export default function Disclaimer() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 5%' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Disclaimer
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '0.9rem' }}>
            Last updated: March 2026
          </p>

          {[
            {
              title: 'General information only',
              body: 'The information on compareconstructioninsurance.com.au is provided for general informational purposes only. It does not constitute financial product advice, legal advice, or any other professional advice. You should always seek independent advice before making any insurance or financial decisions.'
            },
            {
              title: 'Not a licensed broker',
              body: 'compareconstructioninsurance.com.au is a comparison and referral platform. We are not a licensed insurance broker and do not hold an Australian Financial Services Licence (AFSL). We do not recommend, endorse or arrange insurance products. The brokers listed on our platform hold their own AFSL or operate as authorised representatives.'
            },
            {
              title: 'Broker information',
              body: 'We take reasonable steps to verify that brokers listed on our platform are licensed. However we cannot guarantee the ongoing accuracy of broker credentials, licensing status or the quality of their services. You should verify any broker\'s AFSL status at moneysmart.gov.au before engaging their services.'
            },
            {
              title: 'Matching results',
              body: 'Our matching tool provides results based on the information you provide and our assessment of broker specialisations. Results are not a recommendation or endorsement of any particular broker. Different brokers may be more or less suitable depending on your specific circumstances.'
            },
            {
              title: 'No guarantee of outcomes',
              body: 'We do not guarantee that any broker matched through our platform will be able to arrange suitable cover for your needs, or that any particular premium or coverage outcome will be achieved. Insurance coverage is subject to the terms and conditions of each individual policy.'
            },
            {
              title: 'External links',
              body: 'Our website contains links to external broker websites. We are not responsible for the content, accuracy or availability of those sites. The inclusion of a link does not imply endorsement of the linked site or its contents.'
            },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                {section.title}
              </h2>
              <p style={{ color: '#8faabf', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {section.body}
              </p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}