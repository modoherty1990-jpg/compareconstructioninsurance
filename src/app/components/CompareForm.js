'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TOTAL_STEPS = 5
const MIN_SCORE = 3
const MAX_COMPARE = 3

const STEPS = [
  {
    id: 1,
    question: 'What type of work do you do?',
    hint: 'Select the option that best describes your trade or role.',
    field: 'trade',
    multi: false,
    options: [
      { value: 'builder', label: 'Builder / Contractor', help: 'New builds, renovations' },
      { value: 'tradie', label: 'Tradie', help: 'Plumber, electrician, tiler…' },
      { value: 'subcontractor', label: 'Subcontractor', help: 'Working under a head contractor' },
      { value: 'civil', label: 'Civil / Infrastructure', help: 'Roads, earthworks, utilities' },
      { value: 'consultant', label: 'Consultant / Designer', help: 'Architect, engineer, PM' },
      { value: 'developer', label: 'Developer', help: 'Residential or commercial development' },
      { value: 'owner_builder', label: 'Owner Builder', help: 'Building your own home' },
      { value: 'not_sure', label: 'Not sure', help: "We'll help you figure it out" },
    ],
  },
  {
    id: 2,
    question: 'What cover do you need?',
    hint: "Select all that apply — you can add more later.",
    field: 'cover',
    multi: true,
    options: [
      { value: 'public_liability', label: 'Public Liability', help: 'Third-party injury & damage' },
      { value: 'contract_works', label: 'Contract Works', help: 'Works in progress, materials' },
      { value: 'professional_indemnity', label: 'Professional Indemnity', help: 'Design errors & advice' },
      { value: 'tools', label: 'Tools & Equipment', help: 'Theft, damage, loss' },
      { value: 'workers_comp', label: "Workers' Compensation", help: 'Employee injury & illness' },
      { value: 'home_warranty', label: 'Home Warranty', help: 'Residential statutory warranty' },
      { value: 'not_sure', label: 'Not sure', help: "Show me what's relevant" },
    ],
  },
  {
    id: 3,
    question: 'How big is your business?',
    hint: 'This helps us match brokers who specialise in businesses your size.',
    field: 'size',
    multi: false,
    twoCol: true,
    options: [
      { value: 'sole_trader', label: 'Just me', help: 'Sole trader / ABN holder' },
      { value: 'small', label: 'Small team', help: '2–5 employees' },
      { value: 'medium', label: 'Medium business', help: '6–20 employees' },
      { value: 'large', label: 'Large business', help: '20+ employees' },
    ],
  },
  {
    id: 4,
    question: "What's your annual revenue?",
    hint: "A rough estimate is fine. Helps us match you to brokers who work with your size of business.",
    field: 'revenue',
    multi: false,
    twoCol: true,
    options: [
      { value: 'under_250k', label: 'Under $250k', help: 'Start-up or part-time trade' },
      { value: '250k_1m', label: '$250k – $1m', help: 'Established sole trader or small team' },
      { value: '1m_5m', label: '$1m – $5m', help: 'Growing or medium-sized business' },
      { value: 'over_5m', label: 'Over $5m', help: 'Large contractor or developer' },
    ],
  },
  {
    id: 5,
    question: 'Where are you based?',
    hint: "Some brokers are state-specific. We'll only show you relevant matches.",
    field: 'state',
    multi: false,
    fourCol: true,
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

  // Trade match — most important signal (max 4)
  if (trade && broker.trade_tags) {
    if (Array.isArray(broker.trade_tags) && broker.trade_tags.includes(trade)) score += 4
    else if (trade === 'not_sure') score += 1
  }

  // Cover match — up to 2 points per cover type matched, max 4
  if (cover.length > 0 && broker.cover_tags && Array.isArray(broker.cover_tags)) {
    const matched = cover.filter(c => c !== 'not_sure' && broker.cover_tags.includes(c))
    score += Math.min(matched.length * 2, 4)
  }

  // Size match (max 3)
  if (size && broker.size_tags) {
    if (Array.isArray(broker.size_tags) && broker.size_tags.includes(size)) score += 3
  }

  // State match (max 2) — national brokers only score if they also match on trade or size
  if (state && broker.states_fit) {
    const stateMatch = broker.states_fit === 'national'
      ? (score >= 4) // national brokers only get state bonus if they already have a real match
      : broker.states_fit.includes(state)
    if (stateMatch) score += 2
  }

  // specialist_bonus and priority used only as tiebreaker — not counted toward MIN_SCORE threshold
  const tiebreaker = (broker.specialist_bonus ? 0.5 : 0) + (broker.priority || 0) * 0.02
  score += tiebreaker

  return score
}

const checkSvg = (
  <svg viewBox="0 0 10 10" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10, flexShrink: 0 }}>
    <polyline points="1,5 4,8 9,2" />
  </svg>
)

const coverLabels = {
  public_liability: 'Public Liability',
  contract_works: 'Contract Works',
  professional_indemnity: 'Prof. Indemnity',
  tools: 'Tools & Equipment',
  workers_comp: "Workers' Comp",
  home_warranty: 'Home Warranty',
}

export default function CompareForm() {
  const [journeyActive, setJourneyActive] = useState(false)
  const [view, setView] = useState('questions') // 'questions' | 'results' | 'compare'
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [brokers, setBrokers] = useState([])
  const [results, setResults] = useState(null)
  const [notMatched, setNotMatched] = useState([])
  const [loading, setLoading] = useState(false)
  const [compareList, setCompareList] = useState([])

  // Fetch brokers on mount
  useEffect(() => {
    async function fetchBrokers() {
      const { data } = await supabase
        .from('brokers')
        .select('*')
        .eq('hidden', false)
      if (data) setBrokers(data)
    }
    fetchBrokers()
  }, [])

  // Listen for startJourney event (from Hero / Header)
  useEffect(() => {
    const handler = () => {
      setJourneyActive(true)
      setView('questions')
      setCurrentStep(1)
      setFormData({})
      setResults(null)
      setNotMatched([])
      setCompareList([])
    }
    document.addEventListener('startJourney', handler)
    return () => document.removeEventListener('startJourney', handler)
  }, [])

  // Escape key to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && journeyActive) closeJourney()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [journeyActive])

  // Lock body scroll when journey is open
  useEffect(() => {
    document.body.style.overflow = journeyActive ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [journeyActive])

  function closeJourney() {
    setJourneyActive(false)
    setView('questions')
    setCurrentStep(1)
    setFormData({})
    setResults(null)
    setNotMatched([])
    setCompareList([])
  }

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
    await new Promise(r => setTimeout(r, 900))

    const scored = brokers.map(b => ({ ...b, score: scoreBroker(b, formData) }))
    scored.sort((a, b) => b.score - a.score)

    const matched = scored.filter(b => b.score >= MIN_SCORE)
    const unmatched = scored.filter(b => b.score < MIN_SCORE).slice(0, 4)

    setResults(matched)
    setNotMatched(unmatched)
    setLoading(false)
    setView('results')
  }

  function toggleCompare(broker) {
    setCompareList(prev => {
      const exists = prev.find(b => b.id === broker.id)
      if (exists) return prev.filter(b => b.id !== broker.id)
      if (prev.length >= MAX_COMPARE) return [...prev.slice(1), broker]
      return [...prev, broker]
    })
  }

  const pct = Math.round((currentStep / TOTAL_STEPS) * 100)
  const stepNames = ['Trade type', 'Cover types', 'Business size', 'Annual revenue', 'Location']

  if (!journeyActive) return null

  // ── OVERLAY WRAPPER ──
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0f1923',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Close button */}
      <button
        onClick={closeJourney}
        style={{
          position: 'fixed', top: '18px', right: '5%', zIndex: 1001,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#94a3b8', borderRadius: '8px',
          padding: '7px 14px', cursor: 'pointer',
          fontSize: '0.82rem', fontFamily: 'var(--font-dm), sans-serif',
          display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
        Close
      </button>

      {/* ── QUESTIONS VIEW ── */}
      {view === 'questions' && !loading && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 5% 60px',
        }}>
          {/* Progress */}
          <div style={{ width: '100%', maxWidth: '620px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f59e0b' }}>
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                {stepNames[currentStep - 1]}
              </span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '100px',
                background: 'linear-gradient(90deg, #f59e0b, #fcd34d)',
                width: `${pct}%`,
                transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>
          </div>

          {/* Question card */}
          {STEPS.map(step => currentStep === step.id && (
            <div key={step.id} style={{
              width: '100%', maxWidth: '620px',
              background: '#1a2733',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: '40px',
              animation: 'fadeUp 0.4s ease both',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-jakarta), sans-serif',
                fontSize: 'clamp(1.3rem, 2.5vw, 1.5rem)',
                fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2,
                marginBottom: '8px', color: '#fff',
              }}>{step.question}</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '28px' }}>{step.hint}</p>

              {step.multi && (
                <p style={{
                  fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{
                    display: 'inline-block', width: '14px', height: '14px',
                    border: '1.5px solid #94a3b8', borderRadius: '3px', flexShrink: 0,
                  }} />
                  Select one or more
                </p>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: step.fourCol
                  ? 'repeat(4, 1fr)'
                  : step.twoCol
                  ? '1fr 1fr'
                  : 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '10px',
                marginBottom: '32px',
              }}>
                {step.options.map(opt => {
                  const selected = isSelected(step.field, opt.value, step.multi)
                  return (
                    <button
                      key={opt.value}
                      onClick={() => selectOption(step.field, opt.value, step.multi)}
                      style={{
                        background: selected ? 'rgba(245,158,11,0.1)' : '#243447',
                        border: `1.5px solid ${selected ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '12px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: '#fff',
                        fontFamily: 'var(--font-dm), sans-serif',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.background = '#2c3f52' } }}
                      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = '#243447' } }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block', lineHeight: 1.3 }}>{opt.label}</span>
                      {opt.help && (
                        <span style={{ fontSize: '0.74rem', color: selected ? 'rgba(245,158,11,0.65)' : '#94a3b8', display: 'block', marginTop: '3px' }}>{opt.help}</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep(s => s - 1)}
                    style={{
                      background: 'none', border: 'none', color: '#94a3b8',
                      fontFamily: 'var(--font-dm), sans-serif',
                      fontSize: '0.88rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 7H3M6 10l-3-3 3-3"/></svg>
                    Back
                  </button>
                ) : (
                  <button
                    onClick={closeJourney}
                    style={{
                      background: 'none', border: 'none', color: '#94a3b8',
                      fontFamily: 'var(--font-dm), sans-serif',
                      fontSize: '0.88rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 7H3M6 10l-3-3 3-3"/></svg>
                    Back
                  </button>
                )}

                {currentStep < TOTAL_STEPS ? (
                  <button
                    onClick={() => canProceed(currentStep) && setCurrentStep(s => s + 1)}
                    disabled={!canProceed(currentStep)}
                    style={{
                      background: '#f59e0b', color: '#0f1923',
                      fontFamily: 'var(--font-jakarta), sans-serif',
                      fontSize: '0.9rem', fontWeight: 700,
                      padding: '12px 28px', borderRadius: '12px',
                      border: 'none', cursor: canProceed(currentStep) ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      opacity: canProceed(currentStep) ? 1 : 0.4,
                      transition: 'all 0.18s',
                    }}
                  >
                    Next
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h8M8 4l3 3-3 3"/></svg>
                  </button>
                ) : (
                  <button
                    onClick={() => canProceed(currentStep) && submitForm()}
                    disabled={!canProceed(currentStep)}
                    style={{
                      background: '#f59e0b', color: '#0f1923',
                      fontFamily: 'var(--font-jakarta), sans-serif',
                      fontSize: '0.9rem', fontWeight: 700,
                      padding: '12px 28px', borderRadius: '12px',
                      border: 'none', cursor: canProceed(currentStep) ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      opacity: canProceed(currentStep) ? 1 : 0.4,
                      transition: 'all 0.18s',
                    }}
                  >
                    Show my matches
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h8M8 4l3 3-3 3"/></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── LOADING VIEW ── */}
      {loading && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 5%',
          textAlign: 'center',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            border: '3px solid rgba(245,158,11,0.15)',
            borderTopColor: '#f59e0b',
            animation: 'spin 0.75s linear infinite',
            margin: '0 auto 24px',
          }} />
          <h3 style={{ fontFamily: 'var(--font-jakarta), sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
            Matching brokers to your profile…
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Checking {brokers.length || 17} specialist brokers against your answers
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '24px auto 0' }}>
            {['Checking trade type match', 'Checking cover types', 'Checking business size', 'Checking revenue range', 'Checking state coverage'].map((txt, i) => (
              <div key={txt} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '0.85rem', color: '#94a3b8',
                animation: `fadeUp 0.4s ease both ${i * 0.25}s`,
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
                {txt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULTS VIEW ── */}
      {view === 'results' && !loading && results && (
        <div style={{ padding: '80px 5% 140px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '6px' }}>
                  Your matches
                </div>
                <h2 style={{ fontFamily: 'var(--font-jakarta), sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  {results.length === 0
                    ? "We couldn't find a close match"
                    : results.length === 1
                    ? '1 broker matched your profile'
                    : `${results.length} brokers matched your profile`}
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '6px' }}>
                  Sorted by best fit ·{' '}
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Matched to your trade, cover, size, revenue &amp; state</span>
                </p>
              </div>
              <button
                onClick={() => setView('questions')}
                style={{
                  background: 'none', border: 'none', color: '#94a3b8',
                  fontFamily: 'var(--font-dm), sans-serif',
                  fontSize: '0.88rem', cursor: 'pointer', marginTop: '8px',
                  display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 7H3M6 10l-3-3 3-3"/></svg>
                Edit answers
              </button>
            </div>

            {/* Broker cards */}
            {results.length === 0 ? (
              <div style={{ padding: '40px', background: '#1a2733', borderRadius: '20px', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Try selecting fewer cover types or choose "Not sure" to widen the search.</p>
                <button onClick={() => setView('questions')} style={{ background: '#f59e0b', color: '#0f1923', border: 'none', borderRadius: '10px', padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif' }}>
                  Edit answers
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {results.map((broker, idx) => {
                  const inCompare = compareList.some(b => b.id === broker.id)
                  const covers = broker.cover_tags || []
                  return (
                    <div key={broker.id} style={{
                      background: '#1a2733',
                      border: `1.5px solid ${inCompare ? 'rgba(99,102,241,0.5)' : idx === 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '20px',
                      padding: '24px 28px',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '20px',
                      alignItems: 'start',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: `fadeUp 0.4s ease both ${idx * 0.07}s`,
                    }}>
                      {/* Left accent bar for top match */}
                      {idx === 0 && (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59e0b' }} />
                      )}
                      <div style={{ paddingLeft: idx === 0 ? '8px' : 0 }}>
                        {idx === 0 && (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            background: 'rgba(245,158,11,0.15)',
                            border: '1px solid rgba(245,158,11,0.35)',
                            color: '#f59e0b', fontSize: '0.68rem', fontWeight: 700,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            padding: '3px 10px', borderRadius: '100px',
                            marginBottom: '10px',
                          }}>★ Closest match</div>
                        )}
                        <div style={{ fontFamily: 'var(--font-jakarta), sans-serif', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                          {broker.name}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#f59e0b', fontWeight: 500, marginBottom: '14px' }}>
                          {broker.specialty} · {broker.states_fit === 'national' ? 'National' : broker.states_fit}
                        </div>

                        {/* Cover pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                          {covers.slice(0, 5).map(c => (
                            <span key={c} style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              background: 'rgba(16,185,129,0.12)',
                              border: '1px solid rgba(16,185,129,0.2)',
                              color: '#10b981', fontSize: '0.74rem', fontWeight: 600,
                              padding: '4px 10px', borderRadius: '100px',
                            }}>
                              {checkSvg}{coverLabels[c] || c}
                            </span>
                          ))}
                        </div>

                        {/* Meta */}
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          {broker.description && (
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                              {broker.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '160px' }}>
                        {broker.website && (
                          <a
                            href={broker.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => window.gtag && window.gtag('event', 'broker_click', { broker_name: broker.name, click_type: 'website' })}
                            style={{
                              background: '#f59e0b', color: '#0f1923',
                              fontFamily: 'var(--font-jakarta), sans-serif',
                              fontSize: '0.84rem', fontWeight: 700,
                              padding: '11px 20px', borderRadius: '12px',
                              textDecoration: 'none', textAlign: 'center',
                              display: 'block', transition: 'all 0.18s',
                            }}
                          >
                            Visit website →
                          </a>
                        )}
                        {broker.phone && broker.show_phone !== false && (
                          <a
                            href={`tel:${broker.phone}`}
                            onClick={() => window.gtag && window.gtag('event', 'broker_click', { broker_name: broker.name, click_type: 'phone' })}
                            style={{
                              background: 'transparent',
                              border: '1.5px solid rgba(255,255,255,0.08)',
                              color: '#cbd5e1',
                              fontFamily: 'var(--font-dm), sans-serif',
                              fontSize: '0.8rem', fontWeight: 500,
                              padding: '9px 16px', borderRadius: '12px',
                              textDecoration: 'none', textAlign: 'center',
                              display: 'block',
                            }}
                          >
                            📞 {broker.phone}
                          </a>
                        )}
                        <button
                          onClick={() => toggleCompare(broker)}
                          style={{
                            background: 'transparent',
                            border: `1.5px solid ${inCompare ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                            color: inCompare ? '#a5b4fc' : '#94a3b8',
                            fontFamily: 'var(--font-dm), sans-serif',
                            fontSize: '0.8rem', fontWeight: 600,
                            padding: '9px 16px', borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            justifyContent: 'center',
                            background: inCompare ? 'rgba(99,102,241,0.08)' : 'transparent',
                            transition: 'all 0.18s',
                          }}
                        >
                          <span style={{
                            width: '14px', height: '14px', borderRadius: '3px',
                            border: '1.5px solid currentColor',
                            display: 'inline-block', position: 'relative', flexShrink: 0,
                          }} />
                          {inCompare ? 'Added' : 'Add to compare'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Not matched */}
            {notMatched.length > 0 && (
              <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'var(--font-jakarta), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                  Also on our platform — not matched for your answers
                </div>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.6 }}>
                  These brokers are listed but didn&apos;t score highly enough for your profile. We show you the reason so you can decide whether to reach out directly.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notMatched.map(broker => (
                    <div key={broker.id} style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: '16px',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>{broker.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)', marginTop: '3px' }}>{broker.specialty}</div>
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(148,163,184,0.7)',
                        fontSize: '0.72rem', fontWeight: 600,
                        padding: '4px 10px', borderRadius: '100px',
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        Low match score
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.7, marginBottom: '20px' }}>
                This tool matches brokers to your answers. It is not financial advice. Every broker listed holds an AFSL or operates as an authorised representative — verify credentials at{' '}
                <a href="https://moneysmart.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b' }}>moneysmart.gov.au</a>.
              </p>
              <button
                onClick={closeJourney}
                style={{
                  background: 'transparent', color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '10px 24px', borderRadius: '10px',
                  cursor: 'pointer', fontSize: '0.875rem',
                  fontFamily: 'var(--font-dm), sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                ← Back to homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPARE BAR ── */}
      {view === 'results' && compareList.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#1a2733',
          borderTop: '1px solid rgba(99,102,241,0.25)',
          padding: '14px 5%',
          display: 'flex', alignItems: 'center', gap: '20px',
          zIndex: 1002,
        }}>
          <div style={{ fontSize: '0.88rem', color: '#94a3b8', flex: 1 }}>
            <strong style={{ color: '#fff' }}>{compareList.length}</strong> brokers selected to compare
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '120px', height: '40px',
                background: compareList[i] ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
                border: `1.5px ${compareList[i] ? 'solid rgba(99,102,241,0.4)' : 'dashed rgba(99,102,241,0.3)'}`,
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: compareList[i] ? '0.72rem' : '0.72rem',
                color: compareList[i] ? '#a5b4fc' : '#818cf8',
                fontWeight: 600,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                padding: '0 8px',
              }}>
                {compareList[i] ? compareList[i].name : '+ Add broker'}
              </div>
            ))}
          </div>
          <button
            onClick={() => setView('compare')}
            style={{
              background: '#6366f1', color: '#fff',
              fontFamily: 'var(--font-jakarta), sans-serif',
              fontSize: '0.88rem', fontWeight: 700,
              padding: '11px 24px', borderRadius: '12px',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            Compare now
          </button>
          <button
            onClick={() => setCompareList([])}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', padding: '6px' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* ── COMPARE VIEW (side by side) ── */}
      {view === 'compare' && (
        <div style={{ padding: '80px 5% 60px' }}>
          <button
            onClick={() => setView('results')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: '#94a3b8', fontSize: '0.88rem',
              background: 'none', border: 'none', cursor: 'pointer',
              marginBottom: '32px', padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 7H3M6 10l-3-3 3-3"/></svg>
            Back to results
          </button>

          <h2 style={{ fontFamily: 'var(--font-jakarta), sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Side-by-side comparison
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '36px' }}>
            Comparing your selected brokers across coverage types, trade focus, and business size.
          </p>

          <div style={{ overflowX: 'auto', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '24px 20px', textAlign: 'left', background: 'rgba(15,25,35,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '180px', minWidth: '180px', verticalAlign: 'top' }} />
                  {compareList.map((broker, idx) => (
                    <th key={broker.id} style={{ padding: '24px 20px', textAlign: 'center', background: '#1a2733', borderBottom: '1px solid rgba(255,255,255,0.08)', verticalAlign: 'top', borderTop: idx === 0 ? '2px solid #f59e0b' : 'none' }}>
                      {idx === 0 && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b', fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', marginBottom: '8px' }}>
                          ★ Top match
                        </div>
                      )}
                      <div style={{ fontFamily: 'var(--font-jakarta), sans-serif', fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>{broker.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginBottom: '10px' }}>{broker.specialty}</div>
                      <span style={{ display: 'inline-block', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontSize: '0.63rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {broker.states_fit === 'national' ? 'National' : broker.states_fit}
                      </span>
                      <div style={{ marginTop: '14px' }}>
                        {broker.website && (
                          <a href={broker.website} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', background: '#f59e0b', color: '#0f1923', fontFamily: 'var(--font-jakarta), sans-serif', fontSize: '0.8rem', fontWeight: 700, padding: '9px 14px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center' }}>
                            Visit website →
                          </a>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Cover types */}
                <tr>
                  <td colSpan={compareList.length + 1} style={{ padding: '10px 20px 6px', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', background: 'rgba(15,25,35,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    Cover Types
                  </td>
                </tr>
                {['public_liability', 'contract_works', 'professional_indemnity', 'tools', 'workers_comp', 'home_warranty'].map(cover => (
                  <tr key={cover} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '13px 20px', fontSize: '0.88rem', color: '#cbd5e1', background: 'rgba(15,25,35,0.3)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                      <strong style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{coverLabels[cover]}</strong>
                    </td>
                    {compareList.map((broker, idx) => {
                      const has = (broker.cover_tags || []).includes(cover)
                      return (
                        <td key={broker.id} style={{ padding: '13px 20px', textAlign: 'center', background: idx === 0 ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                          {has ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.4)' }}>
                              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,7 6,11 12,3"/></svg>
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%' }}>
                              <span style={{ width: '12px', height: '2px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', display: 'block' }} />
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Trade types */}
                <tr>
                  <td colSpan={compareList.length + 1} style={{ padding: '10px 20px 6px', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', background: 'rgba(15,25,35,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    Trade Specialisations
                  </td>
                </tr>
                {[
                  { key: 'builder', label: 'Builders / Contractors' },
                  { key: 'tradie', label: 'Tradies' },
                  { key: 'subcontractor', label: 'Subcontractors' },
                  { key: 'civil', label: 'Civil / Infrastructure' },
                  { key: 'developer', label: 'Developers' },
                  { key: 'owner_builder', label: 'Owner Builders' },
                ].map(({ key, label }) => (
                  <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '13px 20px', fontSize: '0.88rem', color: '#cbd5e1', background: 'rgba(15,25,35,0.3)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                      <strong style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{label}</strong>
                    </td>
                    {compareList.map((broker, idx) => {
                      const has = (broker.trade_tags || []).includes(key)
                      return (
                        <td key={broker.id} style={{ padding: '13px 20px', textAlign: 'center', background: idx === 0 ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                          {has ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.4)' }}>
                              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,7 6,11 12,3"/></svg>
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%' }}>
                              <span style={{ width: '12px', height: '2px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', display: 'block' }} />
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Size */}
                <tr>
                  <td colSpan={compareList.length + 1} style={{ padding: '10px 20px 6px', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', background: 'rgba(15,25,35,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    Business Size
                  </td>
                </tr>
                {[
                  { key: 'sole_trader', label: 'Sole Trader' },
                  { key: 'small', label: 'Small (2–5)' },
                  { key: 'medium', label: 'Medium (6–20)' },
                  { key: 'large', label: 'Large (20+)' },
                ].map(({ key, label }) => (
                  <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '13px 20px', fontSize: '0.88rem', color: '#cbd5e1', background: 'rgba(15,25,35,0.3)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                      <strong style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{label}</strong>
                    </td>
                    {compareList.map((broker, idx) => {
                      const has = (broker.size_tags || []).includes(key)
                      return (
                        <td key={broker.id} style={{ padding: '13px 20px', textAlign: 'center', background: idx === 0 ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                          {has ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.4)' }}>
                              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,7 6,11 12,3"/></svg>
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%' }}>
                              <span style={{ width: '12px', height: '2px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', display: 'block' }} />
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px', padding: '14px 20px', background: '#1a2733', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.4)', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,7 6,11 12,3"/></svg>
              </span>
              Specialises in this
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0 }}>
                <span style={{ width: '12px', height: '2px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', display: 'block' }} />
              </span>
              Not a focus area
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
