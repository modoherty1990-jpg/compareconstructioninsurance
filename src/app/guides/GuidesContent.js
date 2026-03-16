'use client'

const GUIDES = [
  {
    category: 'General guides',
    items: [
      { title: 'Tradie insurance guide', desc: 'Everything a tradie needs to know about insurance in Australia.', href: '/guides/tradie-insurance-guide' },
      { title: 'Builder insurance guide', desc: 'A complete guide to insurance for licensed builders.', href: '/guides/builder-insurance-guide' },
      { title: 'Contractor insurance brokers', desc: 'How to find the right broker for your contracting business.', href: '/guides/contractor-insurance-brokers' },
      { title: 'Construction insurance brokers', desc: 'What to look for in a specialist construction insurance broker.', href: '/guides/construction-insurance-brokers' },
    ]
  },
  {
    category: 'Cover types',
    items: [
      { title: 'Public liability insurance for builders', desc: 'What it covers, how much you need and what it costs.', href: '/guides/public-liability-insurance-builders' },
      { title: 'Contract works insurance', desc: 'Protecting your project from damage during construction.', href: '/guides/contract-works-insurance-guide' },
      { title: 'Professional indemnity for builders', desc: 'When you need PI cover and what it protects against.', href: '/guides/professional-indemnity-insurance-builders' },
      { title: 'Tools insurance for tradies', desc: 'Covering your tools against theft, loss and damage.', href: '/guides/tools-insurance-tradies' },
      { title: 'Workers compensation in construction', desc: 'Your obligations as an employer in the construction industry.', href: '/guides/workers-compensation-insurance-construction' },
    ]
  },
  {
    category: 'Trade specific',
    items: [
      { title: 'Electrician insurance Australia', desc: 'Insurance requirements and costs for licensed electricians.', href: '/guides/insurance-electrician-australia' },
      { title: 'Plumber insurance Australia', desc: 'What insurance plumbers need and how to get the best deal.', href: '/guides/insurance-plumber-australia' },
    ]
  },
]

export default function GuidesContent() {
  return (
    <section style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 5%' }}>
      <div className="section-label">Resources</div>
      <h1 style={{
        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
        fontWeight: 800, letterSpacing: '-0.04em',
        lineHeight: 1.1, marginBottom: '1rem',
      }}>
        Insurance guides for builders & tradies
      </h1>
      <p style={{ color: '#8faabf', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '560px', marginBottom: '4rem' }}>
        Plain English guides to construction and trades insurance in Australia. No jargon, no upselling — just the information you need.
      </p>

      {GUIDES.map(group => (
        <div key={group.category} style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#f59e0b', marginBottom: '1.5rem',
          }}>{group.category}</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {group.items.map(guide => (
              <a key={guide.href} href={guide.href} style={{
                background: '#1a2733',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                textDecoration: 'none',
                display: 'block',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{
                  fontWeight: 600, fontSize: '0.95rem',
                  color: '#ffffff', marginBottom: '0.4rem',
                }}>{guide.title}</div>
                <div style={{
                  fontSize: '0.85rem', color: '#8faabf', lineHeight: 1.5,
                }}>{guide.desc}</div>
                <div style={{
                  fontSize: '0.8rem', color: '#f59e0b',
                  marginTop: '0.75rem', fontWeight: 500,
                }}>Read guide →</div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}