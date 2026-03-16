'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

const TOTAL_STEPS = 5
const MIN_SCORE = 3

const STEPS = [
  {
    id: 1,
    question: 'What best describes your business?',
    hint: 'Select the option that closest matches your work',
    field: 'trade',
    multi: false,
    options: [
      { value: 'builder', label: 'Licensed builder', help: 'Residential or commercial construction' },
      { value: 'tradie', label: 'Sole trader / tradie', help: 'Self-employed, working on the tools' },
      { value: 'subcontractor', label: 'Subcontractor', help: 'Working under a head contractor' },
      { value: 'civil', label: 'Civil contractor', help: 'Roads, earthworks, infrastructure' },
      { value: 'consultant', label: 'Design / consultant', help: 'Architect, engineer, project manager' },
      { value: 'developer', label: 'Property developer', help: 'Developing land or buildings' },
      { value: 'owner_builder', label: 'Owner builder', help: 'Building your own home' },
      { value: 'not_sure', label: 'Not sure', help: 'Help me figure it out' },
    ],
  },
  {
    id: 2,
    question: 'What cover do you need?',
    hint: "Select all that apply — we'll match brokers who cover everything you need",
    field: 'cover',
    multi: true,
    options: [
      { value: 'public_liability', label: 'Public liability', help: 'Covers injury or damage caused to others' },
      { value: 'contract_works', label: 'Contract works', help: 'Covers damage to the project under construction' },
      { value: 'professional_indemnity', label: 'Professional indemnity', help: 'Covers errors in advice or design' },
      { value: 'tools', label: 'Tools & equipment', help: 'Covers theft or damage to your tools' },
      { value: 'workers_comp', label: 'Workers compensation', help: 'Mandatory if you employ staff' },
      { value: 'home_warranty', label: 'Home warranty', help: 'Required for residential builds in most states' },
      { value: 'not_sure', label: 'Not sure', help: "Show me what's relevant for my trade" },
    ],
  },
  {
    id: 3,
    question: 'How big is your business?',
    hint: 'Include employees and regular subcontractors',
    field: 'size',
    multi: false,
    options: [
      { value: 'sole_trader', label: 'Just me', help: 'Sole trader, no employees' },
      { value: 'small', label: '2-5 people', help: 'Small team or a few subbies' },
      { value: 'medium', label: '6-20 people', help: 'Growing business' },
      { value: 'large', label: '20+ people', help: 'Established company' },
    ],
  },
  {
    id: 4,
    question: "What's your annual revenue?",
    hint: "An estimate is fine — this helps match you to brokers who work with your size",
    field: 'revenue',
    multi: false,
    options: [
      { value: 'under_250k', label: 'Under $250k' },
      { value: '250k_1m', label: '$250k - $1m' },
      { value: '1m_5m', label: '$1m - $5m' },
      { value: 'over_5m', label: 'Over $5m' },
    ],
  },
  {
    id: 5,
    question: 'Which state are you based in?',
    hint: 'Some brokers specialise in specific states and home warranty requirements vary by state',
    field: 'state',
    multi: false,
    options: [
      { value: 'NSW', label: 'NSW' },
      { value: 'VIC', label: 'VIC' },
      { value: 'QLD', label: 'QLD' },
      { value: 'WA', label: 'WA' },
      { value: 'SA', label: 'SA' },
      { value: 'TAS', label: 'TAS' },
      { value: 'ACT', label: 'ACT' },
      { value: 'NT', label: 'NT' },
    ],
  },
]

function scoreBroker(broker, formData) {
  let score = 0
  const trade = formData.trade
  const cover = formData.cover || []
  const size = formData.size
  const state = formData.state

  const tradeTags = Array.isArray(broker.trade_tags) ? broker.trade_tags : []
  const coverTags = Array.isArray(broker.cover_tags) ? broker.cover_tags : []
  const sizeTags = Array.isArray(broker.size_tags) ? broker.size_tags : []

  if (trade) {
    if (tradeTags.includes(trade)) score += 4
    else if (trade === 'not_sure') score += 2
  }

  if (cover.length > 0) {
    const matched = cover.filter(c => coverTags.includes(c))
    score += Math.min(matched.length * 2, 4)
    if (cover.includes('not_sure')) score += 1
  }

  if (size) {
    if (sizeTags.includes(size)) score += 3
  }

  if (state && broker.states_fit) {
    if (broker.states_fit === 'national' || broker.states_fit.includes(state)) score += 2
  }

  if (broker.specialist_bonus) score += 2
  score += (broker.priority || 0) * 0.1

  return score
}

export default function CompareForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [brokers, setBrokers] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchBrokers() {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('hidden', false)
      if (data) setBrokers(data)
      if (error) console.error('Supabase error:', error)
    }
    fetchBrokers()
  }, [])

  function selectOption(field, value, multi) {
    setFormData(prev => {
      if (multi) {
        const current = prev[field] || []
        const updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
        return { ...prev, [field]: updated }
      }
      return { ...prev, [field]: value }
    })
  }

  function isSelected(field, value, multi) {
    if (multi) return (formData[field] || []).includes(value)
    return formData[field] === value
  }

  function canProceed(step) {
    const s = STEPS[step - 1]
    if (s.multi) return (formData[s.field] || []).length > 0
    return !!formData[s.field]
  }

  async function submitForm() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const scored = brokers
      .map(b => ({ ...b, score: scoreBroker(b, formData) }))
      .sort((a, b) => b.score - a.score)
      .filter(b => b.score >= MIN_SCORE)
      .slice(0, 3)

    setResults(scored)
    setLoading(false)
  }

  function restart() {
    setFormData({})
    setCurrentStep(1)
    setResults(null)
    setLoading(false)
  }

  const pct = (currentStep / TOTAL_STEPS) * 100

  return (
    <section id="compare" style={{ background: '#0f1923' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }} className="section-label">
        Find your match
      </div>
      <h2 className="section-title" style={{ textAlign: 'center' }}>
        Find your matched brokers
      </h2>
      <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
        Tell us about your business and we'll match you with the brokers best suited to your trade, size and location.
      </p>

      <div style={{
        maxWidth: '720px', margin: '4rem auto 0',
        background: '#1a2733',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', overflow: 'hidden',
      }}>

        <div style={{
          background: '#243447', padding: '20px 32px',
          display: 'flex', alignItems: 'center', gap: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            flex: 1, height: '4px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '2px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: '#f59e0b', borderRadius: '2px',
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{
            fontSize: '0.8rem', color: '#94a3b8',
            whiteSpace: 'nowrap', fontWeight: 500,
          }}>
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>

        {loading && (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Finding your best matches…</p>
          </div>
        )}

        {!loading && results && (
          <div style={{ padding: '36px 40px 40px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              {results.length === 0
                ? 'No close matches found'
                : results.length === 1
                ? '1 broker matched your profile'
                : `${results.length} brokers matched your profile`}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2rem' }}>
              {results.length === 0
                ? 'Try broadening your cover selection.'
                : 'Based on your trade type, cover needs, size and location'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.map((broker, idx) => (
                <div key={broker.id} style={{
                  background: '#0f1923',
                  border: `1px solid ${idx === 0 ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '12px', padding: '1.5rem',
                  position: 'relative',
                }}>
                  {idx === 0 && (
                    <div style={{
                      position: 'absolute', top: '-1px', left: '1.5rem',
                      background: '#f59e0b', color: '#0f1923',
                      fontSize: '0.7rem', fontWeight: 700,
                      padding: '3px 10px', borderRadius: '0 0 6px 6px',
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>Closest Match</div>
                  )}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginTop: idx === 0 ? '0.75rem' : 0,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{broker.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>✓ Profile match</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '4px', marginBottom: '0.75rem' }}>
                    {broker.specialty}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#8faabf', marginBottom: '0.5rem', lineHeight: 1.6 }}>
                    {broker.description}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.5 }}>
                    This broker covers your trade type and stated insurance needs. Contact them directly to discuss your specific requirements and get a quote.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {broker.phone && (
                      <a href={`tel:${broker.phone}`} style={{
                        background: '#f59e0b', color: '#0f1923',
                        padding: '10px 20px', borderRadius: '8px',
                        fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                      }}>📞 {broker.phone}</a>
                    )}
                    {broker.website && (
                      <a href={broker.website} target="_blank" rel="noopener noreferrer" style={{
                        background: 'transparent', color: '#cbd5e1',
                        padding: '10px 20px', borderRadius: '8px',
                        fontWeight: 500, fontSize: '0.875rem',
                        border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none',
                      }}>Visit website ↗</a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '1.5rem', padding: '1rem',
              background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
            }}>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>
                This tool filters brokers based on the information you provided. It is not financial advice.
                Each broker listed holds an AFSL or is an authorised representative.
                Contact brokers directly to discuss your specific needs.{' '}
                <a href="/how-matching-works" style={{ color: '#94a3b8' }}>How matching works →</a>
              </p>
            </div>

            <button onClick={restart} style={{
              marginTop: '1.5rem', background: 'transparent',
              color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)',
              padding: '10px 24px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '0.875rem',
            }}>← Start again</button>
          </div>
        )}

        {!loading && !results && STEPS.map(step => (
          currentStep === step.id && (
            <div key={step.id} style={{ padding: '36px 40px 40px', animation: 'fadeUp 0.3s ease both' }}>
              <h3 style={{
                fontSize: '1.4rem', fontWeight: 700,
                marginBottom: '0.4rem', letterSpacing: '-0.02em',
              }}>
                {step.question}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2rem' }}>
                {step.hint}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '10px', marginBottom: '2rem',
              }}>
                {step.options.map(opt => {
                  const selected = isSelected(step.field, opt.value, step.multi)
                  return (
                    <div key={opt.value}
                      onClick={() => selectOption(step.field, opt.value, step.multi)}
                      style={{
                        background: selected ? 'rgba(245,158,11,0.12)' : '#0f1923',
                        border: `1.5px solid ${selected ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '12px', padding: '14px 16px',
                        cursor: 'pointer', transition: 'all 0.18s',
                        display: 'flex', flexDirection: 'column', gap: '3px',
                      }}
                    >
                      <span style={{
                        fontSize: '0.9rem', fontWeight: 500,
                        color: selected ? '#ffffff' : '#cbd5e1',
                      }}>
                        {opt.label}
                      </span>
                      {opt.help && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: selected ? 'rgba(255,255,255,0.6)' : '#94a3b8',
                          lineHeight: 1.4,
                        }}>
                          {opt.help}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {currentStep > 1 ? (
                  <button onClick={() => setCurrentStep(s => s - 1)} style={{
                    background: 'transparent', color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '12px 24px', borderRadius: '10px',
                    cursor: 'pointer', fontSize: '0.9rem',
                  }}>← Back</button>
                ) : <div />}

                {currentStep < TOTAL_STEPS ? (
                  <button
                    onClick={() => canProceed(currentStep) && setCurrentStep(s => s + 1)}
                    disabled={!canProceed(currentStep)}
                    style={{
                      background: canProceed(currentStep) ? '#f59e0b' : 'rgba(245,158,11,0.3)',
                      color: canProceed(currentStep) ? '#0f1923' : '#94a3b8',
                      border: 'none', padding: '12px 32px', borderRadius: '10px',
                      cursor: canProceed(currentStep) ? 'pointer' : 'not-allowed',
                      fontWeight: 700, fontSize: '0.95rem',
                      fontFamily: 'var(--font-jakarta), sans-serif',
                      transition: 'all 0.2s',
                    }}>Next →</button>
                ) : (
                  <button
                    onClick={() => canProceed(currentStep) && submitForm()}
                    disabled={!canProceed(currentStep)}
                    style={{
                      background: canProceed(currentStep) ? '#f59e0b' : 'rgba(245,158,11,0.3)',
                      color: canProceed(currentStep) ? '#0f1923' : '#94a3b8',
                      border: 'none', padding: '12px 32px', borderRadius: '10px',
                      cursor: canProceed(currentStep) ? 'pointer' : 'not-allowed',
                      fontWeight: 700, fontSize: '0.95rem',
                      fontFamily: 'var(--font-jakarta), sans-serif',
                      transition: 'all 0.2s',
                    }}>Find My Brokers →</button>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  )
}