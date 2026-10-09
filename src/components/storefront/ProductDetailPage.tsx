import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  Info,
  Droplets,
  Share2,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { ProductVariant } from '../../types';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    viewParams,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    getProductReviews,
    addReview,
    currentUser,
  } = useStore();

  const productId = viewParams.id || products[0].id;
  const product = products.find((p) => p.id === productId) || products[0];

  // Active Variant State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'howToUse' | 'reviews'>('details');

  // Review Form State
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewAuthor, setReviewAuthor] = useState<string>(currentUser.name || '');

  const isFavorited = isInWishlist(product.id);
  const basePrice = product.salePrice || product.price;
  const unitPrice = basePrice + (selectedVariant ? selectedVariant.priceDelta : 0);

  const reviewsList = getProductReviews(product.id);

  // Related products
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedVariant);
    navigateTo('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      productId: product.id,
      customerName: reviewAuthor || 'Anonymous Customer',
      rating: reviewRating,
      title: reviewTitle || 'Great experience with Velmora',
      comment: reviewComment,
      verifiedPurchase: true,
    });

    setShowReviewModal(false);
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigateTo('home')} className="hover:text-[#005461]">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={() => navigateTo('shop', { category: product.category })}
          className="hover:text-[#005461]"
        >
          {product.category}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery Column */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28">
          <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#F8F9F8] border border-slate-100 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* Fallback container */}
            <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#005461]/5 to-[#249E94]/10 text-center">
              <span className="font-display font-bold text-xl text-[#005461]">{product.name}</span>
              <span className="text-xs text-slate-400 mt-2 uppercase">{product.category}</span>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isBestseller && (
                <span className="bg-[#005461] text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded shadow-sm">
                  Bestseller
                </span>
              )}
              {product.salePrice && (
                <span className="bg-[#0C7779] text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded shadow-sm">
                  Special Offer
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600 shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600 shadow-sm'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

          {/* Secondary Thumbnail Strip */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#005461] p-0.5 cursor-pointer">
              <img
                src={product.image}
                alt="Main"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            {product.secondaryImage && (
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 p-0.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                <img
                  src={product.secondaryImage}
                  alt="Alt View"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-widest text-[#0C7779]">
                {product.category}
              </span>
              <span className="font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars and Reviews Anchor */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800 tabular-nums">
                {product.rating}
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-[#0C7779] hover:underline font-medium"
              >
                {product.reviewCount} customer reviews
              </button>
            </div>
          </div>

          {/* Pricing Module */}
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-slate-100 flex items-baseline justify-between">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-bold text-[#005461] tabular-nums">
                  {formatPrice(unitPrice)}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 block">
                Net Quantity: <strong>{product.netQuantity}</strong>
              </span>
            </div>

            {product.salePrice && (
              <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md">
                Save {formatPrice(product.price - product.salePrice)}
              </span>
            )}
          </div>

          {/* Variants Selector (if applicable) */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Select {product.variants[0].name}:</span>
                <span className="font-normal text-slate-500">
                  {selectedVariant?.value}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#005461] bg-[#005461] text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#249E94]'
                    }`}
                  >
                    <span>{v.value}</span>
                    {v.priceDelta > 0 && (
                      <span className="ml-1 opacity-80 text-[10px]">
                        (+{formatPrice(v.priceDelta)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  In Stock · {product.stock} units ready for immediate dispatch
                </span>
              </span>
            ) : (
              <span className="text-rose-600 font-semibold">
                Currently Out of Stock · Pre-orders coming soon
              </span>
            )}
          </div>

          {/* Quantity Stepper & Add to Bag Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#005461] hover:bg-[#0C7779] disabled:bg-slate-300 text-white py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#3BC1A8]" />
                <span>Add to Bag</span>
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full bg-[#0C7779] hover:bg-[#249E94] disabled:bg-slate-200 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>Instant Checkout (Buy Now)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Delivery & Security Guarantee Box */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#249E94] shrink-0" />
              <span>
                <strong>Cash on Delivery:</strong> Available across all Pakistani cities
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#249E94] shrink-0" />
              <span>
                <strong>Authentic Formulations:</strong> Sealed batch with safety tamper foil
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#249E94] shrink-0" />
              <span>
                <strong>14-Day Returns:</strong> Simple exchanges through our customer support desk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 bg-[#FBFBF9] overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'details'
                ? 'border-[#005461] text-[#005461] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Description & Features
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'ingredients'
                ? 'border-[#005461] text-[#005461] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Full Ingredients (INCI)
          </button>
          <button
            onClick={() => setActiveTab('howToUse')}
            className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'howToUse'
                ? 'border-[#005461] text-[#005461] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Directions & Precautions
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#005461] text-[#005461] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({reviewsList.length})
          </button>
        </div>

        {/* Tab Panels */}
        <div className="p-6 sm:p-8 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-3xl">
              <p className="text-base text-slate-800 font-normal">{product.description}</p>
              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">
                  Key Benefits & Clinical Highlights
                </h3>
                <ul className="space-y-2">
                  {product.keyFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Sparkles className="w-4 h-4 text-[#249E94] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Full INCI Formulation
              </h3>
              <p className="text-xs text-slate-600">
                Velmora Beauty maintains 100% ingredient transparency. Formulated without parabens, sulfates, formaldehyde, or synthetic phthalates.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-md"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider">
                  Ritual & Usage Instructions
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {product.usageInstructions}
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60">
                <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  Precautions & Storage
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {product.precautions}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Verified Customer Feedback
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sample verified reviews until real customer submissions accumulate.
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-[#005461] hover:bg-[#0C7779] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors self-start sm:self-auto"
                >
                  Write a Review
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    Be the first to review this formulation!
                  </div>
                ) : (
                  reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <strong className="text-slate-900 font-bold">{rev.title}</strong>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-slate-700 leading-relaxed">{rev.comment}</p>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-800">{rev.customerName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Purchase
                          </span>
                        )}
                        {rev.isDemo && (
                          <span className="text-slate-400 text-[10px]">· (Sample Data)</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Formulations Carousel / Grid */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0C7779]">
                Complete Your Ritual
              </span>
              <h2 className="text-2xl font-bold font-display text-[#005461]">
                Related Formulations
              </h2>
            </div>
            <button
              onClick={() => navigateTo('shop', { category: product.category })}
              className="text-xs font-bold text-[#0C7779] hover:underline flex items-center gap-1"
            >
              <span>Explore category</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Review: {product.name}
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#249E94]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`w-6 h-6 cursor-pointer ${
                        star <= reviewRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-slate-800">{reviewRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Remarkable glow and hydration"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#249E94]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Honest Review</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe your skin type, texture feel, and visible results..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#249E94]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#005461] hover:bg-[#0C7779] text-white rounded-lg font-bold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
