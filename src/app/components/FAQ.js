'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Is this really free to use?',
    a: 'Yes, it\'s free for tradies and builders. We may receive a referral fee from a broker if you end up working with them, but this never affects your match results and you won\'t pay a cent more for your insurance.',
  },
  {
    q: 'How do you match me with brokers?',
    a: 'We run your answers through our matching system, which scores every broker against your trade type, cover needs, business size and state. You only see brokers who scored above our minimum threshold, so they\'re actually relevant to your situation.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. This tool helps you find licensed brokers who are relevant to your profile. It\'s not financial advice. The broker you contact is the one who\'ll assess your situation properly. Always read their Financial Services Guide before making any decisions.',
  },
  {
    q: 'I don\'t know what insurance I need. What should I do?',
    a: 'Select \'Not sure\' in the cover step and we\'ll match you with brokers who carry a broad range of construction covers and can work out what\'s right for your trade. That\'s exactly what a good broker is there for.',
  },
  {
    q: 'Are all the brokers on this site licensed?',
    a: 'Yes. Every broker listed is either an AFSL holder or an authorised representative, however we recommend you verify any broker\'s licence at moneysmart.gov.au before proceeding.',
  },
  {
    q: 'How quickly will a broker get back to me?',
    a: 'Most brokers aim to get back to you within one business day. If you need cover urgently, like a certificate of currency before you start a job tomorrow, mention it when you make contact. Most can sort same-day cover for standard policies.',
  },
  {
    q: 'Can I see insurance prices before I contact a broker?',
    a: 'Not yet. We match you to specialist brokers rather than showing live policy prices.',
  },
  {
    q: 'Do I need public liability insurance to work on a construction site?',
    a: 'In most cases yes. Most commercial sites won\'t let you through the gate without it, and most contracts require it before you sign. For some trades like electricians and plumbers in certain states, it\'s also a legal requirement to hold your licence. If you\'re not sure what applies to your trade and state, use our matching tool and a specialist broker can advise you.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" style={{ background: '#1a2733' }}>
      <div className="section-label">FAQ</div>
      <h2 className="section-title">Common questions</h2>
      <p className="section-sub">
        Quick answers to the questions we get asked most.
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