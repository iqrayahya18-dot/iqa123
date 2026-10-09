import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Edit,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import { CATEGORIES_DATA } from '../../data/products';

export const ProductManagerDashboard: React.FC = () => {
  const {
    products,
    updateProduct,
    updateStock,
    formatPrice,
    addProduct,
    navigateTo,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [selectedCat, setSelectedCat] = useState('All');

  // Low stock products count
  const lowStockProducts = products.filter((p) => p.stock < 30);

  const displayedProducts = products.filter((p) => {
    if (filterLowStock && p.stock >= 30) return false;
    if (selectedCat !== 'All' && p.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-[#005461]">
            Product Catalog & Inventory Management
          </h2>
          <p className="text-xs text-slate-500">
            Real-time management for {products.length} registered luxury formulas
          </p>
        </div>

        {/* Low Stock Counter Alert */}
        <button
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            filterLowStock
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{lowStockProducts.length} Low-Stock Formulations</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by name or SKU..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#249E94]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
        >
          <option value="All">All Categories</option>
          {CATEGORIES_DATA.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Catalog Table with Instant Stock Adjuster */}
      <div className="overflow-x-auto max-h-[600px]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FBFBF9] text-slate-700 font-bold border-b border-slate-200 sticky top-0">
            <tr>
              <th className="py-2.5 px-3">SKU</th>
              <th className="py-2.5 px-3">Product Name</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Price</th>
              <th className="py-2.5 px-3 text-center">Stock Adjustment</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 font-mono font-bold text-slate-600">{p.sku}</td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 truncate max-w-xs">{p.name}</div>
                  <span className="text-[10px] text-slate-400">{p.netQuantity}</span>
                </td>
                <td className="py-3 px-3 text-slate-500">{p.category}</td>
                <td className="py-3 px-3 text-right tabular-nums font-bold text-[#005461]">
                  {formatPrice(p.salePrice || p.price)}
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => updateStock(p.id, Math.max(0, p.stock - 1))}
                      className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700"
                    >
                      -
                    </button>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-xs tabular-nums ${
                        p.stock < 25 ? 'bg-amber-100 text-amber-800' : 'bg-slate-50 text-slate-800'
                      }`}
                    >
                      {p.stock}
                    </span>
                    <button
                      onClick={() => updateStock(p.id, p.stock + 5)}
                      className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-3 px-3 text-right space-x-2">
                  <button
                    onClick={() => navigateTo('product-detail', { id: p.id })}
                    className="text-[#0C7779] hover:underline font-semibold"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      const newPrice = prompt(`Set new price for ${p.name}:`, p.price.toString());
                      if (newPrice && !isNaN(Number(newPrice))) {
                        updateProduct(p.id, { price: Number(newPrice) });
                      }
                    }}
                    className="text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Edit Price
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
