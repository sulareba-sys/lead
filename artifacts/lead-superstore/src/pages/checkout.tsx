import { useState } from "react";
import { useLocation } from "wouter";
import { Truck, Package, MessageCircle, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getCart, getOrCreateSerialCode, getCartTotal, clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const BRANCHES = [
  { id: "ilesha_garage", label: "Lead Mall, Ilesha Garage", phone: "2349034000958" },
  { id: "omobolanle", label: "Omobolanle Branch", phone: "2349034000958" },
  { id: "ilesha", label: "Ilesha Branch", phone: "2349034000958" },
];

const PICKUP_FEE = 450;
const DELIVERY_FEE = 1650;

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);
  const [customerLocation, setCustomerLocation] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [branch, setBranch] = useState("ilesha_garage");
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const cart = getCart();
  const serialCode = getOrCreateSerialCode();
  const subtotal = getCartTotal(cart);
  const fee = deliveryType === "pickup" ? PICKUP_FEE : DELIVERY_FEE;
  const total = subtotal + fee;
  const selectedBranch = BRANCHES.find((b) => b.id === branch)!;

  function buildWhatsAppMessage() {
    const itemLines = cart.map((item) => `${item.productName} x${item.quantity}: ${formatPrice(item.price * item.quantity)}`).join("\n");
    return encodeURIComponent(
      `Hello,\nI want to make an order from Lead Superstore.\n\nOrder ID: ${serialCode}\nStatus: Pending\n\nItems:\n${itemLines}\n\nStore Location: ${selectedBranch.label}\nCustomer Location: ${customerLocation}\nDelivery Type: ${deliveryType}\nFee: ${formatPrice(fee)}\n\nTotal: ${formatPrice(total)}`
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerLocation.trim()) {
      toast({ title: "Please enter your location", variant: "destructive" });
      return;
    }
    if (cart.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }

    const url = `https://wa.me/${selectedBranch.phone}?text=${buildWhatsAppMessage()}`;

    try {
      await createOrder.mutateAsync({
        data: {
          serialCode,
          items: cart.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
          customerLocation,
          deliveryType,
          deliveryFee: fee,
          totalPrice: total,
          branch,
        },
      });

      setWaUrl(url);
      setSubmitted(true);
      clearCart();
    } catch {
      toast({ title: "Failed to place order. Please try again.", variant: "destructive" });
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[hsl(30,20%,98%)]">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
            <p className="text-gray-500 mb-2">Your order <span className="font-mono font-bold text-orange-600">{serialCode}</span> has been submitted.</p>
            <p className="text-gray-500 text-sm mb-6">Tap the button below to confirm your order on WhatsApp.</p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-green-500 text-white py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-colors mb-4"
            >
              <MessageCircle className="h-6 w-6" />
              Open WhatsApp
            </a>
            <button onClick={() => setLocation("/")} className="w-full bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors">
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,20%,98%)]">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCartChange={() => setCartVersion(v => v + 1)} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <button onClick={() => setLocation("/shop")} className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold">Browse Products</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Order Summary</h2>
                <span className="text-xs font-mono bg-orange-100 text-orange-700 px-2 py-1 rounded-full" data-testid="text-serial-code">{serialCode}</span>
              </div>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.productName} x{item.quantity}</span>
                    <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Select Branch</h2>
              <div className="space-y-3">
                {BRANCHES.map((b) => (
                  <label key={b.id} className="flex items-center gap-3 cursor-pointer" data-testid={`option-branch-${b.id}`}>
                    <input
                      type="radio"
                      name="branch"
                      value={b.id}
                      checked={branch === b.id}
                      onChange={() => setBranch(b.id)}
                      className="text-orange-500 accent-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Delivery Option</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType("pickup")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "pickup" ? "border-orange-500 bg-orange-50" : "border-gray-200"
                  }`}
                  data-testid="option-pickup"
                >
                  <Package className={`h-6 w-6 ${deliveryType === "pickup" ? "text-orange-500" : "text-gray-400"}`} />
                  <span className="font-semibold text-sm">Pickup</span>
                  <span className="text-xs text-gray-500">{formatPrice(PICKUP_FEE)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType("delivery")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "delivery" ? "border-orange-500 bg-orange-50" : "border-gray-200"
                  }`}
                  data-testid="option-delivery"
                >
                  <Truck className={`h-6 w-6 ${deliveryType === "delivery" ? "text-orange-500" : "text-gray-400"}`} />
                  <span className="font-semibold text-sm">Delivery</span>
                  <span className="text-xs text-gray-500">{formatPrice(DELIVERY_FEE)}</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Your Location</h2>
              <textarea
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                placeholder="Enter your full address or area for delivery..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
                rows={3}
                required
                data-testid="input-customer-location"
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{deliveryType === "pickup" ? "Pickup" : "Delivery"} fee</span>
                  <span className="font-medium">{formatPrice(fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-orange-600" data-testid="text-checkout-total">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={createOrder.isPending}
              className="w-full bg-green-500 text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-600 transition-colors disabled:opacity-60"
              data-testid="button-send-whatsapp"
            >
              <MessageCircle className="h-6 w-6" />
              {createOrder.isPending ? "Placing Order..." : "Send Order via WhatsApp"}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
