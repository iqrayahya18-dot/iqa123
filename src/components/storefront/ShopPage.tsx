import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Check,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { ProductCategory } from '../../types';
import { CATEGORIES_DATA } from '../../data/products';

export const ShopPage: React.FC = () => {
  const {
    products,
    viewParams,
    formatPrice,
    compareList,
    toggleCompare,
    clearCompare,
    navigateTo,
  } = useStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(viewParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    viewParams.category || 'All'
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [filterTag, setFilterTag] = useState<string>(viewParams.filter || 'all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 24;

  // Sync params if routed with category or search
  useEffect(() => {
    if (viewParams.category) {
      setSelectedCategory(viewParams.category);
    }
    if (viewParams.search) {
      setSearchQuery(viewParams.search);
    }
    if (viewParams.filter) {
      setFilterTag(viewParams.filter);
    }
    setPage(1);
  }, [viewParams]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.searchKeywords.some((k) => k.toLowerCase().includes(q)) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Price Range (in PKR base)
      const price = p.salePrice || p.price;
      if (selectedPriceRange === 'under-2500' && price >= 2500) return false;
      if (selectedPriceRange === '2500-4000' && (price < 2500 || price > 4000)) return false;
      if (selectedPriceRange === '4000-6000' && (price < 4000 || price > 6000)) return false;
      if (selectedPriceRange === 'above-6000' && price <= 6000) return false;

      // Rating
      if (minRating > 0 && p.rating < minRating) return false;

      // Stock
      if (inStockOnly && p.stock <= 0) return false;

      // Filter tags
      if (filterTag === 'bestseller' && !p.isBestseller) return false;
      if (filterTag === 'new' && !p.isNewArrival) return false;
      if (filterTag === 'sale' && !p.salePrice) return false;

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedPriceRange,
    minRating,
    inStockOnly,
    filterTag,
  ]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      // Default: popularity / bestsellers first
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(0, page * itemsPerPage);
  }, [sortedProducts, page]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceRange('all');
    setMinRating(0);
    setInStockOnly(false);
    setFilterTag('all');
    setSortBy('popular');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    selectedPriceRange !== 'all' ||
    minRating > 0 ||
    inStockOnly ||
    filterTag !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Storefront Catalog
          </span>
          <h1 className="text-3xl font-bold font-display text-[#005461] mt-0.5">
            {selectedCategory === 'All' ? 'Complete Formulations Collection' : selectedCategory}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {sortedProducts.length} of {products.length} luxury beauty items
          </p>
        </div>

        {/* Sort & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-[#005461]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#249E94]" />
            )}
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#249E94]"
            >
              <option value="popular">Most Popular & Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 sticky top-28 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#005461] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#249E94]" />
              Filter Catalog
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#249E94]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Category
            </h4>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-[#005461] text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>
              {CATEGORIES_DATA.map((cat) => {
                const count = products.filter((p) => p.category === cat.name).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-[#005461] text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider">
              Price Range
            </h4>
            <div className="space-y-1.5 text-slate-600">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-2500', label: `Under ${formatPrice(2500)}` },
                { id: '2500-4000', label: `${formatPrice(2500)} - ${formatPrice(4000)}` },
                { id: '4000-6000', label: `${formatPrice(4000)} - ${formatPrice(6000)}` },
                { id: 'above-6000', label: `Above ${formatPrice(6000)}` },
              ].map((range) => (
                <label
                  key={range.id}
                  className="flex items-center gap-2 cursor-pointer hover:text-slate-900"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === range.id}
                    onChange={() => setSelectedPriceRange(range.id)}
                    className="text-[#005461] focus:ring-[#249E94]"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider">
              Customer Rating
            </h4>
            <div className="space-y-1.5 text-slate-600">
              {[
                { val: 0, label: 'All Ratings' },
                { val: 4.8, label: '4.8 ★ & above' },
                { val: 4.5, label: '4.5 ★ & above' },
                { val: 4.0, label: '4.0 ★ & above' },
              ].map((r) => (
                <label
                  key={r.val}
                  className="flex items-center gap-2 cursor-pointer hover:text-slate-900"
                >
                  <input
                    type="radio"
                    name="ratingFilter"
                    checked={minRating === r.val}
                    onChange={() => setMinRating(r.val)}
                    className="text-[#005461] focus:ring-[#249E94]"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-4 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#005461] focus:ring-[#249E94]"
              />
              <span className="font-medium">In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <span className="font-semibold text-slate-500">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 text-slate-800">
                  {selectedCategory}
                  <X
                    className="w-3 h-3 cursor-pointer text-slate-400 hover:text-red-500"
                    onClick={() => setSelectedCategory('All')}
                  />
                </span>
              )}
              {searchQuery && (
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 text-slate-800">
                  &ldquo;{searchQuery}&rdquo;
                  <X
                    className="w-3 h-3 cursor-pointer text-slate-400 hover:text-red-500"
                    onClick={() => setSearchQuery('')}
                  />
                </span>
              )}
              {selectedPriceRange !== 'all' && (
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 text-slate-800">
                  Price: {selectedPriceRange}
                  <X
                    className="w-3 h-3 cursor-pointer text-slate-400 hover:text-red-500"
                    onClick={() => setSelectedPriceRange('all')}
                  />
                </span>
              )}
              {minRating > 0 && (
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 text-slate-800">
                  {minRating}★+
                  <X
                    className="w-3 h-3 cursor-pointer text-slate-400 hover:text-red-500"
                    onClick={() => setMinRating(0)}
                  />
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or searching for terms like &ldquo;serum&rdquo;, &ldquo;sunscreen&rdquo;, or &ldquo;ceramide&rdquo;.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#005461] text-white text-xs font-semibold rounded-lg hover:bg-[#0C7779] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {paginatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

          {/* Load More Pagination */}
          {paginatedProducts.length < sortedProducts.length && (
            <div className="pt-8 text-center space-y-2">
              <p className="text-xs text-slate-500">
                Showing {paginatedProducts.length} of {sortedProducts.length} items
              </p>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-[#005461] hover:bg-[#0C7779] text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm lg:hidden flex">
          <div className="w-full max-w-xs bg-white h-full ml-auto p-5 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#005461]">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 uppercase">Category</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded ${
                      selectedCategory === 'All'
                        ? 'bg-[#005461] text-white font-bold'
                        : 'text-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES_DATA.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded truncate ${
                        selectedCategory === c.name
                          ? 'bg-[#005461] text-white font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#005461] text-white py-2.5 rounded-lg text-xs font-bold"
              >
                Apply Filters ({sortedProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
