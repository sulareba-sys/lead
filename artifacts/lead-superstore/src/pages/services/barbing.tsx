import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Scissors } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { formatPrice } from "@/lib/utils";

const services = [
  { name: "Normal Haircut", price: 1500, desc: "Clean cut, fade and shape up" },
  { name: "Low Cut", price: 1500, desc: "Short even low cut" },
  { name: "Shape Up / Lineup", price: 800, desc: "Edge up and beard line" },
  { name: "Wash & Cut", price: 2500, desc: "Hair wash + haircut combo" },
  { name: "Dreadlock Styling", price: 10000, desc: "Full dread lock style and setting" },
  { name: "Dreadlock Retwist", price: 5000, desc: "Maintain and retwist existing locks" },
  { name: "Beard Trim", price: 700, desc: "Beard shaping and grooming" },
  { name: "Full Groom Package", price: 4000, desc: "Haircut + beard + shape up combo" },
  { name: "Kids Haircut", price: 1000, desc: "Gentle cut for children under 12" },
  { name: "Eyebrow Threading", price: 500, desc: "Clean brow shaping" },
];

export default function BarbingPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,20%,98%)]">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCartChange={() => setCartVersion(v => v + 1)} />

      <div className="relative bg-black text-white py-14 px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80"
          alt="Barbing Salon"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-500 rounded-full p-2">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <p className="text-orange-400 font-bold text-sm uppercase tracking-widest">Lead Superstore</p>
          </div>
          <h1 className="text-4xl font-black">Barbing Salon</h1>
          <p className="text-gray-300 mt-2">Professional grooming services</p>
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <p className="text-gray-500 text-sm mb-6">Walk in or call to book your appointment. All prices below.</p>
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.name} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between hover:border-orange-200 hover:shadow-sm transition-all">
              <div>
                <p className="font-bold text-gray-900">{s.name}</p>
                <p className="text-gray-500 text-sm mt-0.5">{s.desc}</p>
              </div>
              <span className="text-orange-500 font-black text-lg ml-4 flex-shrink-0">{formatPrice(s.price)}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-orange-50 rounded-2xl border border-orange-100 px-5 py-4 text-center">
          <p className="text-gray-700 font-semibold">Call to Book an Appointment</p>
          <a href="tel:09034000958" className="text-orange-500 font-black text-xl mt-1 block hover:underline">0903 400 0958</a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
