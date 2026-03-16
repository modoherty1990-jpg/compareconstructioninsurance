import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Terms of Use | compareconstructioninsurance.com.au',
}

export default function Terms() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 5%' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Terms of Use
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '0.9rem' }}>
            Last updated: March 2026
          </p>

          {[
            {
              title: 'About this service',
              body: 'compareconstructioninsurance.com.au is a free comparison and referral platform. We help builders, tradies and contractors find specialist insurance brokers. We are not a licensed insurance broker and we do not provide financial advice.'
            },
            {
              title: 'No financial advice',
              body: 'The information on this website is general in nature and does not take into account your personal circumstances, needs or objectives. Nothing on this site constitutes financial product advice. You should always read a broker\'s Financial Services Guide and consider whether their advice is appropriate for your situation before proceeding.'
            },
            {
              title: 'Accuracy of information',
              body: 'We take reasonable care to ensure broker information is accurate and up to date. However we cannot guarantee the accuracy, completeness or currency of all information. Broker details including phone numbers, websites and specialties may change. Always verify broker credentials directly before engaging their services.'
            },
            {
              title: 'Referral relationships',
              body: 'We may receive a referral fee from brokers when you make contact through our platform. This fee is paid by the broker and does not affect the price you pay for insurance. Our matching results are based on profile fit, not commercial arrangements.'
            },
            {
              title: 'Limitation of liability',
              body: 'To the extent permitted by law, compareconstructioninsurance.com.au is not liable for any loss or damage arising from your use of this site or reliance on information provided. This includes any decisions made based on broker matches or information displayed.'
            },
            {
              title: 'Third party websites',
              body: 'Our site contains links to broker websites. We are not responsible for the content or privacy practices of those websites. Links do not constitute endorsement of any broker or their products.'
            },
            {
              title: 'Changes to these terms',
              body: 'We may update these terms at any time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.'
            },
            {
              title: 'Contact',
              body: 'For any questions about these terms, contact us at hello@compareconstructioninsurance.com.au.'
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