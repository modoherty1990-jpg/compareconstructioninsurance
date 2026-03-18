'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function GuidesContent() {
  const [guides, setGuides] = useState([])

  useEffect(() => {
    async function fetchGuides() {
      const { data } = await supabase
        .from('guides')
        .select('slug, title, description, category')
        .eq('published', true)
        .order('created_at', { ascending: false })
      if (data) setGuides(data)
    }
    fetchGuides()
  }, [])

  const grouped = guides.reduce((acc, guide) => {
    const cat = guide.category || 'General guides'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(guide)
    return acc
  }, {})

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
        Plain English guides to construction and trades insurance in Australia. Written for tradies, not lawyers.
      </p>

      {guides.length === 0 && (
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>More guides coming soon.</p>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#f59e0b', marginBottom: '1.5rem',
          }}>{category}</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {items.map(guide => (
              <a key={guide.slug} href={`/guides/${guide.slug}`} style={{
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