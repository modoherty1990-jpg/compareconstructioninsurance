'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function BrokerDirectory() {
  const [brokers, setBrokers] = useState([])

  useEffect(() => {
    async function fetchBrokers() {
      const { data } = await supabase
        .from('brokers')
        .select('*')
        .eq('hidden', false)
        .order('priority', { ascending: false })
      if (data) setBrokers(data)
    }
    fetchBrokers()
  }, [])

  return (
    <section id="brokers" style={{ background: '#1a2733' }}>
      <div className="section-label">Broker directory</div>
      <h2 className="section-title">Our specialist brokers</h2>
      <p className="section-sub">
        A curated list of specialist construction insurance brokers across Australia.
        Every broker listed holds an AFSL or is an authorised representative.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
        marginTop: '3rem',
      }}>
        {brokers.map(broker => (
          <div key={broker.id} style={{
            background: '#0f1923',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>{broker.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>{broker.specialty}</div>
            <p style={{ fontSize: '0.85rem', color: '#8faabf', lineHeight: 1.6, flex: 1 }}>{broker.description}</p>
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{
                fontSize: '0.75rem', color: '#94a3b8',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '3px 10px', borderRadius: '100px',
              }}>
                {broker.states_fit === 'national' ? '🇦🇺 National' : `📍 ${broker.states_fit}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}