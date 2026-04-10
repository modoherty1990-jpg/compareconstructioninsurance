'use client'

export default function WhyUs() {
  const cards = [
    {
      title: 'Licensed brokers only',
      desc: 'Every broker on this site is licensed under an AFSL. You can check any broker\'s credentials at moneysmart.gov.au.',
    },
    {
      title: 'Specialist matching',
      desc: 'We score brokers against your trade, your cover needs, your team size and your state. You only see brokers who are actually relevant to your work. Not just the nearest option.',
    },
    {
      title: 'Completely free',
      desc: 'It costs you nothing to use this site. We may receive a fee from brokers if you end up working with them, but it never affects your match results. Your ranking is based on fit, not who pays us more.',
    },
    {
      title: 'Your data is protected',
      desc: 'We only collect what we need to match you to a broker. We don\'t sell your data to anyone.',
    },
    {
      title: 'Fast and no obligation',
      desc: 'Five questions. 60 seconds. No account, no signup, no pressure. Contact the broker directly. You\'re under no obligation to go any further.',
    },
    {
      title: 'Australia-wide',
      desc: 'We cover every state and territory. Most brokers on our platform work nationally and we\'ve got specialists for state-specific requirements.',
    },
  ]

  return (
    <section id="why" style={{ background: '#0f1923' }}>
      <div className="section-label">Why use us</div>
      <h2 className="section-title">Built for tradies and builders</h2>
      <p className="section-sub">
        Most comparison sites don't know the difference between a builder and a subcontractor. This one does.
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