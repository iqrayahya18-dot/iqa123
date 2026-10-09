import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { createTicket, currentUser } = useStore();

  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [orderId, setOrderId] = useState('');
  const [category, setCategory] = useState<'order' | 'delivery' | 'product' | 'return' | 'general'>('order');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedTicketNo, setSubmittedTicketNo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    const ticket = createTicket(
      {
        customerName: name,
        customerEmail: email,
        orderId: orderId || undefined,
        category,
        subject,
        priority: 'medium',
        status: 'open',
      },
      message
    );

    setSubmittedTicketNo(ticket.ticketNumber);
    setSubject('');
    setMessage('');
    setOrderId('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0C7779]">
          Client Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#005461]">
          We Are Here to Assist Your Radiance
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have an inquiry regarding routine advice, order dispatch, or corporate wholesale? Our skincare specialists are on standby.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form Left (7 cols) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          {submittedTicketNo ? (
            <div className="p-6 bg-teal-50 border border-teal-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#0C7779] mx-auto" />
              <h3 className="text-lg font-bold text-[#005461]">
                Ticket #{submittedTicketNo} Created Successfully
              </h3>
              <p className="text-xs text-slate-700">
                Your message has been assigned to our customer support desk. One of our specialists will reply shortly via email and update your support thread.
              </p>
              <button
                onClick={() => setSubmittedTicketNo(null)}
                className="mt-2 px-4 py-2 bg-[#005461] text-white text-xs font-semibold rounded-lg"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Send an Inquiry or Ticket</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Average response time: Under 2 hours during active business hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Iqra Yahya"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Order ID (If Applicable)</label>
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. VB-10482"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Inquiry Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#249E94]"
                    >
                      <option value="order">Order Tracking & Status</option>
                      <option value="delivery">Delivery Address / Rider Coordination</option>
                      <option value="product">Product & Routine Advice</option>
                      <option value="return">14-Day Returns & Exchanges</option>
                      <option value="general">General Feedback / Press</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your question..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Message Details *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide relevant details so our support desk can assist you promptly..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#005461] hover:bg-[#0C7779] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry to Support Desk</span>
                </button>
              </form>
            </>
          )}
        </div>

        {/* Studio Locations & Desks Right (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#005461] text-white p-6 rounded-2xl shadow-md space-y-4">
            <h3 className="text-base font-bold font-display text-white">Direct Assistance</h3>
            <div className="space-y-3 text-xs text-teal-100">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#3BC1A8]" />
                <span>+92 300 8472911 (Pakistan Hotline)</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#3BC1A8]" />
                <span>+971 4 829 1040 (Dubai International)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#3BC1A8]" />
                <span>care@velmorabeauty.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#3BC1A8]" />
                <span>Monday – Saturday: 9:00 AM – 9:00 PM PKT</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Flagship Studios & Hubs
            </h3>

            <div className="space-y-3 divide-y divide-slate-100 text-slate-600">
              <div className="pt-2 first:pt-0">
                <strong className="text-slate-900 block font-bold">Lahore Flagship & Lab</strong>
                <span>Plot 42, MM Alam Road, Gulberg III, Lahore, Punjab, Pakistan</span>
              </div>
              <div className="pt-2">
                <strong className="text-slate-900 block font-bold">Karachi Hub</strong>
                <span>Suite 602, Executive Tower, Clifton Block 4, Karachi, Sindh, Pakistan</span>
              </div>
              <div className="pt-2">
                <strong className="text-slate-900 block font-bold">Dubai International Logistics</strong>
                <span>Level 14, Prime Tower, Business Bay, Dubai, UAE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
