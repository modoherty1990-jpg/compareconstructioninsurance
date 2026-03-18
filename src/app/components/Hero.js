'use client'

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '120px 5% 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(245,158,11,0.12)',
        border: '1px solid rgba(245,158,11,0.3)',
        color: '#f59e0b',
        padding: '6px 14px', borderRadius: '100px',
        fontSize: '0.75rem', fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: '2rem',
        animation: 'fadeUp 0.6s ease both',
      }}>
        <span style={{
          width: '6px', height: '6px',
          background: '#f59e0b', borderRadius: '50%',
          animation: 'pulse 2s infinite',
        }} />
        Free Broker Matching for Australian Tradies and Builders
      </div>

      <h1 style={{
        fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: '-0.04em',
        maxWidth: '780px',
        animation: 'fadeUp 0.6s 0.1s ease both',
        color: '#ffffff',
      }}>
        Find the right construction insurance broker for your{' '}
        <em style={{ fontStyle: 'normal', color: '#f59e0b' }}>trade — matched in 60 seconds</em>
      </h1>

      <p style={{
        fontSize: '1.2rem',
        color: '#cbd5e1',
        fontWeight: 300,
        maxWidth: '540px',
        lineHeight: 1.7,
        marginTop: '1.5rem',
        animation: 'fadeUp 0.6s 0.2s ease both',
      }}>
        Tell us your trade, what cover you need and where you're based. We match you to specialist construction insurance brokers who actually know your industry. Takes about a minute. Costs nothing.
      </p>

      <div style={{
        display: 'flex', gap: '2rem', marginTop: '2.5rem',
        flexWrap: 'wrap',
        animation: 'fadeUp 0.6s 0.3s ease both',
      }}>
        {[
          'Licensed brokers only',
          '100% free',
          'No obligation',
          'All states covered',
        ].map(item => (
          <div key={item} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.875rem', color: '#cbd5e1', fontWeight: 500,
          }}>
            <span style={{
              width: '20px', height: '20px',
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', color: '#10b981',
              flexShrink: 0,
            }}>✓</span>
            {item}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '3rem',
        display: 'flex', gap: '1rem', flexWrap: 'wrap',
        animation: 'fadeUp 0.6s 0.4s ease both',
      }}>
        <a href="#compare" className="btn-primary">Find My Broker →</a>
        <a href="#brokers" className="btn-secondary">Browse all brokers</a>
      </div>

      <div style={{
        position: 'absolute', right: '5%', bottom: '10%',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        animation: 'fadeLeft 0.8s 0.5s ease both',
      }}>
        {[
          { num: '17+', label: 'Specialist brokers' },
          { num: '60s', label: 'To get matched' },
          { num: 'Free', label: 'Always free' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#1a2733',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '16px 24px',
            textAlign: 'right',
          }}>
            <div style={{
              fontFamily: 'var(--font-jakarta), sans-serif',
              fontWeight: 800, fontSize: '1.8rem',
              color: '#f59e0b',
            }}>{stat.num}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stat.label}</div>
          </div>
        ))}
      </div>

    </section>
  )
}