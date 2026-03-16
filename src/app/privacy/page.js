import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Privacy Policy | compareconstructioninsurance.com.au',
}

export default function Privacy() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 5%' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '0.9rem' }}>
            Last updated: March 2026
          </p>

          {[
            {
              title: 'Who we are',
              body: 'compareconstructioninsurance.com.au is a comparison and referral platform that connects builders, tradies and contractors with specialist insurance brokers. We are committed to protecting your personal information in accordance with the Australian Privacy Act 1988.'
            },
            {
              title: 'What we collect',
              body: 'When you use our comparison tool, we may collect your name, email address, phone number, and information about your business including trade type, business size, revenue and location. We only collect what is necessary to match you with relevant brokers.'
            },
            {
              title: 'How we use your information',
              body: 'We use your information to match you with relevant insurance brokers, to send you your results, and to improve our matching algorithm. If you consent, we may contact you with relevant insurance information. We do not sell your personal data to third parties.'
            },
            {
              title: 'Who we share it with',
              body: 'We may share your contact details with the brokers you are matched with, so they can follow up with you. We do not share your data with any other parties. Brokers we work with are required to handle your data in accordance with Australian privacy law.'
            },
            {
              title: 'Your rights',
              body: 'Under the Australian Privacy Act you have the right to access the personal information we hold about you, to correct inaccurate information, and to request deletion of your data. To exercise any of these rights, contact us at hello@compareconstructioninsurance.com.au.'
            },
            {
              title: 'Cookies',
              body: 'We use standard analytics cookies to understand how visitors use our site. We do not use advertising cookies or track you across other websites. You can disable cookies in your browser settings at any time.'
            },
            {
              title: 'Contact',
              body: 'For any privacy-related queries, contact us at hello@compareconstructioninsurance.com.au.'
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