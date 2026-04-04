import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import logoPath from "@assets/IMG_7654_1775333262802.jpeg";
import { getCart } from "@/lib/cart";

interface NavbarProps {
  onCartClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  showSearch?: boolean;
}

export default function Navbar({ onCartClick, searchQuery, onSearchChange, showSearch }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const cart = getCart();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logoPath} alt="Lead Superstore" className="h-10 w-auto object-contain" />
          </Link>

          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-lg mx-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-orange-200 focus:outline-none focus:border-orange-400 text-sm bg-orange-50"
                data-testid="input-search-navbar"
              />
            </div>
          )}

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${location === "/" ? "text-orange-500" : "text-gray-700 hover:text-orange-500"}`}>
              Home
            </Link>
            <Link href="/shop" className={`text-sm font-medium transition-colors ${location === "/shop" ? "text-orange-500" : "text-gray-700 hover:text-orange-500"}`}>
              Shop
            </Link>
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
              data-testid="button-cart-navbar"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onCartClick}
              className="relative p-2 text-orange-500"
              data-testid="button-cart-mobile"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-700" data-testid="button-menu-mobile">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-orange-200 focus:outline-none focus:border-orange-400 text-sm bg-orange-50"
                data-testid="input-search-mobile"
              />
            </div>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-orange-100 bg-white px-4 py-4 space-y-3">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium py-2">Home</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium py-2">Shop</Link>
        </div>
      )}
    </nav>
  );
}
