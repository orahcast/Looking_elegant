import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Collection from './components/Collection'
import HowItWorks from './components/HowItWorks'
import Contact from './components/Contact'
import Footer from './components/Footer'
import RentModal from './components/RentModal'
import WhatsAppButton from './components/WhatsAppButton'
import { useState } from 'react'

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <Hero />
      <Collection onRent={setSelectedItem} />
      <HowItWorks />
      <Contact />
      <Footer />
      <WhatsAppButton />
      {selectedItem && (
        <RentModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}
