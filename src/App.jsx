import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Collection from './components/Collection'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import RentModal from './components/RentModal'
import { useState } from 'react'

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Collection onRent={setSelectedItem} />
      <HowItWorks />
      <Footer />
      {selectedItem && (
        <RentModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}
