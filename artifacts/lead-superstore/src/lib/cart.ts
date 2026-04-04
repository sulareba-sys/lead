export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

const CART_KEY = "ls_cart";
const CODE_KEY = "ls_cart_code";

function generateSerialCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "Ls_";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getOrCreateSerialCode(): string {
  let code = localStorage.getItem(CODE_KEY);
  if (!code) {
    code = generateSerialCode();
    localStorage.setItem(CODE_KEY, code);
  }
  return code;
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CODE_KEY);
}

export function addToCart(item: CartItem): CartItem[] {
  getOrCreateSerialCode();
  const cart = getCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: number): CartItem[] {
  const cart = getCart().filter((i) => i.productId !== productId);
  saveCart(cart);
  if (cart.length === 0) {
    clearCart();
  }
  return cart;
}

export function updateQuantity(productId: number, quantity: number): CartItem[] {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      return removeFromCart(productId);
    }
  }
  saveCart(cart);
  return cart;
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
