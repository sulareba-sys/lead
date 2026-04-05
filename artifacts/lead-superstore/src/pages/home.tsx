import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle, MapPin, Phone, Truck, Tag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useListProducts } from "@workspace/api-client-react";

const services = [
  { name: "Supermarket", photo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80", href: "/shop" },
  { name: "Restaurant", photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", href: "/shop?category=restaurant" },
  { name: "Bakery", photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", href: "/shop?category=bakery" },
  { name: "Pastries", photo: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80", href: "/shop?category=pastries" },
  { name: "Barbing Salon", photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", href: "/services/barbing" },
  { name: "Spa Treatment", photo: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80", href: "/services/spa" },
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

  const { data: allProducts } = useListProducts({});
  const featuredProducts = allProducts?.filter((p) => !p.isDiscount).slice(0, 4) ?? [];
  const discountProducts = allProducts?.filter((p) => p.isDiscount) ?? [];

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,20%,98%)]">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCartChange={() => setCartVersion(v => v + 1)} />

      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1400&q=85"
          alt="Lead Superstore"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div
          className="relative px-6 sm:px-10 lg:px-16 py-24 w-full transition-all duration-1000 ease-out"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)" }}
        >
          <div className="w-10 h-1 bg-orange-500 mb-5 rounded-full" />
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-3">
            <span className="text-white block">LEAD</span>
            <span className="text-orange-500 block">SUPERSTORE</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium mb-10">We Have It All</p>
          <Link href="/shop">
            <button
              className="bg-orange-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2 text-base"
              data-testid="button-shop-now"
            >
              Shop Now →
            </button>
          </Link>
          <div className="mt-10 inline-flex items-center gap-2 bg-black/50 text-white text-sm font-medium px-4 py-2.5 rounded-full border border-white/10">
            <Truck className="h-4 w-4 text-orange-400" />
            We Deliver to Your Doorstep
          </div>
        </div>
      </section>

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
                className="relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer group"
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

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-orange-500 font-bold text-sm uppercase tracking-widest mb-1">Fresh Picks</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Our Products</h2>
            </div>
            <Link href="/shop">
              <button className="flex items-center gap-1.5 text-orange-500 font-semibold text-sm hover:gap-2.5 transition-all">
                More <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                originalPrice={p.originalPrice}
                stockStatus={p.stockStatus}
                imageUrl={p.imageUrl}
                isDiscount={p.isDiscount}
                onCartChange={() => setCartVersion(v => v + 1)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Discount Products */}
      {discountProducts.length > 0 && (
        <section className="bg-orange-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4 text-orange-500" />
                  <p className="text-orange-500 font-bold text-sm uppercase tracking-widest">Special Offers</p>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">Discount Products</h2>
              </div>
              <Link href="/shop?tab=discount">
                <button className="flex items-center gap-1.5 text-orange-500 font-semibold text-sm hover:gap-2.5 transition-all">
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {discountProducts.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  stockStatus={p.stockStatus}
                  imageUrl={p.imageUrl}
                  isDiscount={p.isDiscount}
                  onCartChange={() => setCartVersion(v => v + 1)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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
