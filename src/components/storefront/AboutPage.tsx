import React from 'react';
import { Sparkles, ShieldCheck, Droplets, Users, Award, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();
  const heroImage = '/src/assets/images/velmora_hero_luxury_skincare_1791519501297.jpg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0C7779]">
          The Velmora Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#005461]">
          Pure Clinical Precision Meets Botanical Splendor
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Founded with a simple yet uncompromising philosophy: your skin deserves the highest standard of evidence-backed actives without sacrificing the opulent textures of high French perfumery.
        </p>
      </div>

      {/* Visual Banner */}
      <div className="rounded-2xl overflow-hidden shadow-xl aspect-[21/9] bg-slate-900 border border-slate-100">
        <img
          src={heroImage}
          alt="Velmora Beauty Botanical Philosophy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#005461] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#249E94]" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Formulated for Subtropical Climates
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Many Western formulations are excessively heavy for Pakistani and Middle Eastern heat. Our cloud-light emulsions and invisible SPF shields resist sweat, humidity, and melting.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#005461] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#249E94]" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            100% Ethical & Cruelty-Free
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We never conduct animal testing. All ingredients are ethically sourced, fair-trade certified, and tested strictly on human volunteers under dermatological oversight.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#005461] flex items-center justify-center">
            <Droplets className="w-6 h-6 text-[#249E94]" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Clean INCI Transparency
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zero hidden fragrance compounds, parabens, sulfates, or dangerous bleaching agents. Every active percentage is clearly printed on our glass packaging.
          </p>
        </div>
      </div>

      {/* Sourcing & Labs */}
      <div className="bg-[#005461] text-white rounded-2xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#3BC1A8]">
            Quality Assurance
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Our Laboratories & Distribution
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
            From our primary production facility in Lahore to our international dispatch center in Dubai, each batch is vacuum-sealed and temperature-controlled to ensure that peptides and Vitamin C maintain 100% molecular bio-availability until they reach your vanity.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="bg-[#249E94] hover:bg-[#3BC1A8] text-white hover:text-[#005461] px-6 py-3 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <span>Explore The Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span>Clinical Stability Testing</span>
            <strong className="text-[#3BC1A8]">Passed (ISO-22716)</strong>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span>Dermatologist Safety Clearance</span>
            <strong className="text-[#3BC1A8]">100% Hypoallergenic</strong>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span>Eco-Friendly Glass & Recycled Post-Consumer PCR</span>
            <strong className="text-[#3BC1A8]">92% Sustainable</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Halal & Vegetarian Certified Extracts</span>
            <strong className="text-[#3BC1A8]">Verified</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
