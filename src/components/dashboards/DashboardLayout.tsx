import React, { useState } from 'react';
import {
  ShieldAlert,
  Layers,
  Package,
  Truck,
  User,
  Megaphone,
  Headphones,
  LogOut,
  ChevronRight,
  UserCheck,
  ShoppingBag,
  Bell,
  Home,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Crown,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    currentUser,
    switchRole,
    logoutUser,
    setIsRoleModalOpen,
    navigateTo,
    isAdminUnlocked,
    lockAdmin,
    verifyAndLoginAdmin,
    adminPassword,
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setErrorMessage('Baraye meherbani password darj karein.');
      return;
    }
    const res = verifyAndLoginAdmin(passwordInput);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setErrorMessage('');
      setSuccessMessage(res.message);
      setTimeout(() => {
        setPasswordInput('');
        setSuccessMessage('');
      }, 600);
    }
  };

  const roleMeta: Record<
    UserRole,
    { label: string; badgeColor: string; description: string; icon: React.ReactNode }
  > = {
    super_admin: {
      label: 'Super Admin Portal',
      badgeColor: 'bg-emerald-600',
      description: 'Full business administration, inventory, finance & audit logs',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
    },
    product_manager: {
      label: 'Product Manager Workspace',
      badgeColor: 'bg-teal-600',
      description: 'Catalog management, inventory levels & formula variants',
      icon: <Layers className="w-5 h-5 text-teal-400" />,
    },
    order_manager: {
      label: 'Order Management Hub',
      badgeColor: 'bg-cyan-600',
      description: 'Fulfillment desk, packing slips, verify payments & courier assignment',
      icon: <Package className="w-5 h-5 text-cyan-400" />,
    },
    delivery_staff: {
      label: 'Delivery Courier Staff',
      badgeColor: 'bg-amber-600',
      description: 'Assigned deliveries, doorstep contact, and COD cash collection',
      icon: <Truck className="w-5 h-5 text-amber-400" />,
    },
    customer: {
      label: 'Customer Account',
      badgeColor: 'bg-rose-600',
      description: 'Personal profile, order history, shipment tracking & wishlist',
      icon: <User className="w-5 h-5 text-pink-400" />,
    },
    marketing_manager: {
      label: 'Marketing & Campaigns',
      badgeColor: 'bg-purple-600',
      description: 'Promotional banners, coupon creator & newsletter subscriber list',
      icon: <Megaphone className="w-5 h-5 text-purple-400" />,
    },
    customer_support: {
      label: 'Customer Support Desk',
      badgeColor: 'bg-blue-600',
      description: 'Customer inquiries, order support & ticket resolutions',
      icon: <Headphones className="w-5 h-5 text-blue-400" />,
    },
  };

  const currentMeta = roleMeta[currentUser.role];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header Bar */}
      <div className="bg-[#005461] text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/velmora-botanical-logo.png"
            alt="VELMORA BEAUTY"
            className="w-14 h-14 rounded-2xl object-contain bg-white/10 p-1 shrink-0 shadow-inner"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/Velmora Teal Botanical Beauty Logo.png';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentMeta.badgeColor}`}>
                {currentUser.role.replace('_', ' ')}
              </span>
              <span className="text-xs text-teal-200">
                Logged in as <strong>{currentUser.name}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              {currentMeta.label}
            </h1>
            <p className="text-xs text-teal-100/70 mt-0.5 max-w-xl">
              {currentMeta.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-auto">
          <button
            onClick={() => navigateTo('shop')}
            className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Storefront</span>
          </button>

          {currentUser.role === 'super_admin' && isAdminUnlocked && (
            <button
              onClick={lockAdmin}
              className="bg-[#005461] hover:bg-[#0C7779] text-[#3BC1A8] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm border border-teal-400/30 cursor-pointer"
              title="Lock Admin Session (پاسورڈ لاک کریں)"
            >
              <Lock className="w-3.5 h-3.5 text-[#3BC1A8]" />
              <span>Lock Admin</span>
            </button>
          )}

          <button
            onClick={() => {
              logoutUser();
              navigateTo('home');
            }}
            className="bg-white/10 hover:bg-red-500/80 text-white p-2 rounded-xl transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dashboard Render Container */}
      <div className="bg-[#FBFBF9] min-h-[600px]">
        {currentUser.role === 'super_admin' && !isAdminUnlocked ? (
          /* Inline Locked Screen for Super Admin */
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl shadow-xl border border-teal-500/30 overflow-hidden">
            <div className="bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] text-white p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 bg-[#3BC1A8]/20 rounded-full blur-xl pointer-events-none" />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-[#3BC1A8]/40 text-[#3BC1A8] flex items-center justify-center shadow-lg mb-3">
                <Crown className="w-7 h-7 text-[#3BC1A8]" />
              </div>
              <h2 className="text-xl font-bold font-display">
                Iqra Yahya · Super Admin Locked
              </h2>
              <p className="text-xs text-teal-100/90 mt-1">
                ایڈمن پینل کھولنے کے لیے اپنا پاسورڈ درج کریں
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 bg-[#005461]/5 p-3.5 rounded-xl border border-teal-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Admin Account:</span>
                  <span className="font-mono font-bold text-[#005461]">Iqra Yahya</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Email:</span>
                  <span className="font-mono text-slate-600">iqrayahya18@gmail.com</span>
                </div>
              </div>

              <form onSubmit={handleUnlockAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Enter Admin Password (پاسورڈ)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 text-[#0C7779]" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Password darj karein..."
                      className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005461]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4 text-[#3BC1A8]" />
                  <span>پاسورڈ درج کر کے ایڈمن اوپن کریں</span>
                  <ArrowRight className="w-4 h-4 text-[#3BC1A8]" />
                </button>
              </form>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Password: <code className="font-mono font-bold text-[#005461]">{adminPassword || 'iqrayahya123'}</code>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordInput(adminPassword || 'iqrayahya123');
                    setErrorMessage('');
                  }}
                  className="font-semibold text-[#0C7779] hover:text-[#005461] underline decoration-dotted transition-colors"
                >
                  Auto-fill
                </button>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
