import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Droplets,
  Heart,
  Tag,
  Check,
  Copy,
  Crown,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { CATEGORIES_DATA } from '../../data/products';
import { ProductCategory } from '../../types';

export const HomePage: React.FC = () => {
  const {
    products,
    navigateTo,
    formatPrice,
    applyCoupon,
    isAdminUnlocked,
    setIsAdminPasswordModalOpen,
  } = useStore();

  const heroImage = '/src/assets/images/velmora_hero_luxury_skincare_1791519501297.jpg';
  const serumImage = '/src/assets/images/velmora_serum_showcase_1791519519360.jpg';
  const creamImage = '/src/assets/images/velmora_moisturizer_cream_1791519531287.jpg';
  const cleanserImage = '/src/assets/images/velmora_cleanser_botanical_1791519549373.jpg';

  const [activeColorStep, setActiveColorStep] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Curated lists
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival || p.isFeatured).slice(0, 4);

  // The 4-Step Radiance Sequence with Velmora brand colors:
  // #005461 -> #0C7779 -> #249E94 -> #3BC1A8
  const radianceSequence = [
    {
      step: '01',
      hex: '#005461',
      name: 'Deep Teal Purifying',
      tagline: 'Deep Purification & Clarification',
      category: 'Face cleansers and face washes' as ProductCategory,
      description:
        'Botanical willow bark, gentle AHA ferment, and antioxidant tea tree elixir melt impurities while respecting your lipid barrier.',
      featuredProducts: products.filter((p) => p.category === 'Face cleansers and face washes').slice(0, 2),
      bgStyle: { backgroundColor: '#005461' },
      textColor: 'text-white',
      badgeBg: 'bg-[#3BC1A8] text-[#005461]',
      accentColor: '#3BC1A8',
      buttonBg: 'bg-[#3BC1A8] text-[#005461] hover:bg-white',
    },
    {
      step: '02',
      hex: '#0C7779',
      name: 'Dark Teal Cellular Bright',
      tagline: 'Potent Cellular Glow & Brightening',
      category: 'Face serums' as ProductCategory,
      description:
        '20% Stabilized ethyl ascorbic acid, multi-molecular hyaluronic acid, and botanical niacinamide fade hyperpigmentation effortlessly.',
      featuredProducts: products.filter((p) => p.category === 'Face serums').slice(0, 2),
      bgStyle: { backgroundColor: '#0C7779' },
      textColor: 'text-white',
      badgeBg: 'bg-[#3BC1A8] text-[#005461]',
      accentColor: '#3BC1A8',
      buttonBg: 'bg-[#3BC1A8] text-[#005461] hover:bg-white',
    },
    {
      step: '03',
      hex: '#249E94',
      name: 'Emerald Teal Moisture Seal',
      tagline: 'Delicate Barrier Cushion & Moisture Lock',
      category: 'Moisturizers' as ProductCategory,
      description:
        'Ceramide complex, bio-fermented peptide crème, and velvety centella hydrosol envelop stressed skin in dewy softness.',
      featuredProducts: products.filter((p) => p.category === 'Moisturizers').slice(0, 2),
      bgStyle: { backgroundColor: '#249E94' },
      textColor: 'text-white',
      badgeBg: 'bg-[#005461] text-[#3BC1A8]',
      accentColor: '#005461',
      buttonBg: 'bg-[#005461] text-white hover:bg-white hover:text-[#005461]',
    },
    {
      step: '04',
      hex: '#3BC1A8',
      name: 'Mint Green Luminescence',
      tagline: 'Golden Luminescence & Environmental Defense',
      category: 'Sunscreens' as ProductCategory,
      description:
        'Invisible Silk UV Shield SPF 50+ PA++++ with golden micro-pearls and peptides provides all-day radiant reflection with zero white cast.',
      featuredProducts: products.filter((p) => p.category === 'Sunscreens').slice(0, 2),
      bgStyle: { backgroundColor: '#3BC1A8' },
      textColor: 'text-[#005461]',
      badgeBg: 'bg-[#005461] text-white',
      accentColor: '#005461',
      buttonBg: 'bg-[#005461] text-white hover:bg-[#0C7779]',
    },
  ];

  const handleApplyVipCoupon = () => {
    applyCoupon('VELMORA15');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 0. Top Architectural Color Sequence Ribbon */}
      <div className="w-full bg-gradient-to-r from-[#005461] via-[#0C7779] via-[#249E94] to-[#3BC1A8] text-white py-2 px-4 shadow-sm border-b border-black/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wider uppercase text-[11px] drop-shadow-sm text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#3BC1A8]" />
            <span>The Velmora Quad Glow Ritual · Deep Teal to Mint Green</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1 font-semibold text-white drop-shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005461] border border-white/60 inline-block" />
              <span>Deep Teal</span>
            </span>
            <span className="text-white/60">➔</span>
            <span className="inline-flex items-center gap-1 font-semibold text-white drop-shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0C7779] border border-white/60 inline-block" />
              <span>Dark Teal</span>
            </span>
            <span className="text-white/60">➔</span>
            <span className="inline-flex items-center gap-1 font-semibold text-white drop-shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#249E94] border border-white/60 inline-block" />
              <span>Emerald Teal</span>
            </span>
            <span className="text-white/60">➔</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#005461] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3BC1A8] border border-[#005461]/30 inline-block" />
              <span>Mint Green</span>
            </span>
          </div>
        </div>
      </div>

      {/* 1. Hero Section: Architectural Luxury Split Banner */}
      <section className="relative bg-[#FBFBF9] border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Official Brand Seal with Logo */}
              <div className="flex items-center gap-3">
                <img
                  src="/velmora-botanical-logo.png"
                  alt="VELMORA BEAUTY Botanical Logo"
                  className="h-14 sm:h-16 w-auto object-contain rounded-xl p-1 bg-white shadow-md border border-teal-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/Velmora Teal Botanical Beauty Logo.png';
                  }}
                />
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#005461]">
                    <Sparkles className="w-3.5 h-3.5 text-[#249E94]" />
                    <span>VELMORA BEAUTY</span>
                  </div>
                  <p className="text-[11px] font-semibold tracking-wider text-[#0C7779] uppercase">
                    Your Beauty, Your Glow.
                  </p>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#005461] leading-[1.1] tracking-tight font-display">
                Your Beauty, <br />
                <span className="italic font-normal text-[#249E94]">Your Glow.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Clinical active ingredients harmonized with rare botanical elixirs. Engineered to nourish, clarify, and protect your skin across Pakistan and international climates.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigateTo('shop')}
                  className="bg-[#005461] hover:bg-[#0C7779] text-white px-7 py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Shop Full Catalog (160+)</span>
                  <ArrowRight className="w-4 h-4 text-[#3BC1A8] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('radiance-sequence-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-teal-50 text-[#005461] border border-[#249E94]/40 px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#249E94]" />
                  <span>The 4-Step Radiance Ritual</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 text-xs text-slate-500">
                <div>
                  <strong className="block text-slate-900 font-bold text-sm">160+</strong>
                  <span>Tested Formulas</span>
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold text-sm">Cash on Delivery</strong>
                  <span>Nationwide in Pakistan</span>
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold text-sm">DHL Express</strong>
                  <span>Worldwide Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 aspect-[16/10] lg:aspect-[4/3] bg-slate-100">
                <img
                  src={heroImage}
                  alt="Velmora Luxury Skincare Collection"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Product Callout */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-teal-50">
                      <img
                        src={serumImage}
                        alt="Aura Serum"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-[#005461] block truncate">
                        Aura 20% Vitamin C Serum
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Our #1 Bestseller · {formatPrice(4250)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Guarantee Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#249E94] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Authentic Guarantee</h4>
              <p className="text-[11px] text-slate-500">100% Genuine Clinical Actives</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-[#249E94] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fast Express Shipping</h4>
              <p className="text-[11px] text-slate-500">Doorstep delivery nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Droplets className="w-6 h-6 text-[#249E94] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Cruelty-Free & Pure</h4>
              <p className="text-[11px] text-slate-500">Sulfate-free & paraben-free</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-6 h-6 text-[#249E94] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">14-Day Easy Returns</h4>
              <p className="text-[11px] text-slate-500">Stress-free exchanges</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Velmora Radiance Quad: The 4-Step Color Sequence Showcase */}
      <section
        id="radiance-sequence-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#005461]/10 text-[#005461] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#249E94]" />
              <span>Signature Color Harmony Sequence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#005461]">
              The Velmora Radiance Sequence
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Experience radiant beauty through four carefully sequenced steps. From deep teal botanical purification to radiant mint luminescence.
            </p>
          </div>

          {/* Sequential Swatch Selector */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            {radianceSequence.map((item, idx) => (
              <button
                key={item.step}
                onClick={() => setActiveColorStep(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeColorStep === idx
                    ? 'shadow-md scale-105 ring-2 ring-offset-1 ring-slate-400'
                    : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: item.hex,
                  color: idx <= 2 ? '#FFFFFF' : '#005461',
                }}
              >
                <span>Step {item.step}</span>
                <span className="w-2.5 h-2.5 rounded-full border border-current" />
              </button>
            ))}
          </div>
        </div>

        {/* 4 Sequential Luxury Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {radianceSequence.map((item, idx) => {
            const isSelected = activeColorStep === idx;
            return (
              <div
                key={item.step}
                onClick={() => setActiveColorStep(idx)}
                className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-lg relative flex flex-col justify-between overflow-hidden border ${
                  isSelected
                    ? 'ring-4 ring-offset-2 ring-[#005461] scale-[1.02]'
                    : 'hover:scale-[1.01]'
                }`}
                style={{
                  backgroundColor: item.hex,
                  borderColor: idx <= 2 ? 'rgba(255,255,255,0.2)' : 'rgba(0,84,97,0.2)',
                }}
              >
                {/* Background Shimmer Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${item.badgeBg}`}
                    >
                      Step {item.step}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold tracking-wider ${item.textColor} opacity-80`}
                    >
                      {item.hex}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-xl font-bold font-display ${item.textColor}`}>
                      {item.name}
                    </h3>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider mt-0.5 opacity-90 ${item.textColor}`}
                    >
                      {item.tagline}
                    </p>
                  </div>

                  <p className={`text-xs leading-relaxed opacity-85 ${item.textColor}`}>
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-black/10 relative z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('shop', { category: item.category });
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${item.buttonBg}`}
                  >
                    <span>Shop Step {item.step}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Spotlight for the Selected Step */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-xl text-white transition-all duration-300 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${radianceSequence[activeColorStep].hex} 0%, #005461 100%)`,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#3BC1A8]" />
                <span>Featured Step {radianceSequence[activeColorStep].step} · {radianceSequence[activeColorStep].name}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {radianceSequence[activeColorStep].tagline}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                {radianceSequence[activeColorStep].description}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() =>
                    navigateTo('shop', { category: radianceSequence[activeColorStep].category })
                  }
                  className="bg-[#3BC1A8] text-[#005461] hover:bg-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore {radianceSequence[activeColorStep].category}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateTo('shop')}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-sm transition-colors"
                >
                  Browse All Collections
                </button>
              </div>
            </div>

            {/* Quick mini-cards of products in this step */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {radianceSequence[activeColorStep].featuredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateTo('product-detail', { id: p.id })}
                  className="bg-white text-slate-900 rounded-xl p-3 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 mb-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold line-clamp-1">{p.name}</h4>
                    <span className="text-[11px] font-bold text-[#005461] mt-1 block">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shop by Category (12 Luxury Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0C7779]">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#005461] mt-1">
              Shop by Beauty Category
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-[#0C7779] hover:text-[#005461] flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All 12 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES_DATA.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <div
                key={cat.slug}
                onClick={() => navigateTo('shop', { category: cat.name })}
                className="group bg-white rounded-xl border border-slate-100 hover:border-[#249E94] p-3 text-center cursor-pointer transition-all duration-300 hover:shadow-md flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 bg-slate-50 border border-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#005461] transition-colors line-clamp-2">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 mt-1">
                  {count} Products
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Featured Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0C7779]">
              Most Loved Formulations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#005461] mt-1">
              Velmora Bestsellers
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop', { filter: 'bestseller' })}
            className="text-xs font-bold text-[#0C7779] hover:text-[#005461] flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>See All Bestsellers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. Curated VIP Quad Glow Offer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-12 border border-teal-400/30 bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] text-white">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3BC1A8] text-[#005461] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated by Iqra Yahya · Exclusive VIP Privilege</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold font-display text-white">
              The Signature Glow Ritual
            </h3>

            <p className="text-sm text-teal-100/90 leading-relaxed">
              Unlock a transformative 15% discount across all 160+ clinical formulations. Free express shipping nationwide across Pakistan on orders above Rs. 3,000.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="bg-black/30 backdrop-blur-sm border border-teal-300/40 px-4 py-2.5 rounded-xl font-mono text-sm font-bold text-[#3BC1A8] flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>VELMORA15</span>
              </div>

              <button
                onClick={handleApplyVipCoupon}
                className="bg-[#3BC1A8] hover:bg-white text-[#005461] px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {copiedCoupon ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coupon Applied (15% Off)!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply 15% Discount</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigateTo('shop')}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors backdrop-blur-sm"
              >
                Explore Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Spotlight Editorial Duo (Serum & Cream) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Vitamin C Serum Spotlight */}
          <div className="bg-[#005461] text-white rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 sm:grid-cols-2">
            <div className="p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#3BC1A8]">
                  Clinical Spotlight
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  Aura 20% Vitamin C Radiance
                </h3>
                <p className="text-xs text-teal-100/80 mt-2 leading-relaxed">
                  20% stabilized ethyl ascorbic acid and ferulic acid. Fades stubborn melasma and sun spots without oxidation.
                </p>
              </div>

              <div>
                <span className="text-sm font-bold text-white block mb-3 tabular-nums">
                  From {formatPrice(4250)}
                </span>
                <button
                  onClick={() => navigateTo('product-detail', { id: 'prod-15' })}
                  className="bg-[#249E94] hover:bg-[#3BC1A8] text-white hover:text-[#005461] px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Shop Formulation
                </button>
              </div>
            </div>

            <div className="h-56 sm:h-auto bg-slate-900">
              <img
                src={serumImage}
                alt="Aura Serum Showcase"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: Emerald Revitalize Cream */}
          <div className="bg-[#0C7779] text-white rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 sm:grid-cols-2">
            <div className="p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#3BC1A8]">
                  Barrier Mastery
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  Emerald Revitalize Facial Crème
                </h3>
                <p className="text-xs text-teal-100/80 mt-2 leading-relaxed">
                  Rich botanical squalane, multi-peptides, and emerald algae in heavy frosted luxury glass.
                </p>
              </div>

              <div>
                <span className="text-sm font-bold text-white block mb-3 tabular-nums">
                  From {formatPrice(4800)}
                </span>
                <button
                  onClick={() => navigateTo('product-detail', { id: 'prod-31' })}
                  className="bg-[#3BC1A8] hover:bg-white text-[#005461] px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Shop Formulation
                </button>
              </div>
            </div>

            <div className="h-56 sm:h-auto bg-slate-900">
              <img
                src={creamImage}
                alt="Emerald Cream Showcase"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews & Verified Experiences */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0C7779]">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#005461]">
              Loved by Skin Enthusiasts
            </h2>
            <p className="text-xs text-slate-500">
              Honest impressions from customers across Lahore, Karachi, Islamabad, Dubai, and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-slate-100 space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                &ldquo;Faded my melasma in 3 weeks&rdquo;
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                &ldquo;Velmora’s 20% ethyl ascorbic acid formula is stable, doesn’t cause stinging, and faded my post-summer melasma patches in under 3 weeks. Incredible texture!&rdquo;
              </p>
              <div className="pt-2 text-xs text-slate-500 border-t border-slate-200/60">
                <strong className="text-slate-900 font-bold block">Dr. Mariam Farooq</strong>
                <span>Verified Buyer · Lahore</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-slate-100 space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                &ldquo;Zero white cast on medium skin&rdquo;
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                &ldquo;Nearly every sunscreen makes me look purple. Velmora’s Invisible Silk UV Shield absorbs in 10 seconds with zero white cast and zero eye stinging. Already on my second bottle!&rdquo;
              </p>
              <div className="pt-2 text-xs text-slate-500 border-t border-slate-200/60">
                <strong className="text-slate-900 font-bold block">Hira Shah</strong>
                <span>Verified Buyer · Karachi</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-slate-100 space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                &ldquo;Pure luxury in a jar&rdquo;
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                &ldquo;The frosted heavy glass jar alone feels like a high-end French perfume brand. The cream itself melts like silk into the skin. Waking up with glowing skin every single day.&rdquo;
              </p>
              <div className="pt-2 text-xs text-slate-500 border-t border-slate-200/60">
                <strong className="text-slate-900 font-bold block">Sana Tariq</strong>
                <span>Verified Buyer · Islamabad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. New Arrivals Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0C7779]">
              Latest Formulations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#005461] mt-1">
              New Arrivals & Innovations
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop', { filter: 'new' })}
            className="text-xs font-bold text-[#0C7779] hover:text-[#005461] flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 10. Instagram Aesthetic Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0C7779]">
            @VelmoraBeauty
          </span>
          <h2 className="text-2xl font-bold font-display text-[#005461]">
            Follow the Glow Ritual
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 group">
            <img
              src={cleanserImage}
              alt="Cleanser Botanical Ritual"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 group">
            <img
              src={serumImage}
              alt="Serum Dew Drops"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 group">
            <img
              src={creamImage}
              alt="Emerald Cream Texture"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 group">
            <img
              src={heroImage}
              alt="Velmora Vanity Ritual"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Executive Administration Access Banner for Iqra Yahya */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] rounded-2xl p-6 text-white shadow-xl border border-teal-400/30 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#3BC1A8] text-[#005461] flex items-center justify-center shrink-0 shadow-md">
              <Crown className="w-7 h-7 text-[#005461]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#3BC1A8] text-[10px] font-bold tracking-wider uppercase mb-1 border border-teal-300/20">
                <span>Executive Management Suite</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                Iqra Yahya · Super Admin Master Portal
              </h3>
              <p className="text-xs text-teal-100/90 max-w-xl">
                ایڈمن پینل مکمل طور پر پاسورڈ سے محفوظ ہے۔ درست پاسورڈ درج کرنے پر فوری اوپن ہوگا۔ پاسورڈ کے بغیر رسائی ممکن نہیں۔
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (isAdminUnlocked) {
                  navigateTo('dashboard');
                } else {
                  setIsAdminPasswordModalOpen(true);
                }
              }}
              className="bg-[#3BC1A8] hover:bg-white text-[#005461] font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <Lock className="w-4 h-4 text-[#005461]" />
              <span>{isAdminUnlocked ? 'Open Super Admin Panel (اوپن)' : 'پاسورڈ درج کر کے ایڈمن اوپن کریں'}</span>
              <ArrowRight className="w-4 h-4 text-[#005461]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
