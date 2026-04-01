import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import CompareForm from './components/CompareForm'
import WhyUs from './components/WhyUs'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <CompareForm />
        <WhyUs />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}