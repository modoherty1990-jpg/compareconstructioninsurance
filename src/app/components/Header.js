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

  const links = [
    { label: 'Compare', href: '#compare' },
    { label: 'Brokers', href: '#brokers' },
    { label: 'Why Us', href: '#why' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Guides', href: '/guides' },
  ]

  return (
    <>
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

        <a href="/" style={{
          lineHeight: 1, display: 'flex', flexDirection: 'column',
          gap: '3px', textDecoration: 'none',
        }}>
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

        <ul className="desktop-nav" style={{
          display: 'flex', gap: '2rem', listStyle: 'none',
          margin: 0, padding: 0,
        }}>
          {links.map(link => (
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

        <a href="#compare" className="btn-primary desktop-cta" style={{
          padding: '8px 20px', fontSize: '0.875rem',
        }}>
          Compare Now
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger"
          style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '8px',
            display: 'flex', flexDirection: 'column',
            gap: '5px',
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#ffffff', borderRadius: '2px',
            transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#ffffff', borderRadius: '2px',
            transition: 'all 0.3s',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#ffffff', borderRadius: '2px',
            transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }} />
        </button>

      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          background: '#0f1923',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          zIndex: 99,
          padding: '1.5rem 5%',
          display: 'flex', flexDirection: 'column',
        }}>
          {links.map(link => (
            <a key={link.label} href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#cbd5e1', textDecoration: 'none',
                fontSize: '1rem', fontWeight: 500,
                padding: '1rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >{link.label}</a>
          ))}
          <a href="#compare" className="btn-primary"
            style={{ marginTop: '1.5rem', textAlign: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Compare Now
          </a>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .desktop-cta { display: inline-block !important; }
        .hamburger { display: none !important; }

        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}