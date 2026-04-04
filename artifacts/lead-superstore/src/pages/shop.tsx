import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "drinks", label: "Drinks" },
  { id: "household", label: "Household" },
  { id: "bakery", label: "Bakery" },
  { id: "restaurant", label: "Restaurant" },
  { id: "pastries", label: "Pastries" },
];

export default function ShopPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get("category") ?? "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);

  const { data: products, isLoading } = useListProducts(
    activeCategory !== "all" || searchQuery
      ? {
          ...(activeCategory !== "all" ? { category: activeCategory } : {}),
          ...(searchQuery ? { search: searchQuery } : {}),
        }
      : {}
  );

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,20%,98%)]">
      <Navbar
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCartChange={() => setCartVersion(v => v + 1)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
          <p className="text-gray-500 text-sm mt-1">Browse all our products</p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
              }`}
              data-testid={`tab-category-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-orange-400 animate-spin" />
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found</p>
            <button onClick={() => { setActiveCategory("all"); setSearchQuery(""); }} className="mt-4 text-orange-500 hover:underline text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{products.length} product{products.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  stockStatus={product.stockStatus}
                  imageUrl={product.imageUrl}
                  isDiscount={product.isDiscount}
                  onCartChange={() => setCartVersion(v => v + 1)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
