import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, RefreshCw, Sparkles } from 'lucide-react';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';

  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // Sync state with URL search query
  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword: searchKeyword,
        category,
        rating,
        minPrice,
        maxPrice,
        sortBy,
      })
    );
  }, [dispatch, searchKeyword, category, rating, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSortBy('newest');
    setSearchParams({});
  };

  const categoriesList = ['Electronics', 'Audio', 'Office', 'Accessories'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Premium Hero Banner */}
      {!searchKeyword && (
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex flex-col gap-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 self-center md:self-start px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Hardware
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Elevate Your Digital <span className="text-gradient-primary">Horizon</span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
              Explore our curated workspace ecosystems, custom mechanical peripherals, and high-fidelity audio modules engineered for pure performance.
            </p>
          </div>
          <div className="relative w-full max-w-xs aspect-square md:max-w-sm rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-brand-500/10">
            <img
              src="https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              alt="Premium peripherals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>
        </div>
      )}

      {/* Main Grid: Filters Sidebar + Catalog */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6 rounded-2xl glass-panel p-6 border border-white/5 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-500" />
              <span className="font-bold text-sm text-slate-200">Catalog Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-brand-500 flex items-center gap-1 transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
            <div className="flex flex-col gap-1.5">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? '' : cat)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    category === cat
                      ? 'bg-brand-500/15 border-brand-500/35 text-indigo-400'
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Price Budget</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ($)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full glass-input text-xs py-2 px-3 text-center"
              />
              <span className="text-slate-600">-</span>
              <input
                type="number"
                placeholder="Max ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full glass-input text-xs py-2 px-3 text-center"
              />
            </div>
          </div>

          {/* Ratings Filter */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="glass-input text-xs py-2 px-3 focus:bg-slate-950"
            >
              <option value="">Any Rating</option>
              <option value="4">4.0 Stars & Up</option>
              <option value="4.5">4.5 Stars & Up</option>
              <option value="4.8">4.8 Stars & Up</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort Ordering</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input text-xs py-2 px-3 focus:bg-slate-950"
            >
              <option value="newest">Newest Catalog</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="topRated">Highest Rated</option>
            </select>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="flex-1 flex flex-col gap-6">
          {searchKeyword && (
            <div className="text-sm text-slate-400">
              Showing search results for <span className="font-semibold text-white">"{searchKeyword}"</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
              <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Syncing database products...</span>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              Failed to connect: {error}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 glass-panel rounded-2xl border border-white/5 gap-4">
              <span className="text-slate-500 text-sm">No products found matching the criteria.</span>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-300"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
