'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Is this service really free?',
    a: 'Yes — completely free for tradies and builders. We may receive a referral fee from brokers when you make contact, but this never influences your match results. You will never pay more for your insurance by using this service.',
  },
  {
    q: 'How do you match me with brokers?',
    a: 'We score every broker in our directory against your answers — trade type, cover needed, business size, revenue and state. Only brokers who score above a minimum threshold appear in your results. You can read exactly how the scoring works on our how matching works page.',
  },
  {
    q: 'Do you provide financial advice?',
    a: 'No. This is a filtering and referral tool, not a financial advice service. We help you find brokers who are relevant to your profile — the broker you contact will assess your specific needs and provide appropriate advice. Always read a broker\'s Financial Services Guide before proceeding.',
  },
  {
    q: 'What if I\'m not sure what cover I need?',
    a: 'Select "Not sure" in the cover step and we\'ll match you with brokers who offer broad construction coverage and can advise you on what\'s right for your trade. That\'s exactly what a good broker is for.',
  },
  {
    q: 'Are all brokers licensed?',
    a: 'Every broker listed is either an AFSL holder or an authorised representative of an AFSL holder. You can verify any broker\'s credentials at moneysmart.gov.au using their name or AFSL number.',
  },
  {
    q: 'How quickly will a broker get back to me?',
    a: 'That depends on the broker — most aim to respond within one business day. If you need cover urgently, mention that when you make contact. Many brokers can arrange same-day certificates of currency for standard covers.',
  },
  {
    q: 'Can I compare actual policy prices on this site?',
    a: 'Not yet — we match you to specialist brokers rather than comparing policy prices directly. A specialist broker will often get you a better price than any online comparison tool because they can negotiate with underwriters on your behalf.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" style={{ background: '#1a2733' }}>
      <div className="section-label">FAQ</div>
      <h2 className="section-title">Common questions</h2>
      <p className="section-sub">
        Everything you need to know before you compare.
      </p>

      <div style={{
        maxWidth: '720px',
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {FAQS.map((faq, idx) => (
          <div key={idx} style={{
            background: '#0f1923',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              style={{
                width: '100%', textAlign: 'left',
                padding: '1.25rem 1.5rem',
                background: 'transparent', border: 'none',
                cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                gap: '1rem',
              }}
            >
              <span style={{
                fontSize: '0.95rem', fontWeight: 600,
                color: '#ffffff', lineHeight: 1.4,
              }}>{faq.q}</span>
              <span style={{
                color: '#f59e0b', fontSize: '1.2rem',
                flexShrink: 0, transition: 'transform 0.2s',
                transform: open === idx ? 'rotate(45deg)' : 'rotate(0deg)',
              }}>+</span>
            </button>

            {open === idx && (
              <div style={{
                padding: '0 1.5rem 1.25rem',
                fontSize: '0.9rem', color: '#8faabf',
                lineHeight: 1.7,
                animation: 'fadeUp 0.2s ease both',
              }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}