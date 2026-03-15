'use client'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(15,25,35,0.97)' : 'rgba(15,25,35,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0 5%',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '64px',
      transition: 'background 0.3s',
    }}>

      {/* Logo */}
      <a href="/" style={{ lineHeight: 1, display: 'flex', flexDirection: 'column', gap: '3px', textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-jakarta), sans-serif',
          fontSize: '1.2rem', fontWeight: 800,
          letterSpacing: '-0.04em', color: '#ffffff',
        }}>compare</span>
        <span style={{
          fontFamily: 'var(--font-jakarta), sans-serif',
          fontSize: '0.6rem', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#f59e0b',
        }}>construction insurance</span>
      </a>

      {/* Desktop nav */}
      <ul style={{
        display: 'flex', gap: '2rem', listStyle: 'none',
        margin: 0, padding: 0,
      }} className="desktop-nav">
        {[
          { label: 'Compare', href: '#compare' },
          { label: 'Brokers', href: '#brokers' },
          { label: 'Why Us', href: '#why' },
          { label: 'FAQ', href: '#faq' },
          { label: 'Guides', href: '/guides' },
        ].map(link => (
          <li key={link.label}>
            <a href={link.href} style={{
              color: '#cbd5e1', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#ffffff'}
            onMouseLeave={e => e.target.style.color = '#cbd5e1'}
            >{link.label}</a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a href="#compare" className="btn-primary" style={{
        padding: '8px 20px', fontSize: '0.875rem',
      }}>
        Compare Now
      </a>

    </nav>
  )
}