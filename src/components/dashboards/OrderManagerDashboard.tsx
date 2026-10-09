import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Order } from '../../types';

export const OrderManagerDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    assignDeliveryStaff,
    formatPrice,
    navigateTo,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.orderStatus === statusFilter;
  });

  const ridersList = [
    { id: 'usr-delivery', name: 'Tariq Mehmood (Express Rider - Islamabad/Rawalpindi)' },
    { id: 'usr-rider-2', name: 'Kamran Ali (Karachi Hub Courier)' },
    { id: 'usr-rider-3', name: 'Zeeshan Butt (Lahore Express Van)' },
    { id: 'usr-dhl', name: 'DHL Express Global (International Airway)' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-[#005461]">
            Order Fulfillment & Logistics Pipeline
          </h2>
          <p className="text-xs text-slate-500">
            Verify payment authenticity, prepare packing slips, and assign courier riders
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'processing', label: 'Packing' },
            { id: 'assigned', label: 'Assigned' },
            { id: 'out_for_delivery', label: 'Out' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#005461] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FBFBF9] text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Order #</th>
              <th className="py-2.5 px-3">Customer & Contact</th>
              <th className="py-2.5 px-3">Address & City</th>
              <th className="py-2.5 px-3">Payment</th>
              <th className="py-2.5 px-3">Assign Delivery Staff</th>
              <th className="py-2.5 px-3">Status Pipeline</th>
              <th className="py-2.5 px-3 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-3">
                  <span className="font-mono font-bold text-[#005461] block">{o.id}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{o.trackingNumber}</span>
                  <span className="text-slate-900 font-bold tabular-nums block mt-1">
                    {formatPrice(o.total)}
                  </span>
                </td>

                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{o.customerName}</div>
                  <div className="text-slate-500 text-[11px]">{o.customerPhone}</div>
                  <div className="text-slate-400 text-[10px]">{o.customerEmail}</div>
                </td>

                <td className="py-3 px-3 max-w-xs">
                  <div className="text-slate-700 font-medium truncate">{o.shippingAddress.street}</div>
                  <div className="text-slate-500 text-[11px]">
                    {o.shippingAddress.city}, {o.shippingAddress.country}
                  </div>
                  {o.notes && (
                    <div className="text-[10px] text-amber-700 italic truncate mt-0.5">
                      Note: {o.notes}
                    </div>
                  )}
                </td>

                <td className="py-3 px-3">
                  <span className="uppercase font-bold text-slate-800">{o.paymentMethod.replace('_', ' ')}</span>
                  <div className="pt-0.5">
                    {o.paymentStatus === 'paid' ? (
                      <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                        PAID VERIFIED
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded">
                        PAYMENT PENDING
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-3">
                  <select
                    value={o.assignedStaffId || ''}
                    onChange={(e) => {
                      const rider = ridersList.find((r) => r.id === e.target.value);
                      if (rider) {
                        assignDeliveryStaff(o.id, rider.id, rider.name);
                      }
                    }}
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] max-w-[180px]"
                  >
                    <option value="">-- Assign Rider --</option>
                    {ridersList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="py-3 px-3">
                  <select
                    value={o.orderStatus}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold"
                  >
                    <option value="pending">1. Pending</option>
                    <option value="confirmed">2. Confirmed</option>
                    <option value="processing">3. Processing & Packing</option>
                    <option value="packed">4. Packed (Sealed)</option>
                    <option value="assigned">5. Assigned to Courier</option>
                    <option value="out_for_delivery">6. Out for Delivery</option>
                    <option value="delivered">7. Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => navigateTo('order-confirmation', { id: o.id })}
                    className="p-1.5 rounded bg-slate-100 hover:bg-[#005461] hover:text-white transition-colors"
                    title="Print Invoice / Packing Slip"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
