import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Tag,
  AlertTriangle,
  KeyRound,
  Lock,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, OrderStatus } from '../../types';
import { CATEGORIES_DATA } from '../../data/products';
import { INITIAL_USERS } from '../../data/initialData';

export const SuperAdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    orders,
    updateOrderStatus,
    assignDeliveryStaff,
    formatPrice,
    coupons,
    addCoupon,
    toggleCouponActive,
    auditLogs,
    navigateTo,
    adminPassword,
    updateAdminPassword,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'coupons' | 'users' | 'audit' | 'settings'
  >('overview');

  // Search & Filter state for products
  const [productSearch, setProductSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Modal State for Adding Product
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('Face serums');
  const [newProductPrice, setNewProductPrice] = useState(3800);
  const [newProductNetQty, setNewProductNetQty] = useState('50ml / 1.7 fl. oz.');
  const [newProductStock, setNewProductStock] = useState(50);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductIngredients, setNewProductIngredients] = useState('Water, Glycerin, Niacinamide, Hyaluronic Acid');

  // Modal State for New Coupon
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(3000);

  // Modal State for Changing Master Admin Password (Iqra Yahya)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newAdminPasswordInput, setNewAdminPasswordInput] = useState('');
  const [confirmAdminPasswordInput, setConfirmAdminPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (!newAdminPasswordInput.trim()) {
      setPasswordChangeError('Baraye meherbani naya password darj karein.');
      return;
    }

    if (newAdminPasswordInput.trim().length < 4) {
      setPasswordChangeError('Password kam az kam 4 haroof ka hona chahiye.');
      return;
    }

    if (newAdminPasswordInput.trim() !== confirmAdminPasswordInput.trim()) {
      setPasswordChangeError('Dono passwords aapas mein match nahi kar rahe (Do not match).');
      return;
    }

    const res = updateAdminPassword(newAdminPasswordInput.trim());
    if (res.success) {
      setPasswordChangeSuccess(res.message);
      setTimeout(() => {
        setIsChangePasswordModalOpen(false);
        setNewAdminPasswordInput('');
        setConfirmAdminPasswordInput('');
        setPasswordChangeSuccess('');
      }, 2000);
    } else {
      setPasswordChangeError(res.message);
    }
  };

  // Business Analytics Calculations
  const totalRevenuePKR = orders.reduce((sum, o) => (o.paymentStatus === 'paid' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryValuePKR = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const filteredProductsList = products.filter((p) => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const matchSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    addProduct({
      sku: `VB-${newProductCategory.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newProductName,
      category: newProductCategory,
      price: newProductPrice,
      netQuantity: newProductNetQty,
      stock: newProductStock,
      rating: 5.0,
      reviewCount: 1,
      isDemoReviewCount: true,
      description: newProductDesc || 'Velmora signature luxury formulation.',
      keyFeatures: ['Cruelty-free & clean', 'Fast absorbing luxury finish'],
      ingredients: newProductIngredients.split(',').map((s) => s.trim()),
      usageInstructions: 'Apply onto clean skin morning and evening.',
      precautions: 'For external cosmetic use only.',
      variants: [],
      image: '/src/assets/images/velmora_serum_showcase_1791519519360.jpg',
      searchKeywords: ['skincare', newProductName.toLowerCase()],
      relatedProductIds: [],
    });

    setIsAddProductModalOpen(false);
    setNewProductName('');
    setNewProductDesc('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponPercent,
      minOrderValue: newCouponMin,
      validUntil: '2026-12-31',
      isActive: true,
      description: `${newCouponPercent}% discount on orders above ${formatPrice(newCouponMin)}`,
    });

    setIsAddCouponModalOpen(false);
    setNewCouponCode('');
  };

  const exportCSVReport = () => {
    const rows = [
      ['Order ID', 'Customer', 'Email', 'Status', 'Total (PKR)', 'Payment', 'Date'],
      ...orders.map((o) => [
        o.id,
        o.customerName,
        o.customerEmail,
        o.orderStatus,
        o.total,
        o.paymentMethod,
        new Date(o.createdAt).toLocaleDateString(),
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `velmora_sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-6 pt-3 overflow-x-auto text-xs font-bold text-slate-600 gap-2">
        {[
          { id: 'overview', label: 'Executive Overview' },
          { id: 'products', label: `Catalog (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'coupons', label: `Coupons (${coupons.length})` },
          { id: 'users', label: 'Staff & Roles (RBAC)' },
          { id: 'audit', label: `Audit Logs (${auditLogs.length})` },
          { id: 'settings', label: 'Settings & Shipping' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-[#005461] text-[#005461] font-bold bg-[#005461]/5 rounded-t-lg'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. EXECUTIVE OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Iqra Yahya Executive Credential Banner */}
          <div className="bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] text-white p-6 rounded-2xl shadow-md border border-teal-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/15 text-[#3BC1A8] text-[11px] font-extrabold uppercase tracking-wider border border-teal-400/20">
                <span>👑 Super Admin Sovereignty</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                Welcome back, Iqra Yahya
              </h2>
              <p className="text-xs text-teal-100/90">
                You have exclusive master administrator access over Velmora Beauty.
              </p>
            </div>

            <div className="bg-black/25 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 text-xs space-y-2">
              <span className="text-[11px] text-[#3BC1A8] font-bold block uppercase tracking-wider">
                Private Admin Credentials
              </span>
              <div className="font-mono text-slate-100 space-y-0.5">
                <div>Email: <strong className="text-white">iqrayahya18@gmail.com</strong></div>
                <div>
                  Password:{' '}
                  <strong className="text-[#3BC1A8] bg-white/10 px-1.5 py-0.5 rounded font-mono">
                    {adminPassword}
                  </strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="w-full mt-1 bg-[#3BC1A8] hover:bg-white text-[#005461] font-bold px-2.5 py-1.5 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password (پاسورڈ بدلیں)</span>
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Verified Revenue</span>
                <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
                {formatPrice(totalRevenuePKR)}
              </h3>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.8% vs last month</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Orders in Pipeline</span>
                <span className="p-2 bg-teal-50 text-[#005461] rounded-lg">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
                {totalOrdersCount} Orders
              </h3>
              <p className="text-[11px] text-slate-500">
                {pendingOrdersCount} pending fulfillment & dispatch
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Catalog Inventory</span>
                <span className="p-2 bg-cyan-50 text-cyan-700 rounded-lg">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
                {products.length} Products
              </h3>
              <p className="text-[11px] text-slate-500">
                {totalInventoryUnits} units in stock ({formatPrice(totalInventoryValuePKR)} value)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Staff & Access</span>
                <span className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
                {INITIAL_USERS.length} Active Staff
              </h3>
              <p className="text-[11px] text-slate-500">Across 7 RBAC permission tiers</p>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
                <p className="text-xs text-slate-500">Real-time order pipeline across Pakistan & international destinations</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSVReport}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="bg-[#005461] hover:bg-[#0C7779] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  View All Orders
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FBFBF9] text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-[#005461]">{o.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{o.customerName}</div>
                        <div className="text-[11px] text-slate-500">{o.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3">
                        {o.shippingAddress.city}, {o.shippingAddress.country}
                      </td>
                      <td className="py-3 px-3">
                        <span className="uppercase font-semibold">{o.paymentMethod}</span> ({o.paymentStatus})
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          o.orderStatus === 'out_for_delivery' ? 'bg-amber-100 text-amber-800' :
                          o.orderStatus === 'processing' ? 'bg-teal-100 text-teal-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {o.orderStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                        {formatPrice(o.total)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => navigateTo('order-confirmation', { id: o.id })}
                          className="text-[#0C7779] hover:underline font-semibold"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS CATALOG MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Product Catalog Management</h3>
              <p className="text-xs text-slate-500">
                Manage all {products.length} distinct formulas, adjust stock, edit prices, and create new items.
              </p>
            </div>
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="bg-[#005461] hover:bg-[#0C7779] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by SKU or name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#249E94]"
              />
            </div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="All">All 12 Categories</option>
              {CATEGORIES_DATA.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FBFBF9] text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-center">Stock</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProductsList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-600">{p.sku}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate">
                      {p.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{p.category}</td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-[#005461]">
                      {formatPrice(p.salePrice || p.price)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateStock(p.id, Math.max(0, p.stock - 5))}
                          className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                        >
                          -
                        </button>
                        <span className={`px-2 font-mono font-bold ${p.stock < 10 ? 'text-red-600' : 'text-slate-800'}`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateStock(p.id, p.stock + 10)}
                          className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => navigateTo('product-detail', { id: p.id })}
                        className="text-[#0C7779] hover:underline font-semibold"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          const newPrice = prompt(`Enter new base price for ${p.name}:`, p.price.toString());
                          if (newPrice && !isNaN(Number(newPrice))) {
                            updateProduct(p.id, { price: Number(newPrice) });
                          }
                        }}
                        className="text-slate-500 hover:text-slate-900"
                        title="Edit Price"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Archive product ${p.name}?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Product"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ORDERS PIPELINE TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Order Management & Fulfillment</h3>
              <p className="text-xs text-slate-500">Manage orders, update status, assign riders, and handle cancellations</p>
            </div>
            <button
              onClick={exportCSVReport}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FBFBF9] text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer & Address</th>
                  <th className="py-2.5 px-3">Assigned Staff</th>
                  <th className="py-2.5 px-3">Current Status</th>
                  <th className="py-2.5 px-3">Update Lifecycle</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-[#005461] block">{o.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{o.trackingNumber}</span>
                    </td>
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block">{o.customerName}</strong>
                      <span className="text-slate-500 block truncate max-w-xs">
                        {o.shippingAddress.street}, {o.shippingAddress.city}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {o.assignedStaffName ? (
                        <span className="font-semibold text-slate-800">{o.assignedStaffName}</span>
                      ) : (
                        <button
                          onClick={() => assignDeliveryStaff(o.id, 'usr-delivery', 'Tariq Mehmood (Express Rider)')}
                          className="text-[#0C7779] underline font-medium"
                        >
                          + Assign Rider
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100">
                        {o.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="assigned">Assigned</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                      {formatPrice(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Promotions & Coupon Codes</h3>
              <p className="text-xs text-slate-500">Configure discounts, minimum spend thresholds, and campaign tracking</p>
            </div>
            <button
              onClick={() => setIsAddCouponModalOpen(true)}
              className="bg-[#005461] hover:bg-[#0C7779] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 space-y-2 bg-[#FBFBF9]">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#005461]">{c.code}</span>
                  <button
                    onClick={() => toggleCouponActive(c.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
                <p className="text-xs text-slate-600">{c.description}</p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                  <span>Used: {c.usageCount} times</span>
                  <span>Min: {formatPrice(c.minOrderValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. USERS & ROLES (RBAC) */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-slate-500">Separation of privilege across 7 distinct roles</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FBFBF9] text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Staff / Customer Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Role Tier</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_USERS.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-100 text-[#005461]">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{u.phone || 'N/A'}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {u.role === 'super_admin' ? 'Unrestricted Root Admin' :
                       u.role === 'delivery_staff' ? 'Assigned Deliveries Only' :
                       u.role === 'customer' ? 'Customer Profile & Orders' :
                       'Specialized Dashboard Privilege'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Security & Operational Audit Logs</h3>
            <p className="text-xs text-slate-500">Immutable ledger tracking administrative actions and system updates</p>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between text-xs gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#005461]">{log.action}</span>
                    <span className="text-[11px] text-slate-400">by {log.actorName} ({log.actorRole})</span>
                  </div>
                  <p className="text-slate-700">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 text-xs text-slate-700">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Store Settings & Logistics</h3>
            <p className="text-xs text-slate-500">Configure delivery thresholds, base currencies, and notification webhooks</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-slate-900">Free Shipping Threshold (PKR)</label>
              <input
                type="number"
                defaultValue={3000}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-400">Orders above this amount qualify for free shipping nationwide.</span>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-900">Standard Domestic Courier Fee (PKR)</label>
              <input
                type="number"
                defaultValue={250}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-400">Charged on domestic shipments below free threshold.</span>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-900">DHL Express International Fee (PKR)</label>
              <input
                type="number"
                defaultValue={4500}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-400">Standard rate for UAE, US, UK, and Europe.</span>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-900">Primary Warehouse Origin</label>
              <input
                type="text"
                defaultValue="Gulberg III, MM Alam Road, Lahore, Pakistan"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 font-display">Add Formulation to Catalog</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Copper Peptide Renewal Drops"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Net Quantity</label>
                  <input
                    type="text"
                    value={newProductNetQty}
                    onChange={(e) => setNewProductNetQty(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Clinical benefits, texture, key actives..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#005461] text-white rounded-lg font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD COUPON */}
      {isAddCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 font-display">Create Promotional Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. SUMMER25"
                  className="w-full px-3 py-2 border rounded-lg uppercase font-mono"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={newCouponPercent}
                  onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Minimum Order Value (PKR)</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCouponModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005461] text-white rounded-lg font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Admin Password Modal for Iqra Yahya */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-teal-500/30 overflow-hidden">
            <div className="bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/15 text-[#3BC1A8] rounded-xl font-bold border border-teal-400/20">
                  <KeyRound className="w-5 h-5 text-[#3BC1A8]" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-display">
                    Set Private Password
                  </h3>
                  <p className="text-[11px] text-teal-100">
                    Iqra Yahya · Super Admin Master Key
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
              <div className="text-xs bg-[#005461]/5 p-3 rounded-xl border border-teal-100 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Current Password:</span>
                  <code className="font-mono font-bold text-[#005461]">{adminPassword}</code>
                </div>
                <p className="text-[11px] text-slate-500">
                  نیا پاسورڈ سیٹ کرنے کے بعد، صرف اسی نئے پاسورڈ سے ایڈمن پینل کھلے گا۔
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password (نیا پاسورڈ)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newAdminPasswordInput}
                    onChange={(e) => setNewAdminPasswordInput(e.target.value)}
                    placeholder="Enter new secret password..."
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#005461]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password (تصدیق کریں)
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmAdminPasswordInput}
                  onChange={(e) => setConfirmAdminPasswordInput(e.target.value)}
                  placeholder="Re-enter new secret password..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#005461]"
                />
              </div>

              {passwordChangeError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {passwordChangeError}
                </div>
              )}

              {passwordChangeSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
                  {passwordChangeSuccess}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] text-white font-bold rounded-xl text-xs shadow hover:opacity-95 cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
