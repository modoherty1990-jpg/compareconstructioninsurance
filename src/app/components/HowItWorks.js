'use client'
export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: '📋',
      title: 'Tell us about your trade',
      desc: 'Answer 5 quick questions about your trade type, cover needed, business size and location.',
    },
    {
      num: '02',
      icon: '🔍',
      title: 'We match you to specialists',
      desc: 'Our algorithm scores every broker against your profile and surfaces the closest matches.',
    },
    {
      num: '03',
      icon: '📞',
      title: 'Contact your broker directly',
      desc: "Call or visit the broker's website directly. No middleman, no markup, no obligation.",
    },
    {
      num: '04',
      icon: '✅',
      title: 'Get covered',
      desc: 'Your broker arranges the right cover for your trade, size and state requirements.',
    },
  ]

  return (
    <section id="how" style={{
      background: '#1a2733',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ marginBottom: '1rem' }} className="section-label">How it works</div>
      <h2 className="section-title">Four steps to the right broker</h2>
      <p className="section-sub">
        No forms to fill in triplicate. No waiting for callbacks. Just a fast, honest match.
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
            <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{step.icon}</div>
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