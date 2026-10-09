import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  CreditCard,
  Heart,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const {
    navigateTo,
    subscribeNewsletter,
    setIsAdminPasswordModalOpen,
    isAdminUnlocked,
    currentUser,
  } = useStore();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribeNewsletter(email);
    setFeedback(res.message);
    if (res.success) setEmail('');
  };

  return (
    <footer className="bg-[#005461] text-[#FBFBF9] pt-16 pb-12 border-t border-[#0C7779]">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#0C7779]/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#0C7779] text-[#3BC1A8] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nationwide & Global Delivery</h4>
              <p className="text-xs text-teal-100/70 mt-1">
                Fast courier across all cities in Pakistan. DHL Express worldwide for international orders.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#0C7779] text-[#3BC1A8] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery & Secure Pay</h4>
              <p className="text-xs text-teal-100/70 mt-1">
                Pay cash upon doorstep arrival anywhere in Pakistan or via secure credit card and Meezan Bank.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#0C7779] text-[#3BC1A8] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Clinical Actives</h4>
              <p className="text-xs text-teal-100/70 mt-1">
                Cruelty-free formulas, dermatologist tested, manufactured in ISO-certified botanical laboratories.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#0C7779] text-[#3BC1A8] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">14-Day Hassle-Free Returns</h4>
              <p className="text-xs text-teal-100/70 mt-1">
                Unopened products eligible for simple return, refund, or exchange with dedicated customer support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/velmora-botanical-logo.png"
                alt="VELMORA BEAUTY Botanical Logo"
                className="h-12 w-auto object-contain rounded-lg bg-white/10 p-1 backdrop-blur-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/Velmora Teal Botanical Beauty Logo.png';
                }}
              />
              <div>
                <span className="font-display text-2xl font-bold tracking-wider text-white uppercase block leading-none">
                  VELMORA BEAUTY
                </span>
                <p className="text-[10px] font-semibold tracking-widest text-[#3BC1A8] uppercase mt-1">
                  Your Beauty, Your Glow.
                </p>
              </div>
            </div>
            <p className="text-xs text-teal-100/80 leading-relaxed max-w-sm">
              Velmora Beauty bridges luxury sensorial skincare with clinically verified active ingredients. Formulated specifically to nourish, brighten, and protect complexions across Pakistani climates and global lifestyles.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-bold text-white block mb-2">
                Join the Velmora VIP Circle
              </span>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for 15% off..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-lg bg-[#0C7779]/80 border border-teal-400/30 text-white placeholder-teal-200/50 focus:outline-none focus:border-[#3BC1A8]"
                />
                <button
                  type="submit"
                  className="bg-[#249E94] hover:bg-[#3BC1A8] text-white hover:text-[#005461] px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {feedback && (
                <p className="text-[11px] text-[#3BC1A8] mt-1.5 font-medium">{feedback}</p>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#3BC1A8] uppercase mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-teal-100/80">
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Face serums' })}
                  className="hover:text-white transition-colors"
                >
                  Face Serums & Ampoules
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Moisturizers' })}
                  className="hover:text-white transition-colors"
                >
                  Moisturizers & Night Balms
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Sunscreens' })}
                  className="hover:text-white transition-colors"
                >
                  Sunscreens & UV Shields
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Makeup essentials' })}
                  className="hover:text-white transition-colors"
                >
                  Makeup & Lip Glazes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Hair care' })}
                  className="hover:text-white transition-colors"
                >
                  Scalp & Hair Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Beauty tools and accessories' })}
                  className="hover:text-white transition-colors"
                >
                  Gua Sha & Beauty Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#3BC1A8] uppercase mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-teal-100/80">
              <li>
                <button
                  onClick={() => navigateTo('policy-shipping')}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy-returns')}
                  className="hover:text-white transition-colors"
                >
                  14-Day Returns & Refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy-privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy-terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors"
                >
                  Track My Shipment
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Studios */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#3BC1A8] uppercase mb-4">
              Studios & Support
            </h4>
            <div className="space-y-3 text-xs text-teal-100/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#3BC1A8] shrink-0 mt-0.5" />
                <span>
                  <strong>Lahore Flagship:</strong> Gulberg III, MM Alam Road, Lahore, Pakistan
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#3BC1A8] shrink-0 mt-0.5" />
                <span>
                  <strong>Global Desk:</strong> Business Bay, Downtown Dubai, UAE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#3BC1A8] shrink-0" />
                <span>+92 300 8472911 / +971 4 829 1040</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#3BC1A8] shrink-0" />
                <span>care@velmorabeauty.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Provider Badges & Admin Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#0C7779]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-200/70">
        <div className="flex flex-wrap items-center gap-2">
          <span>&copy; 2026 VELMORA BEAUTY. All rights reserved.</span>
          <span aria-hidden="true">·</span>
          <span>Crafted with clinical integrity.</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => {
              if (currentUser.role === 'super_admin' && isAdminUnlocked) {
                navigateTo('dashboard');
              } else {
                setIsAdminPasswordModalOpen(true);
              }
            }}
            className="text-[#3BC1A8] hover:text-white inline-flex items-center gap-1.5 font-bold transition-colors cursor-pointer bg-[#005461] hover:bg-[#0C7779] px-2.5 py-1 rounded-lg border border-teal-400/30 shadow-sm"
            title="Super Admin Portal (Iqra Yahya) - Password Protected"
          >
            <Lock className="w-3.5 h-3.5 text-[#3BC1A8]" />
            <span>Super Admin (پاسورڈ درج کر کے اوپن کریں)</span>
          </button>
        </div>

        {/* Payment badges */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-white/90">
          <span className="px-2 py-0.5 bg-[#0C7779] rounded">Cash on Delivery</span>
          <span className="px-2 py-0.5 bg-[#0C7779] rounded">Meezan Bank</span>
          <span className="px-2 py-0.5 bg-[#0C7779] rounded">Visa / Mastercard</span>
          <span className="px-2 py-0.5 bg-[#0C7779] rounded">JazzCash / EasyPaisa</span>
        </div>
      </div>
    </footer>
  );
};
