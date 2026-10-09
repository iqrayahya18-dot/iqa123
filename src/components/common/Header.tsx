import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Globe,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Truck,
  Sparkles,
  Crown,
  Lock,
  KeyRound,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CurrencyCode, ProductCategory } from '../../types';
import { CATEGORIES_DATA } from '../../data/products';

export const Header: React.FC = () => {
  const {
    currentCurrency,
    setCurrency,
    cartCount,
    wishlist,
    currentUser,
    navigateTo,
    setIsCartDrawerOpen,
    setIsRoleModalOpen,
    setIsQuickSearchOpen,
    currentView,
    isAdminUnlocked,
    setIsAdminPasswordModalOpen,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const roleDisplayNames: Record<string, string> = {
    super_admin: 'Super Admin',
    product_manager: 'Product Mgr',
    order_manager: 'Order Mgr',
    delivery_staff: 'Rider Staff',
    marketing_manager: 'Marketing',
    customer_support: 'Support Desk',
    customer: 'Customer',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#005461]/10">
      {/* Top Notification Bar */}
      <div className="bg-[#005461] text-[#FBFBF9] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 font-medium tracking-wide">
              <Truck className="w-3.5 h-3.5 text-[#3BC1A8]" />
              Free Delivery Across Pakistan on Orders Over Rs. 3,000 · Worldwide Shipping via DHL
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 hover:text-[#3BC1A8] transition-colors py-0.5 text-[11px] font-semibold"
              >
                <Globe className="w-3 h-3" />
                <span>{currentCurrency}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isCurrencyDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-32 bg-white text-[#005461] rounded-md shadow-lg border border-slate-100 py-1 z-50 text-xs"
                  onMouseLeave={() => setIsCurrencyDropdownOpen(false)}
                >
                  {(['PKR', 'USD', 'AED', 'GBP', 'EUR'] as CurrencyCode[]).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setCurrency(cur);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                        currentCurrency === cur ? 'font-bold text-[#0C7779] bg-teal-50/50' : ''
                      }`}
                    >
                      <span>{cur}</span>
                      <span className="text-[10px] text-slate-400">
                        {cur === 'PKR' ? 'Pakistan' : cur === 'AED' ? 'Dubai' : cur}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar - Strict 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#005461] hover:text-[#249E94]"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left group transition-transform focus:outline-none cursor-pointer"
            >
              <img
                src="/velmora-botanical-logo.png"
                alt="VELMORA BEAUTY Botanical Logo"
                className="h-11 sm:h-12 w-auto object-contain rounded-lg shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/Velmora Teal Botanical Beauty Logo.png';
                }}
              />
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-[#005461] uppercase leading-none">
                  VELMORA
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#0C7779] uppercase font-semibold mt-0.5 group-hover:text-[#249E94] transition-colors">
                  Beauty · Your Beauty, Your Glow
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (4-5 single-line clean text links with hover effect) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#1E2929]">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#005461] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'home' ? 'text-[#005461] font-semibold underline underline-offset-8 decoration-2 decoration-[#249E94]' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className={`hover:text-[#005461] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'shop' && !window.location.hash.includes('category')
                  ? 'text-[#005461] font-semibold underline underline-offset-8 decoration-2 decoration-[#249E94]'
                  : ''
              }`}
            >
              Shop All (160+)
            </button>

            {/* Skincare dropdown / shortcut */}
            <div className="relative group">
              <button
                onClick={() => navigateTo('shop', { category: 'Face serums' })}
                className="flex items-center gap-1 hover:text-[#005461] transition-colors whitespace-nowrap shrink-0 py-2"
              >
                <span>Skincare</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute top-full -left-4 w-72 bg-white rounded-lg shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Skincare Categories
                </div>
                {[
                  'Face cleansers and face washes',
                  'Face serums',
                  'Moisturizers',
                  'Sunscreens',
                  'Toners and face mists',
                  'Face masks and exfoliators',
                  'Eye care',
                  'Lip care',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => navigateTo('shop', { category: cat })}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:text-[#005461] hover:bg-teal-50/50 transition-colors flex items-center justify-between"
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigateTo('shop', { category: 'Makeup essentials' })}
              className="hover:text-[#005461] transition-colors whitespace-nowrap shrink-0"
            >
              Makeup
            </button>

            <button
              onClick={() => navigateTo('shop', { category: 'Body lotions and body care' })}
              className="hover:text-[#005461] transition-colors whitespace-nowrap shrink-0"
            >
              Body & Hair
            </button>

            <button
              onClick={() => navigateTo('shop', { filter: 'bestseller' })}
              className="hover:text-[#005461] transition-colors whitespace-nowrap shrink-0 text-[#0C7779] font-medium"
            >
              Bestsellers
            </button>

            <button
              onClick={() => navigateTo('about')}
              className={`hover:text-[#005461] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'about' ? 'text-[#005461] font-semibold' : ''
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`hover:text-[#005461] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'contact' ? 'text-[#005461] font-semibold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Wishlist, Bag, Account) */}
          <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
            {/* Live Search Trigger */}
            <button
              onClick={() => setIsQuickSearchOpen(true)}
              className="p-2 text-[#005461] hover:text-[#249E94] hover:bg-teal-50/50 rounded-full transition-colors"
              title="Search 160+ beauty products"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateTo('dashboard', { tab: 'wishlist' })}
              className="relative p-2 text-[#005461] hover:text-[#249E94] hover:bg-teal-50/50 rounded-full transition-colors"
              title="Saved items"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#249E94] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag Icon with Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-[#005461] hover:text-[#249E94] hover:bg-teal-50/50 rounded-full transition-colors"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#005461] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Account Button */}
            <button
              onClick={() => {
                if (currentUser.role === 'super_admin' && isAdminUnlocked) {
                  navigateTo('dashboard');
                } else {
                  navigateTo('account');
                }
              }}
              className="hidden sm:flex items-center gap-2 bg-[#005461] hover:bg-[#0C7779] text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer"
              title="Customer Account"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#3BC1A8]" />
              <span>
                {currentUser.role === 'super_admin' && isAdminUnlocked
                  ? 'Admin Portal (Open)'
                  : 'My Account'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-800">
            <button
              onClick={() => {
                navigateTo('home');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigateTo('shop');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50 font-semibold text-[#005461]"
            >
              Shop All (160+)
            </button>
            <button
              onClick={() => {
                navigateTo('shop', { category: 'Face serums' });
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              Face Serums
            </button>
            <button
              onClick={() => {
                navigateTo('shop', { category: 'Moisturizers' });
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              Moisturizers
            </button>
            <button
              onClick={() => {
                navigateTo('shop', { category: 'Sunscreens' });
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              Sunscreens
            </button>
            <button
              onClick={() => {
                navigateTo('shop', { category: 'Makeup essentials' });
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              Makeup Essentials
            </button>
            <button
              onClick={() => {
                navigateTo('shop', { category: 'Hair care' });
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              Hair Care
            </button>
            <button
              onClick={() => {
                navigateTo('shop', { category: 'Body lotions and body care' });
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              Body Care
            </button>
            <button
              onClick={() => {
                navigateTo('about');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              About Velmora
            </button>
            <button
              onClick={() => {
                navigateTo('contact');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded hover:bg-teal-50"
            >
              Contact Us
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                if (currentUser.role === 'super_admin' && isAdminUnlocked) {
                  navigateTo('dashboard');
                } else {
                  navigateTo('account');
                }
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-[#005461] hover:bg-[#0C7779] text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-[#3BC1A8]" />
              <span>
                {currentUser.role === 'super_admin' && isAdminUnlocked
                  ? 'Admin Portal (Open)'
                  : 'My Customer Account'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
