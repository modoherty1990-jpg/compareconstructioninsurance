import Header from '../components/Header'
import Footer from '../components/Footer'
import GuidesContent from './GuidesContent'

export const metadata = {
  title: 'Insurance Guides for Builders & Tradies | compareconstructioninsurance.com.au',
  description: 'Free insurance guides for Australian builders, tradies and contractors.',
}

export default function Guides() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px', background: '#0f1923', minHeight: '100vh' }}>
        <GuidesContent />
      </main>
      <Footer />
    </>
  )
}