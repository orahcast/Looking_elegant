import { Phone, MapPin, Clock } from 'lucide-react'

const WHATSAPP_NUMBER = '250780791292'
const DISPLAY_PHONE = '+250 780 791 292'

const QUICK_TOPICS = [
  {
    label: 'Wedding & Gala Suiting',
    msg: 'Hello Looking Elegant Atelier, I would like to inquire about suit or tuxedo rental for an upcoming wedding/gala event.',
  },
  {
    label: 'Black Tie Tuxedo Rental',
    msg: 'Hello Looking Elegant, I am looking to rent a luxury tuxedo. Could you share available sizes and pricing?',
  },
  {
    label: 'Handcrafted Leather Shoes',
    msg: 'Hello Looking Elegant, I would like to inquire about renting dress shoes to match my outfit.',
  },
  {
    label: 'Book Private In-Person Fitting',
    msg: 'Hello! I would like to book a private fitting consultation at the atelier in Nyarugenge, Kigali.',
  },
]

export default function Contact() {
  const getWhatsAppUrl = (customText) => {
    const text = customText || 'Hello Looking Elegant Atelier, I would like to inquire about renting a suit.'
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  }

  return (
    <section id="contact" className="bg-[#faf8f3] text-[#1a1812] py-20 lg:py-28 relative overflow-hidden border-t border-[#c9a97a]/25">
      {/* Subtle luxury warm ambient accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c9a97a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#c9a97a]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-px bg-[#c9a97a]" />
            <span className="text-[#c9a97a] text-[0.62rem] tracking-widest uppercase font-sans font-medium">
              Private Atelier Consultations
            </span>
            <span className="w-6 h-px bg-[#c9a97a]" />
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1812] mb-3">
            Connect With Our Master Stylist
          </h2>
          <p className="text-[#73685a] text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto">
            Need urgent sizing advice, a tailored package for your bridal party, or a custom fitting?
            Reach our atelier team directly on WhatsApp for immediate personal assistance.
          </p>
        </div>

        {/* Primary Interactive WhatsApp Card (Light Aesthetic) */}
        <div className="max-w-4xl mx-auto bg-white border border-[#e8e2d5] rounded-sm p-6 sm:p-10 shadow-xl shadow-[#0a0906]/5 relative">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-[#f0ece1]">
            <div className="flex items-center gap-4 text-center sm:text-left">
              {/* WhatsApp Brand Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366]/10 border border-[#25D366]/25 flex items-center justify-center flex-shrink-0 text-[#25D366]">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[0.62rem] uppercase tracking-widest text-emerald-700 font-medium">
                    Available Online Now
                  </span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-light text-[#1a1812] mt-1">
                  WhatsApp Direct Line
                </h3>
                <p className="text-[#73685a] text-xs sm:text-sm font-light mt-0.5">
                  <strong className="text-[#1a1812] font-medium">{DISPLAY_PHONE}</strong> · Instant replies from our styling team
                </p>
              </div>
            </div>

            {/* Main Action Button */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs tracking-widest uppercase px-8 py-4 rounded-sm transition-all shadow-md hover:shadow-lg hover:shadow-[#25D366]/20"
              id="whatsapp-contact-cta"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Quick Consultation Inquiries (Clean, no emojis) */}
          <div className="pt-6">
            <p className="text-[#8a7e70] text-[0.62rem] uppercase tracking-widest font-semibold mb-3">
              Quick Inquiries:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QUICK_TOPICS.map((topic) => (
                <a
                  key={topic.label}
                  href={getWhatsAppUrl(topic.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 bg-[#faf8f3] hover:bg-[#f3ede2] border border-[#e8e2d5] hover:border-[#c9a97a] rounded-sm text-xs text-[#2c281e] transition-all group"
                >
                  <span className="font-light tracking-wide">{topic.label}</span>
                  <span className="text-[#c9a97a] text-[0.68rem] tracking-wider uppercase font-medium group-hover:translate-x-0.5 transition-transform">
                    Inquire →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Supplementary Atelier Info Grid (Light Theme) */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
          <div className="p-5 bg-white border border-[#e8e2d5] rounded-sm shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#faf8f3] border border-[#e8e2d5] flex items-center justify-center text-[#c9a97a] mb-3">
              <Phone size={14} />
            </div>
            <h4 className="text-[#1a1812] text-xs uppercase tracking-wider font-medium mb-1">
              Direct Phone Call
            </h4>
            <a href={`tel:${WHATSAPP_NUMBER}`} className="text-[#73685a] hover:text-[#c9a97a] text-xs font-light transition-colors">
              {DISPLAY_PHONE}
            </a>
          </div>

          <div className="p-5 bg-white border border-[#e8e2d5] rounded-sm shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#faf8f3] border border-[#e8e2d5] flex items-center justify-center text-[#c9a97a] mb-3">
              <MapPin size={14} />
            </div>
            <h4 className="text-[#1a1812] text-xs uppercase tracking-wider font-medium mb-1">
              Kigali Atelier
            </h4>
            <p className="text-[#73685a] text-xs font-light">
              Nyarugenge, KN 74 St, Kigali, Rwanda
            </p>
          </div>

          <div className="p-5 bg-white border border-[#e8e2d5] rounded-sm shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#faf8f3] border border-[#e8e2d5] flex items-center justify-center text-[#c9a97a] mb-3">
              <Clock size={14} />
            </div>
            <h4 className="text-[#1a1812] text-xs uppercase tracking-wider font-medium mb-1">
              Opening Hours
            </h4>
            <p className="text-[#73685a] text-xs font-light">
              Mon – Sat: 8:00 AM – 8:00 PM
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
