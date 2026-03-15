'use client'
export default function WhyUs() {
  const cards = [
    {
      icon: '🛡️',
      title: 'Licensed brokers only',
      desc: 'Every broker listed is either an AFSL holder or an authorised representative of an AFSL holder. You can verify any broker\'s licence at moneysmart.gov.au.',
    },
    {
      icon: '🎯',
      title: 'Specialist matching',
      desc: 'We score brokers against your trade type, cover needs, business size and state. You only see brokers who are genuinely relevant to your profile.',
    },
    {
      icon: '💰',
      title: 'Completely free',
      desc: 'This service costs you nothing. We may receive a referral fee from brokers — this never influences your match results. Rankings are always based on fit, not fees.',
    },
    {
      icon: '🔒',
      title: 'Your data is protected',
      desc: 'We collect only what\'s needed to match you. We don\'t sell your data and you can request deletion at any time under the Australian Privacy Act.',
    },
    {
      icon: '⚡',
      title: 'Fast and no obligation',
      desc: 'Five questions, 60 seconds, no account required. Contact brokers directly — there\'s no pressure and no obligation to proceed.',
    },
    {
      icon: '🇦🇺',
      title: 'Australia-wide',
      desc: 'We cover all states and territories. Many brokers on our platform operate nationally, with specialists available for state-specific requirements like home warranty.',
    },
  ]

  return (
    <section id="why" style={{ background: '#0f1923' }}>
      <div className="section-label">Why use us</div>
      <h2 className="section-title">Built for tradies and builders</h2>
      <p className="section-sub">
        Most comparison sites are built for consumers. This one is built for the construction industry.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
        marginTop: '3rem',
      }}>
        {cards.map(card => (
          <div key={card.title} style={{
            background: '#1a2733',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '1.75rem',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{card.icon}</div>
            <h3 style={{
              fontSize: '1rem', fontWeight: 700,
              marginBottom: '0.6rem', color: '#ffffff',
            }}>{card.title}</h3>
            <p style={{
              fontSize: '0.875rem', color: '#8faabf', lineHeight: 1.7,
            }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}