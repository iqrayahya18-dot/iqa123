import React from 'react';
import {
  CheckCircle2,
  Printer,
  Truck,
  ArrowRight,
  Package,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderConfirmationPage: React.FC = () => {
  const { orders, viewParams, formatPrice, navigateTo } = useStore();

  const orderId = viewParams.id || orders[0]?.id;
  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">No order found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-[#005461] text-white px-5 py-2 rounded-lg text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Notification Banner (Hidden when printing) */}
      <div className="no-print bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950">
          Thank you for choosing Velmora Beauty!
        </h1>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto">
          Your order has been placed successfully and assigned to our fulfillment desk. A confirmation SMS/email has been dispatched to <strong>{order.customerEmail}</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrintInvoice}
            className="bg-[#005461] hover:bg-[#0C7779] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Invoice</span>
          </button>

          <button
            onClick={() => navigateTo('dashboard', { tab: 'orders' })}
            className="bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
          >
            Track in Customer Dashboard
          </button>
        </div>
      </div>

      {/* Luxury Printable Invoice Section */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-lg space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <img
              src="/velmora-botanical-logo.png"
              alt="VELMORA BEAUTY"
              className="h-14 w-auto object-contain rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Velmora Teal Botanical Beauty Logo.png';
              }}
            />
            <div>
              <span className="font-display text-2xl font-bold tracking-wider text-[#005461] uppercase block">
                VELMORA BEAUTY
              </span>
              <span className="text-[11px] font-semibold text-[#0C7779] uppercase tracking-widest block">
                Your Beauty, Your Glow · Official Invoice
              </span>
              <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                Velmora Laboratories & Logistics Hub<br />
                Gulberg III, MM Alam Road, Lahore, Pakistan<br />
                Phone: +92 300 8472911 · care@velmorabeauty.com
              </p>
            </div>
          </div>

          <div className="sm:text-right space-y-1 text-xs">
            <div className="inline-block bg-[#005461] text-white px-3 py-1 rounded font-mono text-sm font-bold">
              ORDER #{order.id}
            </div>
            <p className="text-slate-500 pt-1">
              Tracking: <strong className="font-mono text-slate-900">{order.trackingNumber}</strong>
            </p>
            <p className="text-slate-500">
              Date: <strong className="text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</strong>
            </p>
            <p className="text-slate-500">
              Payment: <strong className="uppercase text-slate-900">{order.paymentMethod.replace('_', ' ')}</strong> ({order.paymentStatus})
            </p>
          </div>
        </div>

        {/* Customer & Delivery Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Customer Information
            </h4>
            <p className="font-semibold text-slate-900">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            <p>{order.customerPhone}</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Delivery Destination
            </h4>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="font-semibold text-slate-900">{order.shippingAddress.country}</p>
            {order.notes && (
              <p className="text-[11px] text-slate-500 italic mt-1">Note: {order.notes}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            Ordered Formulations
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FBFBF9] text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item & Specification</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      {item.selectedVariant && (
                        <div className="text-[11px] text-slate-500">
                          {item.selectedVariant.name}: {item.selectedVariant.value}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{item.sku}</td>
                    <td className="py-3 px-4 text-center tabular-nums font-semibold">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900">
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="flex justify-end pt-2">
          <div className="w-72 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#249E94] font-medium">
                <span>Discount ({order.couponCode})</span>
                <span className="tabular-nums">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Invoice Amount</span>
              <span className="text-[#005461] tabular-nums text-lg">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Live Order Status Timeline */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#249E94]" />
            Shipment Lifecycle & Milestone History
          </h4>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
            {order.statusTimeline.map((milestone, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#005461] ring-4 ring-white" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">
                    {milestone.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(milestone.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">{milestone.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Footer Seal */}
        <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          <p className="font-medium text-slate-600">
            Thank you for trusting Velmora Beauty.
          </p>
          <p className="text-[11px] mt-1">
            Questions regarding this order? Contact our customer support desk 24/7 at care@velmorabeauty.com
          </p>
        </div>
      </div>

      {/* Back to Home CTA */}
      <div className="no-print text-center pt-4">
        <button
          onClick={() => navigateTo('home')}
          className="text-xs font-bold text-[#005461] hover:underline inline-flex items-center gap-1.5"
        >
          <span>Continue Shopping at Velmora Beauty</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
