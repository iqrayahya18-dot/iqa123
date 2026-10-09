import React, { useState } from 'react';
import {
  Megaphone,
  Tag,
  Mail,
  Download,
  Plus,
  TrendingUp,
  Percent,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MarketingManagerDashboard: React.FC = () => {
  const {
    coupons,
    addCoupon,
    toggleCouponActive,
    newsletterEmails,
    formatPrice,
  } = useStore();

  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState(20);
  const [newMin, setNewMin] = useState(4000);
  const [showModal, setShowModal] = useState(false);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    addCoupon({
      code: newCode.trim().toUpperCase(),
      discountPercent: newPercent,
      minOrderValue: newMin,
      validUntil: '2026-12-31',
      isActive: true,
      description: `${newPercent}% seasonal VIP discount over ${formatPrice(newMin)}`,
    });

    setShowModal(false);
    setNewCode('');
  };

  const exportSubscribersCSV = () => {
    const rows = [['Email', 'Subscribed At', 'Status'], ...newsletterEmails.map((e) => [e, '2026-10-01', 'Active'])];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'velmora_newsletter_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-[#005461]">
            Marketing Campaigns & Audience Hub
          </h2>
          <p className="text-xs text-slate-500">
            Create coupon promotions, manage VIP announcements, and export newsletter audience
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#005461] hover:bg-[#0C7779] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Promo Campaign</span>
        </button>
      </div>

      {/* Analytics KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
          <span className="text-xs font-semibold text-purple-900">VIP Newsletter Subscribers</span>
          <h3 className="text-2xl font-bold text-purple-950 tabular-nums">
            {newsletterEmails.length} Readers
          </h3>
          <p className="text-[11px] text-purple-700">Clean opt-in audience from storefront</p>
        </div>

        <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
          <span className="text-xs font-semibold text-teal-900">Active Coupon Campaigns</span>
          <h3 className="text-2xl font-bold text-teal-950 tabular-nums">
            {coupons.filter((c) => c.isActive).length} Active Codes
          </h3>
          <p className="text-[11px] text-teal-700">Currently redeemable in customer bag</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
          <span className="text-xs font-semibold text-emerald-900">Promotional Redemptions</span>
          <h3 className="text-2xl font-bold text-emerald-950 tabular-nums">
            {coupons.reduce((sum, c) => sum + c.usageCount, 0)} Redemptions
          </h3>
          <p className="text-[11px] text-emerald-700">Tracked checkout discount activations</p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Active Discount Campaigns
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-[#FBFBF9] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-[#005461]">{c.code}</span>
                <button
                  onClick={() => toggleCouponActive(c.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.isActive ? 'Live' : 'Paused'}
                </button>
              </div>
              <p className="text-slate-600">{c.description}</p>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                <span>Usage: {c.usageCount}</span>
                <span>Min: {formatPrice(c.minOrderValue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Subscribers Table */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Newsletter Subscribers ({newsletterEmails.length})
          </h3>
          <button
            onClick={exportSubscribersCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Subscribers CSV</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FBFBF9] text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Subscriber Email</th>
                <th className="py-2 px-3">Source Channel</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {newsletterEmails.map((email, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 font-mono text-slate-800">{email}</td>
                  <td className="py-2.5 px-3 text-slate-500">Storefront VIP Footer</td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                      Subscribed & Consented
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Promo */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 font-display">New Marketing Campaign</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. FLASH30"
                  className="w-full px-3 py-2 border rounded-lg uppercase font-mono"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Discount %</label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={newPercent}
                  onChange={(e) => setNewPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Min Order Threshold (PKR)</label>
                <input
                  type="number"
                  value={newMin}
                  onChange={(e) => setNewMin(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005461] text-white rounded-lg font-bold"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
