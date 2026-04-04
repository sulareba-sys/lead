import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { CartItem, getCart, getOrCreateSerialCode, updateQuantity, removeFromCart, getCartTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCartChange: () => void;
}

export default function CartDrawer({ open, onClose, onCartChange }: CartDrawerProps) {
  const cart = getCart();
  const serialCode = cart.length > 0 ? getOrCreateSerialCode() : null;
  const total = getCartTotal(cart);

  function handleQuantityChange(productId: number, qty: number) {
    updateQuantity(productId, qty);
    onCartChange();
  }

  function handleRemove(productId: number) {
    removeFromCart(productId);
    onCartChange();
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Your Cart</h2>
            {serialCode && (
              <p className="text-xs text-gray-500 mt-0.5">Order ID: <span className="font-mono font-semibold text-orange-600">{serialCode}</span></p>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500" data-testid="button-close-cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <ShoppingBag className="h-16 w-16 text-orange-200" />
            <p className="text-gray-500 text-center">Your cart is empty</p>
            <button onClick={onClose} className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors">
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3 items-start" data-testid={`cart-item-${item.productId}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.productName}</p>
                    <p className="text-orange-600 font-semibold text-sm mt-0.5">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-400 text-gray-600"
                      data-testid={`button-decrease-${item.productId}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center" data-testid={`text-quantity-${item.productId}`}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-400 text-gray-600"
                      data-testid={`button-increase-${item.productId}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 ml-1"
                      data-testid={`button-remove-${item.productId}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 px-4 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="font-bold text-gray-900 text-lg" data-testid="text-cart-total">{formatPrice(total)}</span>
              </div>
              <Link href="/checkout" onClick={onClose}>
                <button className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors" data-testid="button-checkout">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
