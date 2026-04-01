import Header from '../components/Header'
import Footer from '../components/Footer'
import BrokerDirectory from '../components/BrokerDirectory'

export const metadata = {
  title: 'Specialist Construction Insurance Brokers | compareconstructioninsurance.com.au',
  description: 'A curated directory of specialist construction insurance brokers across Australia. Every broker holds an AFSL or is an authorised representative.',
}

export default function BrokersPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px', background: '#0f1923', minHeight: '100vh' }}>
        <BrokerDirectory />
      </main>
      <Footer />
    </>
  )
}
