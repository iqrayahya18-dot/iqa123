import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminPasswordModal: React.FC = () => {
  const {
    isAdminPasswordModalOpen,
    setIsAdminPasswordModalOpen,
    verifyAndLoginAdmin,
    adminPassword,
    isAdminUnlocked,
    navigateTo,
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isAdminPasswordModalOpen) {
      setPasswordInput('');
      setErrorMessage('');
      setSuccessMessage('');
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [isAdminPasswordModalOpen]);

  if (!isAdminPasswordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    if (!clean) {
      setErrorMessage('Baraye meherbani password darj karein (Please enter password).');
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Instant verification and immediate opening
    const result = verifyAndLoginAdmin(clean);
    if (result.success) {
      setSuccessMessage(result.message);
      setIsSubmitting(false);
      // Immediately close modal and switch to dashboard view
      setIsAdminPasswordModalOpen(false);
      navigateTo('dashboard');
    } else {
      setErrorMessage(result.message);
      setIsSubmitting(false);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleFillDemoPassword = () => {
    const pass = adminPassword || 'iqrayahya123';
    setPasswordInput(pass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 transition-all">
      <div
        className={`bg-white rounded-3xl max-w-md w-full shadow-2xl border border-teal-500/30 overflow-hidden transform transition-all duration-200 ${
          shake ? 'animate-bounce' : 'scale-100'
        }`}
      >
        {/* Brand Deep Teal Gradient Header */}
        <div className="bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] text-white p-6 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 bg-[#3BC1A8]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-[#3BC1A8]/40 text-[#3BC1A8] flex items-center justify-center shadow-lg font-bold">
                <Crown className="w-6 h-6 text-[#3BC1A8]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#3BC1A8] text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm border border-teal-400/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Secure Admin Portal</span>
                </div>
                <h3 className="text-xl font-bold font-display text-white mt-1">
                  Iqra Yahya
                </h3>
                <p className="text-xs text-teal-100/90">
                  Chief Executive & Super Admin
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAdminPasswordModalOpen(false)}
              className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Instruction Urdu & English */}
          <div className="bg-[#005461]/5 border border-[#249E94]/30 rounded-2xl p-4 text-xs space-y-1.5">
            <p className="font-semibold text-[#005461] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#249E94]" />
              <span>ایڈمن پینل کھولنے کے لیے پاسورڈ درج کریں</span>
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Super Admin panel is protected. Enter the administrator password to unlock sales analytics, catalog management (150+ items), orders, and system settings.
            </p>
            <div className="pt-1.5 border-t border-teal-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Admin Email:</span>
              <span className="font-mono font-bold text-[#005461]">iqrayahya18@gmail.com</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Admin Password (پاسورڈ)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-[#0C7779]" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoFocus
                  placeholder="Enter password (e.g. iqrayahya123)"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005461] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="space-y-0.5">
                  <p className="font-bold">Access Denied</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message Box */}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div className="space-y-0.5">
                  <p className="font-bold">Password Verified!</p>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="w-full bg-gradient-to-r from-[#005461] via-[#0C7779] to-[#005461] hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-[#3BC1A8]" />
                  <span>Verifying Password...</span>
                </span>
              ) : successMessage ? (
                <span className="flex items-center gap-1.5 text-[#3BC1A8]">
                  <Unlock className="w-4 h-4" />
                  Opening Admin Panel...
                </span>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-[#3BC1A8]" />
                  <span>پاسورڈ درج کر کے ایڈمن اوپن کریں</span>
                  <ArrowRight className="w-4 h-4 text-[#3BC1A8]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Password Test Helper Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">
              Set Password: <code className="font-mono font-bold text-[#005461]">{adminPassword || 'iqrayahya123'}</code>
            </span>
            <button
              type="button"
              onClick={handleFillDemoPassword}
              className="text-[11px] font-semibold text-[#0C7779] hover:text-[#005461] underline decoration-dotted transition-colors"
            >
              Auto-fill password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
