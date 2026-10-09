import React from 'react';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, Lock, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PolicyProps {
  type: 'shipping' | 'returns' | 'privacy' | 'terms' | 'faq';
}

export const PolicyPage: React.FC<PolicyProps> = ({ type }) => {
  const { navigateTo } = useStore();

  const renderContent = () => {
    switch (type) {
      case 'shipping':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display text-[#005461]">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xs text-slate-500">Last updated: October 2026</p>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-bold text-sm text-slate-900">1. Domestic Deliveries across Pakistan</h3>
              <p>
                Velmora Beauty partners with leading national courier networks (TCS, Leopards, Call Courier, and specialized express city riders) to guarantee safe and expedited delivery across all regions of Pakistan, including major urban metropolitan centers and remote rural districts.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Free Shipping Threshold:</strong> All orders exceeding Rs. 3,000 qualify for 100% Free Standard Nationwide Delivery.</li>
                <li><strong>Standard Courier Fee:</strong> Flat Rs. 250 for orders below Rs. 3,000.</li>
                <li><strong>Delivery Timelines:</strong> 1 to 2 business days for Lahore, Karachi, and Islamabad/Rawalpindi; 2 to 4 business days for other regional districts.</li>
                <li><strong>Cash on Delivery (COD):</strong> Available for all locations without any surcharge.</li>
              </ul>

              <h3 className="font-bold text-sm text-slate-900 pt-4">2. International Shipments</h3>
              <p>
                We proudly deliver to international customers across the United Arab Emirates, Saudi Arabia, the United Kingdom, the United States, and Canada via DHL Express Worldwide.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>International Delivery Time:</strong> 3 to 6 business days.</li>
                <li><strong>Tracking:</strong> Complete real-time airway bill tracking is supplied instantly upon customs documentation clearance.</li>
              </ul>
            </div>
          </div>
        );

      case 'returns':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display text-[#005461]">
              14-Day Returns & Refunds Policy
            </h1>
            <p className="text-xs text-slate-500">Last updated: October 2026</p>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-bold text-sm text-slate-900">1. Our 14-Day Satisfaction Guarantee</h3>
              <p>
                We take immense pride in the craftsmanship and clinical safety of Velmora Beauty formulations. If your product arrived damaged, leaked during transit, or if you received an incorrect variant, you are eligible for an immediate replacement or full refund within 14 calendar days of delivery.
              </p>

              <h3 className="font-bold text-sm text-slate-900 pt-2">2. Conditions for Return</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Products must remain unopened with tamper-evident hygiene seals intact for change-of-mind returns.</li>
                <li>Damaged or defective products require a photo or video submitted through our Customer Support Desk or WhatsApp helpline.</li>
                <li>Refunds are processed within 3 to 5 business days via Bank Transfer, JazzCash/EasyPaisa, or card reversal.</li>
              </ul>

              <h3 className="font-bold text-sm text-slate-900 pt-2">3. How to Initiate a Return</h3>
              <p>
                Simply navigate to your <strong>Customer Dashboard &gt; Orders</strong> and click &ldquo;Request Return&rdquo;, or open a ticket through our Contact Page. Our team will schedule a courier pickup from your doorstep.
              </p>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display text-[#005461]">
              Privacy Policy & Data Security
            </h1>
            <p className="text-xs text-slate-500">Last updated: October 2026</p>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                Velmora Beauty (&ldquo;we&rdquo;, &ldquo;our&rdquo;) is dedicated to protecting your personal information. We maintain rigorous physical, electronic, and administrative safeguards to ensure that customer data remains confidential.
              </p>
              <h3 className="font-bold text-sm text-slate-900">1. Information We Collect</h3>
              <p>
                We only collect data necessary to fulfill purchases and provide personalized customer care: your name, shipping address, contact phone number, and email.
              </p>
              <h3 className="font-bold text-sm text-slate-900 pt-2">2. Zero Payment Data Storage</h3>
              <p>
                We never record or store full credit card numbers, CVVs, or bank login credentials on our servers. All digital transactions are processed directly through certified PCI-DSS compliant payment gateways with 3D-Secure encryption.
              </p>
              <h3 className="font-bold text-sm text-slate-900 pt-2">3. No Third-Party Data Selling</h3>
              <p>
                We strictly do not rent, sell, or trade customer contact details to third-party telemarketers or advertisers.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display text-[#005461]">
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-500">Last updated: October 2026</p>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                By accessing, browsing, or placing an order on the Velmora Beauty website, you acknowledge agreement with our terms and operational policies.
              </p>
              <h3 className="font-bold text-sm text-slate-900">1. Product Usage & Patch Testing</h3>
              <p>
                While our formulations are dermatologically tested, individual biological skin reactions can vary. We strongly recommend conducting a 24-hour patch test on the inner forearm prior to applying new active formulations (such as concentrated Vitamin C, AHA peels, or Retinol).
              </p>
              <h3 className="font-bold text-sm text-slate-900 pt-2">2. Pricing & Currency</h3>
              <p>
                Base prices are shown in Pakistani Rupees (PKR) and may be dynamically converted to USD, AED, GBP, or EUR based on prevailing exchange rates.
              </p>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display text-[#005461]">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-xs text-slate-500">Quick answers to common questions</p>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-white rounded-xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  Is Cash on Delivery available in smaller cities of Pakistan?
                </h4>
                <p>
                  Yes! We offer nationwide Cash on Delivery covering over 450+ cities and tehsils across Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, and Azad Kashmir.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  Does your Vitamin C Serum oxidize quickly in warm weather?
                </h4>
                <p>
                  No. Velmora’s Aura Serum utilizes 20% ethyl ascorbic acid, an advanced stabilized derivative that resists heat and oxidation, maintaining potency without turning dark brown.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  Does Velmora’s Invisible Silk UV Shield leave a white cast?
                </h4>
                <p>
                  Zero white cast. It was specifically formulated and tested on South Asian and deep Fitzpatrick skin tones. It absorbs clear in 10 seconds.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  How can I track my package after ordering?
                </h4>
                <p>
                  You will receive an automated tracking number (e.g. TRK-PK-982341) and can view live milestone progress in your Customer Dashboard anytime.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigateTo('home')}
        className="text-xs text-[#0C7779] hover:underline flex items-center gap-1 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Store</span>
      </button>

      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-100 shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};
