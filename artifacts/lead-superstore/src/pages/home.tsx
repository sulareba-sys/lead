import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle, MapPin, Phone, Truck, Package, Clock, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const services = [
  { name: "Supermarket", photo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80", href: "/shop" },
  { name: "Restaurant", photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", href: "/shop?category=restaurant" },
  { name: "Bakery", photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", href: "/shop?category=bakery" },
  { name: "Pastries", photo: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80", href: "/shop?category=pastries" },
  { name: "Barbing Salon", photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", href: "#" },
  { name: "Spa Treatment", photo: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80", href: "#" },
];

const whyChooseUs = [
  "Affordable Prices",
  "Quality Products",
  "Multiple Locations",
  "Fast Delivery",
  "Friendly Service",
];

const locations = [
  {
    name: "Lead Mall, Ilesha Garage",
    phone: "0913-404-7214",
    address: "No 6, Line B, Oke Ijetu, Off Ilesha Garage roundabout, Osogbo",
    mapUrl: "https://www.google.com/maps/search/Lead+Mall+Ilesha+Garage+Osogbo",
  },
  {
    name: "Lead Superstore, Omobolanle Branch",
    phone: "0703-994-5498",
    address: "KM 6, Beside MRS Filling Station, Ofatedo Junction, Iwo/Ibadan Rd, Omobolanle, Osogbo",
    mapUrl: "https://www.google.com/maps/search/Lead+Superstore+Omobolanle+Osogbo",
  },
  {
    name: "Lead Superstore, Ilesha Branch",
    phone: "0706-653-4360",
    address: "No 62A, Isokun Street, Opposite Bovas Filling Station, Ilesha",
    mapUrl: "https://www.google.com/maps/search/Lead+Superstore+Ilesha+Branch",
  },
];

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,20%,98%)]">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCartChange={() => setCartVersion(v => v + 1)} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white" />
          <div className="absolute bottom-0 right-20 h-48 w-48 rounded-full bg-white" />
          <div className="absolute top-1/2 right-1/3 h-20 w-20 rounded-full bg-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div
            className="transition-all duration-1000 ease-out"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <p className="text-orange-100 text-sm font-medium uppercase tracking-widest mb-3">Welcome to</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 drop-shadow-sm">
              Lead Superstore
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-orange-100 mb-8">We Have It All</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <button className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-lg" data-testid="button-shop-now">
                  Shop Now
                </button>
              </Link>
              <a href="#locations">
                <button className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                  Find a Branch
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Banner */}
      <div className="bg-orange-500 text-white text-center py-3 px-4">
        <p className="font-semibold flex items-center justify-center gap-2 text-sm md:text-base">
          <Truck className="h-4 w-4" />
          We Deliver to Your Doorstep — Pickup: ₦450 | Delivery: ₦1,650
        </p>
      </div>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <p className="text-orange-500 font-bold text-sm uppercase tracking-widest mb-2">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Everything Under<br />One Roof</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {services.map((service) => (
            <Link key={service.name} href={service.href}>
              <div
                className="relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer group"
                data-testid={`card-service-${service.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <img
                  src={service.photo}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-orange-500 shadow-md" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-white font-bold text-sm md:text-base drop-shadow">{service.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {whyChooseUs.map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white rounded-xl px-4 py-4 shadow-sm">
                <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="font-semibold text-gray-800 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Our Locations</h2>
          <p className="text-gray-500 mt-2">Find us near you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((loc, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid={`card-location-${idx}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{loc.name}</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{loc.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-4 w-4 text-orange-500" />
                <a href={`tel:${loc.phone.replace(/-/g, "")}`} className="text-sm font-medium text-orange-600 hover:underline">{loc.phone}</a>
              </div>
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center border-2 border-orange-400 text-orange-600 font-semibold py-2 rounded-full text-sm hover:bg-orange-50 transition-colors"
                data-testid={`link-directions-${idx}`}
              >
                Get Directions
              </a>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
