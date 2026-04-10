'use client'
export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Tell us about your trade',
      desc: 'Tell us your trade, what cover you need, how big your business is and where you\'re based. Takes about a minute.',
    },
    {
      num: '02',
      title: 'We match you to specialists',
      desc: 'We run your answers against every broker in our directory and pull out the ones who know your trade and cover your state.',
    },
    {
      num: '03',
      title: 'Contact your broker directly',
      desc: 'Call them or go straight to their website. No one in the middle. No extra cost. No pressure.',
    },
    {
      num: '04',
      title: 'Get covered',
      desc: 'Your broker sorts the right cover for your trade, your team and your state. You get back on the tools.',
    },
  ]

  return (
    <section id="how" style={{
      background: '#1a2733',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ marginBottom: '1rem' }} className="section-label">How it works</div>
      <h2 className="section-title">How it works. Four steps.</h2>
      <p className="section-sub">
        Answer five questions. We match you. You call the broker. Done.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2px',
        marginTop: '4rem',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}>
        {steps.map(step => (
          <div key={step.num} style={{
            background: '#1a2733',
            padding: '2.5rem 2rem',
            transition: 'background 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#243447'}
          onMouseLeave={e => e.currentTarget.style.background = '#1a2733'}
          >
            <div style={{
              fontFamily: 'var(--font-jakarta), sans-serif',
              fontSize: '4rem', fontWeight: 800,
              color: 'rgba(245,158,11,0.15)',
              lineHeight: 1, marginBottom: '1rem',
            }}>{step.num}</div>
            <h3 style={{
              fontSize: '1.1rem', fontWeight: 700,
              marginBottom: '0.6rem', color: '#ffffff',
            }}>{step.title}</h3>
            <p style={{
              fontSize: '0.9rem', color: '#8faabf', lineHeight: 1.6,
            }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}