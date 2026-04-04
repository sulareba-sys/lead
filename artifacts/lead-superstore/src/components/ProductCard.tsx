import { ShoppingCart, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  stockStatus: string;
  imageUrl?: string | null;
  isDiscount: boolean;
  onCartChange: () => void;
}

const stockConfig = {
  in_stock: { label: "In Stock", color: "bg-green-100 text-green-700" },
  low_stock: { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" },
  out_of_stock: { label: "Out of Stock", color: "bg-red-100 text-red-600" },
};

export default function ProductCard({ id, name, price, originalPrice, stockStatus, imageUrl, isDiscount, onCartChange }: ProductCardProps) {
  const { toast } = useToast();
  const stock = stockConfig[stockStatus as keyof typeof stockConfig] ?? stockConfig.in_stock;
  const isOutOfStock = stockStatus === "out_of_stock";

  function handleAddToCart() {
    if (isOutOfStock) return;
    addToCart({ productId: id, productName: name, price, quantity: 1 });
    onCartChange();
    toast({ title: "Added to cart", description: name, duration: 2000 });
  }

  return (
    <div
      className={`relative bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-lg group ${isDiscount ? "border-orange-400 border-2" : "border-gray-100"}`}
      data-testid={`card-product-${id}`}
    >
      {isDiscount && (
        <div className="absolute top-2 left-2 z-10">
          <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Tag className="h-3 w-3" />
            SALE
          </span>
        </div>
      )}

      <div className="aspect-square bg-orange-50 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-orange-200 text-6xl font-black select-none">
            {name[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2" data-testid={`text-product-name-${id}`}>{name}</p>
        
        <div className="mt-2 flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stock.color}`} data-testid={`status-stock-${id}`}>
            {stock.label}
          </span>
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <p className="font-bold text-gray-900" data-testid={`text-price-${id}`}>{formatPrice(price)}</p>
            {originalPrice && (
              <p className="text-xs text-gray-400 line-through" data-testid={`text-original-price-${id}`}>{formatPrice(originalPrice)}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
            data-testid={`button-add-to-cart-${id}`}
          >
            <ShoppingCart className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
