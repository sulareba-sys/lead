import { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  useVerifyAdmin,
  useGetDashboard,
  useListProducts,
  useListOrders,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProductStock,
  useUpdateOrderStatus,
  useGetLowStockAlerts,
  getGetDashboardQueryKey,
  getListProductsQueryKey,
  getListOrdersQueryKey,
  getGetLowStockAlertsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  BarChart2,
  Plus,
  Trash2,
  LogOut,
  RefreshCw,
  Loader2,
  ChevronDown,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["food", "drinks", "household", "bakery", "restaurant", "pastries"];
const BRANCHES = [
  { id: "ilesha_garage", label: "Ilesha Garage" },
  { id: "omobolanle", label: "Omobolanle" },
  { id: "ilesha", label: "Ilesha" },
];
const STATUSES = ["pending", "processing", "delivered", "returned", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  returned: "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-600",
};

const stockColors: Record<string, string> = {
  in_stock: "bg-green-100 text-green-700",
  low_stock: "bg-yellow-100 text-yellow-700",
  out_of_stock: "bg-red-100 text-red-600",
};

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const verifyAdmin = useVerifyAdmin();
  const [, setLocation] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await verifyAdmin.mutateAsync({ data: { password } });
    if (result.success) {
      sessionStorage.setItem("ls_admin", "1");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="bg-orange-100 rounded-full p-4 inline-flex mb-4">
            <ShoppingBag className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Lead Superstore</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
            required
            autoFocus
            data-testid="input-admin-password"
          />
          {error && <p className="text-red-500 text-xs" data-testid="text-admin-error">{error}</p>}
          <button
            type="submit"
            disabled={verifyAdmin.isPending}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
            data-testid="button-admin-login"
          >
            {verifyAdmin.isPending ? "Verifying..." : "Login"}
          </button>
        </form>
        <button onClick={() => setLocation("/")} className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600">
          Back to Store
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const { data: stats, isLoading } = useGetDashboard();
  const { data: alerts } = useGetLowStockAlerts();

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 text-orange-400 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Orders Today</p>
          <p className="text-2xl font-bold text-gray-900 mt-1" data-testid="stat-orders-today">{stats?.totalOrdersToday ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Revenue Today</p>
          <p className="text-2xl font-bold text-orange-600 mt-1" data-testid="stat-revenue">{formatPrice(stats?.revenueToday ?? 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1" data-testid="stat-pending">{stats?.pendingOrders ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-1" data-testid="stat-total-products">{stats?.totalProducts ?? 0}</p>
        </div>
      </div>

      {alerts && alerts.length > 0 && (
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800 text-sm">Low Stock Alerts</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((p) => (
              <div key={p.id} className="flex justify-between text-sm" data-testid={`alert-product-${p.id}`}>
                <span className="text-yellow-800">{p.name}</span>
                <span className="text-yellow-600 font-medium">Low Stock</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="px-4 py-3 flex items-center justify-between" data-testid={`recent-order-${order.id}`}>
                <div>
                  <p className="font-mono text-xs font-semibold text-orange-600">{order.serialCode}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.branch} · {formatPrice(order.totalPrice)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[order.status] ?? ""}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsTab() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const updateStock = useUpdateProductStock();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", price: "", category: "food", stockStatus: "in_stock", stockQuantity: "10",
    imageUrl: "", branches: ["ilesha_garage", "omobolanle", "ilesha"],
    isDiscount: false, originalPrice: "", discountStartDate: "", discountEndDate: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 800;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL("image/jpeg", 0.65);
      setForm(f => ({ ...f, imageUrl: compressed }));
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }

  function toggleBranch(bid: string) {
    setForm((f) => ({
      ...f,
      branches: f.branches.includes(bid) ? f.branches.filter((b) => b !== bid) : [...f.branches, bid],
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createProduct.mutateAsync({
      data: {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category as "food",
        stockStatus: form.stockStatus as "in_stock",
        stockQuantity: parseInt(form.stockQuantity),
        branches: form.branches,
        isDiscount: form.isDiscount,
        imageUrl: form.imageUrl || null,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        discountStartDate: form.discountStartDate || null,
        discountEndDate: form.discountEndDate || null,
      },
    });
    qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
    toast({ title: "Product created!" });
    setShowForm(false);
    setForm({ name: "", price: "", category: "food", stockStatus: "in_stock", stockQuantity: "10", imageUrl: "", branches: ["ilesha_garage", "omobolanle", "ilesha"], isDiscount: false, originalPrice: "", discountStartDate: "", discountEndDate: "" });
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await deleteProduct.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
    toast({ title: "Product deleted" });
  }

  async function handleStockChange(id: number, stockStatus: string) {
    await updateStock.mutateAsync({ id, data: { stockStatus: stockStatus as "in_stock" } });
    qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetLowStockAlertsQueryKey() });
    toast({ title: "Stock updated" });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Products</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-600" data-testid="button-add-product">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-gray-900">New Product</h3>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4 text-gray-400" /></button>
          </div>
          <input required placeholder="Product name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" data-testid="input-product-name" />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" placeholder="Price (₦)" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" data-testid="input-product-price" />
            <input required type="number" placeholder="Quantity" value={form.stockQuantity} onChange={(e) => setForm(f => ({ ...f, stockQuantity: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" data-testid="input-product-qty" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" data-testid="select-product-category">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.stockStatus} onChange={(e) => setForm(f => ({ ...f, stockStatus: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" data-testid="select-product-stock">
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-orange-50 transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              {form.imageUrl ? "Change Photo" : "Pick from Gallery"}
            </button>
            {form.imageUrl && (
              <div className="relative">
                <img src={form.imageUrl} alt="preview" className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, imageUrl: "" }))}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs leading-none"
                >×</button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is-discount" checked={form.isDiscount} onChange={(e) => setForm(f => ({ ...f, isDiscount: e.target.checked }))} className="accent-orange-500" data-testid="checkbox-is-discount" />
            <label htmlFor="is-discount" className="text-sm text-gray-700">Discount product</label>
          </div>
          {form.isDiscount && (
            <input placeholder="Original price (₦)" type="number" value={form.originalPrice} onChange={(e) => setForm(f => ({ ...f, originalPrice: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
          )}
          <div>
            <p className="text-xs text-gray-500 mb-2">Branches:</p>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map((b) => (
                <button type="button" key={b.id} onClick={() => toggleBranch(b.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.branches.includes(b.id) ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600"}`}
                  data-testid={`toggle-branch-${b.id}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={createProduct.isPending} className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-600 disabled:opacity-60" data-testid="button-save-product">
            {createProduct.isPending ? "Saving..." : "Save Product"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 text-orange-400 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {products?.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-3" data-testid={`admin-product-${p.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-orange-600 text-xs font-semibold">{formatPrice(p.price)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockColors[p.stockStatus] ?? ""}`} data-testid={`admin-stock-${p.id}`}>{p.stockStatus.replace("_", " ")}</span>
                    <span className="text-xs text-gray-400 capitalize">{p.category}</span>
                    {p.isDiscount && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Sale</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={p.stockStatus}
                    onChange={(e) => handleStockChange(p.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                    data-testid={`select-stock-${p.id}`}
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                  <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400" data-testid={`button-delete-${p.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchCode, setSearchCode] = useState("");
  const { toast } = useToast();

  const { data: orders, isLoading } = useListOrders(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );
  const updateStatus = useUpdateOrderStatus();

  const filtered = orders?.filter((o) =>
    !searchCode || o.serialCode.toLowerCase().includes(searchCode.toLowerCase())
  );

  async function handleStatusChange(id: number, status: string) {
    await updateStatus.mutateAsync({ id, data: { status: status as "pending" } });
    qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
    toast({ title: "Order status updated" });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">Orders</h2>
      <div className="flex gap-2 flex-wrap">
        <input
          placeholder="Search by order code..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="flex-1 min-w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          data-testid="input-search-orders"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
          data-testid="select-order-filter"
        >
          <option value="all">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 text-orange-400 animate-spin" /></div>
      ) : filtered?.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">No orders found</p>
      ) : (
        <div className="space-y-3">
          {filtered?.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`admin-order-${order.id}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-mono text-sm font-bold text-orange-600" data-testid={`order-code-${order.id}`}>{order.serialCode}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.branch.replace("_", " ")} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize flex-shrink-0 ${statusColors[order.status] ?? ""}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1 mb-3">
                {(order.items as Array<{productName: string; quantity: number; price: number}>).map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.productName} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold border-t border-gray-100 pt-1 mt-1">
                  <span>Total</span>
                  <span className="text-orange-600">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none capitalize"
                  data-testid={`select-order-status-${order.id}`}
                >
                  {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("ls_admin") === "1");
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");

  function handleLogout() {
    sessionStorage.removeItem("ls_admin");
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900 text-sm">Admin Portal</h1>
          <p className="text-xs text-gray-500">Lead Superstore</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLocation("/")} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded">Store</button>
          <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded" data-testid="button-logout">
            <LogOut className="h-3 w-3" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-100 bg-white">
        {([
          { id: "dashboard", label: "Dashboard", icon: BarChart2 },
          { id: "products", label: "Products", icon: Package },
          { id: "orders", label: "Orders", icon: ShoppingBag },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors ${
              activeTab === id ? "text-orange-600 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700"
            }`}
            data-testid={`tab-admin-${id}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 max-w-3xl mx-auto">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "orders" && <OrdersTab />}
      </div>
    </div>
  );
}
