import React, { useState, useMemo } from 'react';
import { Search, X, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const QuickSearchModal: React.FC = () => {
  const {
    products,
    isQuickSearchOpen,
    setIsQuickSearchOpen,
    navigateTo,
    formatPrice,
    addToCart,
  } = useStore();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...list];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!query.trim() && selectedCategory === 'All') {
      return products.slice(0, 8); // top suggestions
    }

    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.searchKeywords.some((k) => k.toLowerCase().includes(q)) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(q));

      return matchCategory && matchQuery;
    });
  }, [products, query, selectedCategory]);

  if (!isQuickSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-[#FBFBF9]">
          <Search className="w-5 h-5 text-[#005461]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cleansers, serums, sunscreens, retinol, ingredients..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-none placeholder-slate-400 font-medium text-slate-900"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsQuickSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#005461] text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'All (160+)' : cat}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
            <span>
              {query
                ? `Found ${filteredProducts.length} matching formulas`
                : `Suggested Formulations (${filteredProducts.length})`}
            </span>
            <button
              onClick={() => {
                setIsQuickSearchOpen(false);
                navigateTo('shop', { search: query });
              }}
              className="text-[#0C7779] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View full catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No products found matching &ldquo;{query}&rdquo;. Try searching for &ldquo;serum&rdquo;, &ldquo;sunscreen&rdquo;, or &ldquo;vitamin c&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.slice(0, 10).map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-[#249E94] hover:bg-teal-50/20 transition-all group cursor-pointer"
                  onClick={() => {
                    setIsQuickSearchOpen(false);
                    navigateTo('product-detail', { id: prod.id });
                  }}
                >
                  <div className="w-14 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                      {prod.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#005461]">
                      {prod.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#005461] tabular-nums">
                        {formatPrice(prod.salePrice || prod.price)}
                      </span>
                      {prod.salePrice && (
                        <span className="text-[11px] line-through text-slate-400 tabular-nums">
                          {formatPrice(prod.price)}
                        </span>
                      )}
                      <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5 ml-auto">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {prod.rating}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod.id, 1);
                      setIsQuickSearchOpen(false);
                    }}
                    className="p-2 text-[#005461] hover:text-white hover:bg-[#005461] rounded-lg transition-colors shrink-0"
                    title="Quick add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
