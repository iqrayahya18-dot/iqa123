import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    formatPrice,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    navigateTo,
    activeCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD_PKR = 3000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD_PKR) * 100));
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD_PKR - cartSubtotal);

  // Discount calculation
  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountPercent) {
      discountAmount = Math.round((cartSubtotal * activeCoupon.discountPercent) / 100);
    } else if (activeCoupon.discountAmount) {
      discountAmount = activeCoupon.discountAmount;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ text: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponFeedback({ text: res.message, error: true });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#FBFBF9]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#005461]" />
              <h2 className="text-base font-bold text-[#005461] tracking-wide">
                Your Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#005461]/5 border-b border-[#005461]/10 text-xs">
            <div className="flex items-center justify-between font-medium text-[#005461] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#249E94]" />
                {remainingForFree === 0 ? (
                  <span className="font-bold text-[#0C7779]">
                    🎉 You qualify for FREE Nationwide Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatPrice(remainingForFree)}</strong> more for Free Delivery
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#249E94] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto text-[#0C7779]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our clinical serums, velvet moisturizers, and UV shields to begin your radiance journey.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-3 px-5 py-2 bg-[#005461] text-white rounded-lg text-xs font-semibold hover:bg-[#0C7779] transition-colors"
                >
                  Discover Bestsellers
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;

                const basePrice = product.salePrice || product.price;
                const unitPrice = basePrice + (item.selectedVariant?.priceDelta || 0);

                return (
                  <div
                    key={`${item.productId}-${item.selectedVariant?.id || 'default'}`}
                    className="flex gap-3.5 pb-4 border-b border-slate-100 last:border-0"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block truncate">
                          {product.category}
                        </span>
                        <h4
                          onClick={() => {
                            setIsCartDrawerOpen(false);
                            navigateTo('product-detail', { id: product.id });
                          }}
                          className="text-xs font-bold text-slate-900 truncate hover:text-[#0C7779] cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        {item.selectedVariant && (
                          <span className="text-[11px] text-slate-500 block">
                            {item.selectedVariant.name}: {item.selectedVariant.value}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-[#005461] tabular-nums mt-0.5 block">
                          {formatPrice(unitPrice)}
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 rounded-md">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.selectedVariant?.id
                              )
                            }
                            className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold tabular-nums text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.selectedVariant?.id
                              )
                            }
                            className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.productId, item.selectedVariant?.id)
                          }
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-[#FBFBF9] space-y-3.5">
              {/* Promo Code Input */}
              {activeCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-teal-50 rounded-lg text-xs border border-teal-200">
                  <div className="flex items-center gap-1.5 text-[#005461] font-medium">
                    <Tag className="w-3.5 h-3.5 text-[#249E94]" />
                    <span>Coupon <strong>{activeCoupon.code}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:underline text-[11px] font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code (e.g. VELMORA10)"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#249E94] uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#0C7779] hover:bg-[#005461] text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p
                  className={`text-[11px] ${
                    couponFeedback.error ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {couponFeedback.text}
                </p>
              )}

              {/* Subtotal & Totals breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold text-slate-800">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#249E94] font-medium">
                    <span>Promo Discount</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="tabular-nums text-slate-800">
                    {remainingForFree === 0 ? (
                      <strong className="text-emerald-600 font-semibold">FREE</strong>
                    ) : (
                      'Calculated at checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-[#005461] tabular-nums text-base">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#005461] hover:bg-[#0C7779] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#3BC1A8]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Secured Checkout · Cash on Delivery available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
