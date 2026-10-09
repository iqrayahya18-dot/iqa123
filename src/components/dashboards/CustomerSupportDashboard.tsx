import React, { useState } from 'react';
import {
  Headphones,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SupportTicket } from '../../types';

export const CustomerSupportDashboard: React.FC = () => {
  const {
    tickets,
    replyToTicket,
    updateTicketStatus,
    currentUser,
    orders,
    formatPrice,
    navigateTo,
  } = useStore();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    tickets[0]?.id || ''
  );
  const [replyMessage, setReplyMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  const relatedOrder = selectedTicket?.orderId
    ? orders.find((o) => o.id === selectedTicket.orderId)
    : null;

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    replyToTicket(selectedTicket.id, replyMessage.trim(), 'customer_support');
    setReplyMessage('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-[#005461]">
            Customer Support Helpdesk
          </h2>
          <p className="text-xs text-slate-500">
            Handle customer requests, routine advice, delivery rescheduling, and returns
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          {['all', 'open', 'in_progress', 'resolved', 'escalated'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] transition-colors ${
                filterStatus === st
                  ? 'bg-[#005461] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Support Grid: Inbox Left + Thread Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tickets Inbox (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredTickets.map((t) => {
            const isSelected = t.id === selectedTicket?.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1.5 text-xs ${
                  isSelected
                    ? 'border-[#005461] bg-[#005461]/5 ring-1 ring-[#005461]'
                    : 'border-slate-200 hover:border-slate-300 bg-[#FBFBF9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#005461]">{t.ticketNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'in_progress'
                        ? 'bg-teal-100 text-teal-800'
                        : t.status === 'escalated'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 truncate">{t.subject}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{t.customerName}</span>
                  <span>{new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Ticket Conversation & Resolution (7 cols) */}
        {selectedTicket ? (
          <div className="lg:col-span-7 bg-[#FBFBF9] p-6 rounded-2xl border border-slate-200 space-y-5">
            {/* Thread Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono font-bold text-xs text-[#005461]">
                  {selectedTicket.ticketNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedTicket.subject}
                </h3>
                <span className="text-xs text-slate-500">
                  Client: <strong>{selectedTicket.customerName}</strong> ({selectedTicket.customerEmail})
                </span>
              </div>

              {/* Status Updater */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Status:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) =>
                    updateTicketStatus(selectedTicket.id, e.target.value as SupportTicket['status'])
                  }
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-xs"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalate to Admin</option>
                </select>
              </div>
            </div>

            {/* Linked Order Notice if available */}
            {relatedOrder && (
              <div className="p-3 bg-white rounded-xl border border-teal-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Linked Order: {relatedOrder.id}</span>
                  <span className="text-slate-500 text-[11px] block">
                    Status: {relatedOrder.orderStatus} · {formatPrice(relatedOrder.total)}
                  </span>
                </div>
                <button
                  onClick={() => navigateTo('order-confirmation', { id: relatedOrder.id })}
                  className="text-[#0C7779] hover:underline font-semibold text-xs"
                >
                  Inspect Order
                </button>
              </div>
            )}

            {/* Conversation Messages */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {selectedTicket.messages.map((msg) => {
                const isSupport = msg.role === 'customer_support' || msg.role === 'super_admin';
                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl text-xs space-y-1 ${
                      isSupport
                        ? 'bg-[#005461] text-white ml-6'
                        : 'bg-white border border-slate-200 text-slate-800 mr-6 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-75">
                      <strong className="font-semibold">{msg.sender} ({msg.role.replace('_', ' ')})</strong>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-slate-200">
              <textarea
                rows={3}
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type response to client... (e.g. dispatched update, tracking notes)"
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#249E94]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#005461] hover:bg-[#0C7779] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
