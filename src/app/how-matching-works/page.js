import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'How Matching Works | compareconstructioninsurance.com.au',
}

export default function HowMatchingWorks() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 5%' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            How matching works
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
            We believe you should know exactly how we match you with brokers. Here is a transparent breakdown of our scoring system.
          </p>

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              The four scoring signals
            </h2>

            {[
              {
                signal: 'Trade type match',
                points: '+4 points',
                color: '#10b981',
                desc: 'The strongest signal. If a broker specialises in your trade type — builder, tradie, civil contractor, consultant etc — they score 4 points. This is weighted highest because a broker who knows your industry will understand your risks, your contracts and your legal obligations far better than a generalist.'
              },
              {
                signal: 'Cover match',
                points: 'Up to +4 points',
                color: '#f59e0b',
                desc: 'For each type of cover you need that a broker can arrange, they score 2 points — up to a maximum of 4. So if you need public liability and contract works and a broker covers both, they score the full 4. This ensures brokers who can handle your complete insurance needs score higher than those who can only partially help.'
              },
              {
                signal: 'Business size fit',
                points: '+3 points',
                color: '#f59e0b',
                desc: 'Brokers who typically work with businesses of your size score 3 points. A sole trader benefits from a broker experienced with small operators. A large contractor needs a broker set up to handle complex, multi-policy programs. Matching on size means you get a broker who is genuinely used to working with businesses like yours.'
              },
              {
                signal: 'State fit',
                points: '+2 points',
                color: '#94a3b8',
                desc: 'Brokers who operate in your state score 2 points. National brokers always score this point. State-specific brokers only score it if their coverage area matches your state. This matters most for home warranty insurance, which has different distributors in each state.'
              },
            ].map(item => (
              <div key={item.signal} style={{
                background: '#1a2733',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1rem',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: item.color,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>{item.points}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    {item.signal}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#8faabf', lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
              Specialist bonus
            </h2>
            <p style={{ color: '#8faabf', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Brokers who are dedicated construction specialists — meaning construction insurance is their primary focus rather than one of many categories — receive an additional 2 point bonus. This reflects the real-world advantage of working with a broker who lives and breathes your industry.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
              Minimum threshold
            </h2>
            <p style={{ color: '#8faabf', lineHeight: 1.8, fontSize: '0.95rem' }}>
              A broker must score at least 3 points to appear in your results. This means a broker with no relevant trade experience, no matching cover types and no state presence will never appear — even if no strong matches exist. We would rather show you fewer results than show you irrelevant ones.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
              What we do not score on
            </h2>
            <p style={{ color: '#8faabf', lineHeight: 1.8, fontSize: '0.95rem' }}>
              We do not score brokers based on how much they pay us, how long they have been on our platform, or any other commercial factor. A broker cannot pay to appear higher in your results. Rankings are determined entirely by the four signals above.
            </p>
          </div>

          <div style={{
            background: '#1a2733',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.7 }}>
              This tool is designed to help you find relevant brokers faster — not to replace professional advice. Once matched, contact your broker directly and ask them to explain what cover is right for your specific situation. Always read their Financial Services Guide before proceeding.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}