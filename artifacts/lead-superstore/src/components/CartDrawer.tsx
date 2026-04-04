import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { getCart, getOrCreateSerialCode, updateQuantity, removeFromCart, getCartTotal, clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useCreateOrder } from "@workspace/api-client-react";

const BRANCHES = [
  { id: "ilesha_garage", label: "Ilesha Garage" },
  { id: "omobolanle", label: "Omobolanle" },
  { id: "ilesha", label: "Ilesha Branch" },
];

const PICKUP_FEE = 450;
const DELIVERY_FEE = 1650;
const WA_NUMBER = "2349034000958";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCartChange: () => void;
}

export default function CartDrawer({ open, onClose, onCartChange }: CartDrawerProps) {
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [branch, setBranch] = useState("ilesha_garage");
  const [ordering, setOrdering] = useState(false);
  const createOrder = useCreateOrder();

  const cart = getCart();
  const serialCode = cart.length > 0 ? getOrCreateSerialCode() : null;
  const subtotal = getCartTotal(cart);
  const fee = deliveryType === "pickup" ? PICKUP_FEE : DELIVERY_FEE;
  const total = subtotal + fee;
  const selectedBranch = BRANCHES.find((b) => b.id === branch)!;

  function handleQuantityChange(productId: number, qty: number) {
    updateQuantity(productId, qty);
    onCartChange();
  }

  function handleRemove(productId: number) {
    removeFromCart(productId);
    onCartChange();
  }

  function buildWaMessage() {
    const items = cart.map((i) => `${i.productName} x${i.quantity}: ${formatPrice(i.price * i.quantity)}`).join("\n");
    return encodeURIComponent(
      `Hello, I want to make an order from Lead Superstore.\n\nOrder ID: ${serialCode}\n\nItems:\n${items}\n\nBranch: ${selectedBranch.label}\nDelivery: ${deliveryType === "pickup" ? "Pickup" : "Home Delivery"}\nFee: ${formatPrice(fee)}\nTotal: ${formatPrice(total)}`
    );
  }

  async function handlePlaceOrder() {
    if (cart.length === 0 || ordering) return;
    setOrdering(true);
    try {
      await createOrder.mutateAsync({
        data: {
          serialCode: serialCode!,
          items: cart.map((i) => ({ productId: i.productId, productName: i.productName, quantity: i.quantity, price: i.price })),
          customerLocation: selectedBranch.label,
          deliveryType,
          deliveryFee: fee,
          totalPrice: total,
          branch,
        },
      });
    } catch {
    } finally {
      clearCart();
      onCartChange();
      onClose();
      setOrdering(false);
    }
  }

  if (!open) return null;

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${buildWaMessage()}`;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <h2 className="font-bold text-gray-900 text-xl">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400"
            data-testid="button-close-cart"
          >
            <X className="h-4 w-4" />
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
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3" data-testid={`cart-item-${item.productId}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{item.productName}</p>
                      <p className="text-orange-500 font-bold text-sm mt-0.5">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-400 text-gray-600 bg-white"
                        data-testid={`button-decrease-${item.productId}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-bold w-5 text-center" data-testid={`text-quantity-${item.productId}`}>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-400 text-gray-600 bg-white"
                        data-testid={`button-increase-${item.productId}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="h-7 w-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-full"
                        data-testid={`button-remove-${item.productId}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery + Location selectors */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">Delivery Method</p>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as "pickup" | "delivery")}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:border-orange-400"
                  >
                    <option value="pickup">🏪 Pickup</option>
                    <option value="delivery">🚚 Delivery</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">Store Location</p>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:border-orange-400"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price summary */}
              <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{deliveryType === "pickup" ? "Pickup Fee" : "Delivery Fee"}</span>
                  <span className="font-medium text-gray-800">{formatPrice(fee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-500" data-testid="text-cart-total">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="px-4 pb-6 pt-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePlaceOrder}
                className="flex items-center justify-center gap-3 w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-600 transition-colors shadow-md"
                data-testid="button-checkout"
              >
                <MessageCircle className="h-5 w-5" />
                {ordering ? "Saving order..." : "Place Order via WhatsApp"}
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
