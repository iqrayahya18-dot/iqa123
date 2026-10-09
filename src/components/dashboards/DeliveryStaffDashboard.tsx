import React, { useState } from 'react';
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Banknote,
  Clock,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';

export const DeliveryStaffDashboard: React.FC = () => {
  const {
    orders,
    currentUser,
    updateOrderStatus,
    toggleCodCollected,
    formatPrice,
  } = useStore();

  // Strict Least-Privilege Filter: Delivery staff sees ONLY orders assigned to them!
  const myAssignedOrders = orders.filter(
    (o) => o.assignedStaffId === currentUser.id || o.assignedStaffId === 'usr-delivery'
  );

  const [deliveryNote, setDeliveryNote] = useState<Record<string, string>>({});

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    const note = deliveryNote[orderId] || `Courier status updated to ${status}`;
    updateOrderStatus(orderId, status, note);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-[#005461]">
            Courier Rider Delivery Manifest
          </h2>
          <p className="text-xs text-slate-500">
            Assigned to: <strong className="text-slate-900">{currentUser.name}</strong> · Restricted courier privileges only
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-600" />
          <span>{myAssignedOrders.length} Deliveries in Manifest</span>
        </div>
      </div>

      {/* Manifest List */}
      {myAssignedOrders.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-xs space-y-2">
          <Package className="w-10 h-10 mx-auto text-slate-300" />
          <p>No deliveries currently assigned to your shift route.</p>
          <p className="text-[11px] text-slate-400">
            Check in with dispatch when new packages are sealed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myAssignedOrders.map((order) => {
            const isCOD = order.paymentMethod === 'cod';

            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-slate-200 bg-[#FBFBF9] space-y-4 hover:border-[#249E94] transition-all"
              >
                {/* Top line */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#005461]">
                      {order.id}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Tracking: {order.trackingNumber}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'out_for_delivery'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-100 text-[#005461]'
                    }`}
                  >
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Customer & Address Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Recipient Contact</span>
                    <h4 className="text-sm font-bold text-slate-900">{order.customerName}</h4>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Customer ({order.customerPhone})</span>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Doorstep Address</span>
                    <div className="flex items-start gap-1.5 text-slate-800 font-medium">
                      <MapPin className="w-4 h-4 text-[#005461] shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.country}
                      </span>
                    </div>
                    {order.notes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-1">
                        <strong>Delivery Instructions:</strong> {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* COD Collection Module */}
                {isCOD && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Cash on Delivery to Collect:
                        </span>
                        <span className="text-sm font-extrabold text-[#005461] tabular-nums">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCodCollected(order.id, !order.codCollected)}
                      className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                        order.codCollected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }`}
                    >
                      {order.codCollected
                        ? '✓ COD Cash Collected & Confirmed'
                        : 'Confirm Cash Collected (Tap When Paid)'}
                    </button>
                  </div>
                )}

                {/* Delivery Status Updater */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700">Update Status:</span>

                  <button
                    onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                    className="px-3 py-1.5 rounded-lg font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                  >
                    Out for Delivery
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                    className="px-3.5 py-1.5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    ✓ Mark as Delivered
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt('Reason for failed delivery (e.g. Customer unreachable / Rescheduled):');
                      if (reason) {
                        updateOrderStatus(order.id, 'failed_delivery', reason);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                  >
                    Failed Attempt / Reschedule
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
