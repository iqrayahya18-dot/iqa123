import React from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const currentPrice = product.salePrice || product.price;

  return (
    <div
      onClick={() => navigateTo('product-detail', { id: product.id })}
      className="group relative bg-white rounded-xl border border-slate-100 hover:border-[#249E94]/40 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container (65-70% height) with neutral solid canvas */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-[#F8F9F8] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern container if image fails */}
        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#005461]/5 to-[#249E94]/10 text-center">
          <span className="font-display font-bold text-sm text-[#005461]">{product.name}</span>
          <span className="text-[10px] text-slate-400 mt-1 uppercase">{product.category}</span>
        </div>

        {/* Single subtle tag (Zero pill badge rule) */}
        {product.isBestseller ? (
          <span className="absolute top-3 left-3 bg-[#005461] text-[#FBFBF9] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
            Bestseller
          </span>
        ) : product.salePrice ? (
          <span className="absolute top-3 left-3 bg-[#0C7779] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
            Special Offer
          </span>
        ) : product.isNewArrival ? (
          <span className="absolute top-3 left-3 bg-[#249E94] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
            New Arrival
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-600 shadow-sm opacity-80 group-hover:opacity-100'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id, 1);
            }}
            className="w-full bg-[#005461] hover:bg-[#0C7779] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#3BC1A8]" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category kicker */}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0C7779] block truncate">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#005461] transition-colors line-clamp-2 leading-snug mt-0.5">
            {product.name}
          </h3>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-slate-800 tabular-nums">{product.rating}</span>
          </div>
          <span aria-hidden="true">·</span>
          <span className="text-[11px] text-slate-400 truncate">
            {product.reviewCount} reviews
          </span>
        </div>

        {/* Price Baseline */}
        <div className="pt-1 flex items-baseline justify-between border-t border-slate-50">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#005461] tabular-nums">
              {formatPrice(currentPrice)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400">
            {product.netQuantity.split('/')[0].trim()}
          </span>
        </div>
      </div>
    </div>
  );
};
