import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabase'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  const { slug } = await params

  const { data } = await supabase
    .from('guides')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Guide not found' }

  return {
    title: `${data.title} | compareconstructioninsurance.com.au`,
    description: data.description,
  }
}

export default async function GuidePage({ params }) {
  const { slug } = await params

  const { data: guide } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!guide) notFound()

  const dateDisplay = new Date(guide.updated_at || guide.created_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px', background: '#0f1923', minHeight: '100vh' }}>
        <article style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 5%' }}>

          <div className="section-label" style={{ marginBottom: '1rem' }}>
            {guide.category}
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 800, letterSpacing: '-0.04em',
            lineHeight: 1.15, marginBottom: '1rem',
          }}>
            {guide.title}
          </h1>

          <p style={{
  fontSize: '0.8rem',
  color: '#64748b',
  marginBottom: '1.5rem',
}}>
  By {guide.author || 'The CCI Team'} · Last updated: {dateDisplay}
</p>

          {guide.description && (
            <p style={{
              fontSize: '1.1rem', color: '#8faabf',
              lineHeight: 1.7, marginBottom: '3rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              {guide.description}
            </p>
          )}

          <div
            style={{
              color: '#cbd5e1',
              lineHeight: 1.8,
              fontSize: '1rem',
            }}
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            background: '#1a2733',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Ready to find a specialist broker?
            </h3>
            <p style={{ color: '#8faabf', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Answer 5 quick questions and get matched to the right broker for your trade.
            </p>
            <a href="/#compare" className="btn-primary">
              Compare brokers →
            </a>
          </div>

        </article>
      </main>
      <Footer />
    </>
  )
}