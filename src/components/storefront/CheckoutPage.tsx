import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Building,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Tag,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, Address, OrderItem } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    products,
    cartSubtotal,
    formatPrice,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    createOrder,
    navigateTo,
    currentUser,
    currentCurrency,
  } = useStore();

  // If cart is empty, redirect or display empty state
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display text-slate-900">Your bag is empty</h2>
        <p className="text-xs text-slate-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-[#005461] text-white px-6 py-2.5 rounded-lg text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Delivery Form State
  const [fullName, setFullName] = useState(currentUser.name || 'Iqra Yahya');
  const [email, setEmail] = useState(currentUser.email || 'iqrayahya18@gmail.com');
  const [phone, setPhone] = useState(currentUser.phone || '+92 304 9876543');
  const [country, setCountry] = useState('Pakistan');
  const [street, setStreet] = useState('House 42-B, Street 7, Sector F-8/2');
  const [city, setCity] = useState('Islamabad');
  const [state, setState] = useState('Federal Capital');
  const [postalCode, setPostalCode] = useState('44000');
  const [orderNotes, setOrderNotes] = useState('Please ring bell or call before delivery.');

  // Shipping Method
  // Standard Delivery: Rs. 250 (Free over 3000 PKR)
  // Express Courier: Rs. 500
  // DHL International: Rs. 4,500 ($18)
  const isInternational = country !== 'Pakistan';
  const isEligibleForFreeStandard = cartSubtotal >= 3000 && !isInternational;

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'dhl'>(
    isInternational ? 'dhl' : 'standard'
  );

  let shippingFee = 0;
  if (isInternational) {
    shippingFee = 4500;
  } else if (shippingMethod === 'standard') {
    shippingFee = isEligibleForFreeStandard ? 0 : 250;
  } else if (shippingMethod === 'express') {
    shippingFee = 500;
  }

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Card details simulation
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Mobile wallet simulation
  const [walletPhone, setWalletPhone] = useState('+92 304 9876543');

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountPercent) {
      discountAmount = Math.round((cartSubtotal * activeCoupon.discountPercent) / 100);
    } else if (activeCoupon.discountAmount) {
      discountAmount = activeCoupon.discountAmount;
    }
  }

  const taxAmount = 0; // Tax inclusive
  const finalTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount + taxAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required.';
    if (!phone.trim()) errs.phone = 'Phone number is required for courier delivery confirmation.';
    if (!street.trim()) errs.street = 'Delivery address is required.';
    if (!city.trim()) errs.city = 'City is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName,
      phone,
      email,
      street,
      city,
      state,
      postalCode,
      country,
    };

    const orderItems: OrderItem[] = cart.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const basePrice = (prod?.salePrice || prod?.price) || 0;
      const unitPrice = basePrice + (item.selectedVariant?.priceDelta || 0);

      return {
        productId: item.productId,
        productName: prod?.name || 'Velmora Product',
        productImage: prod?.image || '',
        sku: prod?.sku || 'VB-SKU',
        unitPrice,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
        totalPrice: unitPrice * item.quantity,
      };
    });

    // Create persistent Order in state
    const created = createOrder({
      customerId: currentUser.role === 'customer' ? currentUser.id : undefined,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      shippingFee,
      discountAmount,
      couponCode: activeCoupon?.code,
      taxAmount,
      total: finalTotal,
      currency: currentCurrency,
      paymentMethod,
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      orderStatus: 'pending',
      notes: orderNotes,
    });

    setIsSubmitting(false);
    navigateTo('order-confirmation', { id: created.id });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header */}
      <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigateTo('cart')}
            className="text-xs text-[#0C7779] hover:underline flex items-center gap-1 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to bag</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#005461]">
            Fast & Secure Checkout
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Customer Details + Shipping + Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Customer Contact Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#005461] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#005461] text-white flex items-center justify-center text-xs">
                1
              </span>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Iqra Yahya"
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-[#249E94] ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-[#249E94] ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  Mobile Phone (For Courier Dispatch & Call) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-[#249E94] ${
                    errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                )}
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Riders will call this number prior to doorstep arrival.
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#005461] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#005461] text-white flex items-center justify-center text-xs">
                2
              </span>
              Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  Country / Region <span className="text-rose-500">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCountry(c);
                    if (c !== 'Pakistan') {
                      setShippingMethod('dhl');
                    } else {
                      setShippingMethod('standard');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94] bg-white font-medium"
                >
                  <option value="Pakistan">Pakistan (Nationwide COD & Courier)</option>
                  <option value="United Arab Emirates">United Arab Emirates (Dubai / Abu Dhabi)</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  Street Address & House / Flat No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. House 42-B, Street 7, Sector F-8/2"
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-[#249E94] ${
                    errors.street ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.street && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.street}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad..."
                  className={`w-full px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-[#249E94] ${
                    errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.city && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Punjab, Sindh, Federal..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="44000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Delivery Landmark / Notes</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Near Shell pump / Leave with guard"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#249E94]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Shipping Method */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#005461] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#005461] text-white flex items-center justify-center text-xs">
                3
              </span>
              Shipping Method
            </h2>

            <div className="space-y-3 text-xs">
              {!isInternational ? (
                <>
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-[#005461] bg-[#005461]/5 ring-1 ring-[#005461]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-[#005461]"
                      />
                      <div>
                        <strong className="block text-slate-900 font-bold">
                          Standard Courier Delivery (2-4 Business Days)
                        </strong>
                        <span className="text-slate-500 text-[11px]">
                          TCS / Leopard / Call Courier reliable delivery across Pakistan
                        </span>
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-slate-900">
                      {isEligibleForFreeStandard ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        formatPrice(250)
                      )}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-[#005461] bg-[#005461]/5 ring-1 ring-[#005461]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-[#005461]"
                      />
                      <div>
                        <strong className="block text-slate-900 font-bold">
                          Express Overnight Dispatch (1-2 Business Days)
                        </strong>
                        <span className="text-slate-500 text-[11px]">
                          Priority warehouse picking and express dispatch
                        </span>
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-slate-900">
                      {formatPrice(500)}
                    </span>
                  </label>
                </>
              ) : (
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#005461] bg-[#005461]/5 ring-1 ring-[#005461] text-xs">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#249E94]" />
                    <div>
                      <strong className="block text-slate-900 font-bold">
                        DHL Express Worldwide (3-6 Business Days)
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        Tracked international air freight with customs clearing
                      </span>
                    </div>
                  </div>
                  <span className="font-bold tabular-nums text-slate-900">
                    {formatPrice(4500)}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#005461] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#005461] text-white flex items-center justify-center text-xs">
                4
              </span>
              Payment Method
            </h2>

            <div className="space-y-3 text-xs">
              {/* Cash on Delivery (COD) */}
              {!isInternational && (
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#005461] bg-[#005461]/5 ring-1 ring-[#005461]'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-[#005461]" />
                      <div>
                        <strong className="block text-slate-900 font-bold">
                          Cash on Delivery (COD)
                        </strong>
                        <span className="text-slate-500 text-[11px]">
                          Pay cash to the rider at your doorstep upon receiving your package.
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && (
                      <CheckCircle2 className="w-4 h-4 text-[#005461]" />
                    )}
                  </div>
                </div>
              )}

              {/* Direct Bank Transfer */}
              <div
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#005461] bg-[#005461]/5 ring-1 ring-[#005461]'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#005461]" />
                    <div>
                      <strong className="block text-slate-900 font-bold">
                        Direct Bank Transfer (Meezan / HBL / SCB)
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        Transfer directly to Velmora Beauty business bank accounts.
                      </span>
                    </div>
                  </div>
                  {paymentMethod === 'bank_transfer' && (
                    <CheckCircle2 className="w-4 h-4 text-[#005461]" />
                  )}
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-teal-200 text-[11px] text-slate-700 space-y-1">
                    <p className="font-bold text-[#005461]">Meezan Bank Limited (Islamic)</p>
                    <p>Account Title: <strong>VELMORA BEAUTY PVT LTD</strong></p>
                    <p>IBAN: <strong>PK72MEZN0001048291040001</strong></p>
                    <p className="text-slate-500 pt-1">
                      Orders will process immediately upon finance receipt confirmation.
                    </p>
                  </div>
                )}
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#005461] bg-[#005461]/5 ring-1 ring-[#005461]'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#005461]" />
                    <div>
                      <strong className="block text-slate-900 font-bold">
                        Credit / Debit Card (Visa, Mastercard, Amex)
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        Seamless 3D-secure instant authorization.
                      </span>
                    </div>
                  </div>
                  {paymentMethod === 'card' && (
                    <CheckCircle2 className="w-4 h-4 text-[#005461]" />
                  )}
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-teal-200 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="col-span-2">
                        <label className="text-slate-600 block mb-0.5">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-0.5">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-0.5">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      🔒 Sandbox Testing Mode: Transactions automatically verify with 3D-Secure.
                    </span>
                  </div>
                )}
              </div>

              {/* JazzCash / EasyPaisa */}
              {!isInternational && (
                <div
                  onClick={() => setPaymentMethod('jazzcash_easypaisa')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'jazzcash_easypaisa'
                      ? 'border-[#005461] bg-[#005461]/5 ring-1 ring-[#005461]'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-[#005461]" />
                      <div>
                        <strong className="block text-slate-900 font-bold">
                          JazzCash / EasyPaisa Mobile Wallet
                        </strong>
                        <span className="text-slate-500 text-[11px]">
                          Quick mobile account prompt or OTP payment.
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'jazzcash_easypaisa' && (
                      <CheckCircle2 className="w-4 h-4 text-[#005461]" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Place Order (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Items scroll */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => {
                const prod = products.find((p) => p.id === item.productId);
                if (!prod) return null;
                const baseP = prod.salePrice || prod.price;
                const price = baseP + (item.selectedVariant?.priceDelta || 0);

                return (
                  <div key={item.productId} className="flex items-center gap-3 text-xs">
                    <div className="w-12 h-14 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                      {item.selectedVariant && (
                        <span className="text-[11px] text-slate-500 block truncate">
                          {item.selectedVariant.name}: {item.selectedVariant.value}
                        </span>
                      )}
                      <span className="text-slate-500 text-[11px]">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Application */}
            <div className="pt-3 border-t border-slate-100">
              {activeCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-teal-50 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-[#005461] font-semibold">
                    <Tag className="w-3.5 h-3.5 text-[#249E94]" />
                    <span>Coupon {activeCoupon.code} applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-red-500 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code..."
                    className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponMsg && (
                <p
                  className={`text-[11px] mt-1 ${
                    couponMsg.error ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-100 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#249E94] font-medium">
                  <span>Discount ({activeCoupon?.code})</span>
                  <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Duties</span>
                <span className="text-slate-500">Included</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-[#005461] tabular-nums text-lg">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#005461] hover:bg-[#0C7779] disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4 text-[#3BC1A8]" />
            </button>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free 14-day returns · Official Velmora warranty</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
