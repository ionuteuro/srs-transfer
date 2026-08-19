import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Fleet from './components/Fleet.jsx'
import Pricing from './components/Pricing.jsx'
import Booking from './components/Booking.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Agent from './components/Agent.jsx'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Services />
        <Fleet />
        <Pricing />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <Agent />
    </div>
  )
}
