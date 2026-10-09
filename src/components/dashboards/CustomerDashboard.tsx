import React, { useState } from 'react';
import {
  Package,
  Heart,
  User as UserIcon,
  MapPin,
  Clock,
  Printer,
  RotateCcw,
  CheckCircle2,
  Star,
  ShieldCheck,
  Edit,
  Crown,
  Lock,
  KeyRound,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    wishlist,
    products,
    formatPrice,
    updateUserProfile,
    requestOrderReturn,
    cancelOrder,
    navigateTo,
    setIsAdminPasswordModalOpen,
    isAdminUnlocked,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses'>('orders');

  // Filter orders for this customer (or all sample orders if testing as demo customer)
  const myOrders = orders.filter(
    (o) =>
      o.customerId === currentUser.id ||
      o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      currentUser.role === 'customer'
  );

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '+92 304 9876543');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: profileName, phone: profilePhone });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 pb-2 overflow-x-auto text-xs font-bold text-slate-600 gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#005461] text-white shadow-sm'
              : 'hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'wishlist'
              ? 'bg-[#005461] text-white shadow-sm'
              : 'hover:bg-slate-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Saved Wishlist ({wishlistProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'profile'
              ? 'bg-[#005461] text-white shadow-sm'
              : 'hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Profile & Security</span>
        </button>
      </div>

      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Your Orders & Live Tracking</h3>
            <p className="text-xs text-slate-500">Track shipments, download invoices, and initiate 14-day returns</p>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No orders placed yet. Discover our formulations to begin your beauty journey!
            </div>
          ) : (
            <div className="space-y-5">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-[#FBFBF9] space-y-4 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#005461] block">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Tracking: {order.trackingNumber} · Placed {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'out_for_delivery'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-teal-100 text-[#005461]'
                        }`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>

                      <button
                        onClick={() => navigateTo('order-confirmation', { id: order.id })}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center gap-1 text-[11px] font-semibold"
                        title="Download / Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-2">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                        <div>
                          <strong className="text-slate-900 block">{it.productName}</strong>
                          <span className="text-slate-500 text-[11px]">Qty: {it.quantity} · {formatPrice(it.unitPrice)} each</span>
                        </div>
                        <span className="font-bold tabular-nums text-slate-900">{formatPrice(it.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span>Total Paid/Due: </span>
                      <strong className="text-sm font-bold text-[#005461] tabular-nums">
                        {formatPrice(order.total)}
                      </strong>
                      <span className="text-slate-400 text-[11px]"> ({order.paymentMethod.toUpperCase()})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.orderStatus === 'delivered' && (
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for return (Damaged / Leaked / Wrong Variant):');
                            if (reason) requestOrderReturn(order.id, reason);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3 text-[#0C7779]" />
                          <span>14-Day Return / Exchange</span>
                        </button>
                      )}

                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for cancellation:');
                            if (reason) cancelOrder(order.id, reason);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Your Curated Wishlist</h3>
            <p className="text-xs text-slate-500">Saved formulations for future beauty orders</p>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Your wishlist is empty. Tap the heart icon on any product to save it here!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PROFILE & SECURITY TAB */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-lg">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500">Update your contact information for faster courier checkout</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 border rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Mobile Phone (Courier Contact)</label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="bg-[#005461] hover:bg-[#0C7779] text-white px-5 py-2.5 rounded-lg font-bold"
            >
              Save Profile Changes
            </button>

            {profileSavedMsg && (
              <p className="text-emerald-700 font-semibold text-xs">
                ✓ Profile updated successfully!
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
