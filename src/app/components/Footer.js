'use client'

export default function Footer() {
  return (
    <footer style={{
      background: '#0a1420',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '60px 5% 40px',
    }}>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem',
      }}>

        {/* Brand col */}
        <div>
          <div style={{ lineHeight: 1, display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
            <span style={{
              fontFamily: 'var(--font-jakarta), sans-serif',
              fontSize: '1.1rem', fontWeight: 800,
              letterSpacing: '-0.04em', color: '#ffffff',
            }}>compare</span>
            <span style={{
              fontFamily: 'var(--font-jakarta), sans-serif',
              fontSize: '0.6rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#f59e0b',
            }}>construction insurance</span>
          </div>
          <p style={{
            fontSize: '0.875rem', color: '#64748b',
            lineHeight: 1.7, marginBottom: '1rem', maxWidth: '280px',
          }}>
            Australia's specialist construction insurance broker comparison platform.
            Connecting builders, tradies and contractors with the right broker.
          </p>
          <a href="mailto:hello@compareconstructioninsurance.com.au" style={{
            fontSize: '0.875rem', color: '#94a3b8',
            textDecoration: 'none', display: 'block', marginBottom: '1rem',
          }}
          onMouseEnter={e => e.target.style.color = '#cbd5e1'}
          onMouseLeave={e => e.target.style.color = '#94a3b8'}
          >
            hello@compareconstructioninsurance.com.au
          </a>
          <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
            compareconstructioninsurance.com.au is a comparison and referral platform.
            We do not provide financial advice.
          </p>
        </div>

        {/* Compare col */}
        <div>
          <h4 style={{
            fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#94a3b8', marginBottom: '1rem',
          }}>Compare</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Builder insurance', href: '#compare' },
              { label: 'Tradie insurance', href: '#compare' },
              { label: 'Contractor insurance', href: '#compare' },
              { label: 'Civil contractor', href: '#compare' },
              { label: 'Owner builder', href: '#compare' },
            ].map(link => (
              <li key={link.label}>
                <a href={link.href} style={{
                  fontSize: '0.875rem', color: '#64748b',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#cbd5e1'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
                >{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Guides col */}
        <div>
          <h4 style={{
            fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#94a3b8', marginBottom: '1rem',
          }}>Guides</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Public liability', href: '/guides/public-liability-insurance-builders' },
              { label: 'Contract works', href: '/guides/contract-works-insurance-guide' },
              { label: 'Professional indemnity', href: '/guides/professional-indemnity-insurance-builders' },
              { label: 'Tools insurance', href: '/guides/tools-insurance-tradies' },
              { label: 'All guides →', href: '/guides' },
            ].map(link => (
              <li key={link.label}>
                <a href={link.href} style={{
                  fontSize: '0.875rem', color: '#64748b',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#cbd5e1'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
                >{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal col */}
        <div>
          <h4 style={{
            fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#94a3b8', marginBottom: '1rem',
          }}>Legal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Use', href: '/terms' },
              { label: 'Disclaimer', href: '/disclaimer' },
              { label: 'How matching works', href: '/how-matching-works' },
            ].map(link => (
              <li key={link.label}>
                <a href={link.href} style={{
                  fontSize: '0.875rem', color: '#64748b',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#cbd5e1'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
                >{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
          © 2026 compareconstructioninsurance.com.au — All rights reserved
        </span>
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
          This site does not provide financial advice. Always read the FSG before proceeding.
        </span>
      </div>

    </footer>
  )
}