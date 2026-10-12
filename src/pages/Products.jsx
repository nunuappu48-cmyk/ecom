import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter, Sparkles, Check, ChevronDown } from 'lucide-react'
import { ProductGrid } from '../components/ProductGrid'
import { productService } from '../services/productService'
import { formatCurrency } from '../utils/formatters'

const CATEGORIES = [
  'All',
  'Wildflower',
  'Raw Honey',
  'Monofloral',
  'Rare Reserve',
  'Medical Grade',
  'Infused Honey',
  'Honeydew'
]

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const initialCategory = searchParams.get('category') || 'All'
  const initialSearch = searchParams.get('search') || ''
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [sortBy, setSortBy] = useState('newest')
  const [maxPrice, setMaxPrice] = useState(3000)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category') || 'All'
    const search = searchParams.get('search') || ''
    setSelectedCategory(cat)
    setSearchTerm(search)
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const data = await productService.getProducts({
          category: selectedCategory,
          search: searchTerm,
          sortBy: sortBy
        })

        // Apply price filter locally
        const filtered = data.filter(p => Number(p.price) <= maxPrice)
        setProducts(filtered)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchTerm, sortBy, maxPrice])

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat)
    if (cat === 'All') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams)
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchTerm(val)
    if (!val) {
      searchParams.delete('search')
    } else {
      searchParams.set('search', val)
    }
    setSearchParams(searchParams)
  }

  const resetFilters = () => {
    setSelectedCategory('All')
    setSearchTerm('')
    setSortBy('newest')
    setMaxPrice(3000)
    setSearchParams({})
    setIsMobileFilterOpen(false)
  }

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0) + (maxPrice < 3000 ? 1 : 0)

  return (
    <div className="py-4 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-honey-100 via-cream-100 to-honey-200/80 rounded-3xl p-5 sm:p-8 border border-honey-300 shadow-soft">
        <div className="max-w-2xl space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-amberBrown-900 text-[11px] sm:text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-honey-600" />
            <span>Pure & Raw Harvest</span>
          </div>
          <h1 className="font-serif font-black text-xl sm:text-4xl text-amberBrown-950">
            Artisanal Honey Collection
          </h1>
          <p className="text-xs sm:text-sm text-amberBrown-700 leading-relaxed">
            Explore single-origin raw honeys and botanical infusions straight from our apiaries.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="flex items-center gap-2 sm:gap-3 bg-white p-2.5 sm:p-4 rounded-2xl border border-honey-200/80 shadow-soft">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search wildflower, sidr, manuka..."
            className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 bg-cream-50 text-xs sm:text-sm text-amberBrown-900 placeholder:text-amberBrown-400 rounded-xl border border-honey-200 focus:outline-none focus:ring-2 focus:ring-honey-500"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange({ target: { value: '' } })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amberBrown-400 hover:text-amberBrown-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select (Desktop) */}
        <div className="hidden md:block relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-cream-50 text-xs sm:text-sm font-semibold text-amberBrown-900 py-2.5 pl-3 pr-8 rounded-xl border border-honey-200 focus:outline-none focus:ring-2 focus:ring-honey-500 cursor-pointer"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Sort by: Popularity</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-amberBrown-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Button (Opens Bottom Sheet on Mobile) */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="p-2 sm:p-2.5 bg-cream-50 hover:bg-honey-100 text-amberBrown-800 rounded-xl border border-honey-200 flex items-center gap-1.5 text-xs font-bold transition-colors relative"
        >
          <SlidersHorizontal className="w-4 h-4 text-honey-700" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 bg-honey-500 text-amberBrown-950 rounded-full text-[10px] font-black flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

      </div>

      {/* Category Pills (Horizontal scrolling on mobile with touch momentum) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
              selectedCategory === cat
                ? 'bg-amber-gold-gradient text-amberBrown-950 shadow-honey-sm'
                : 'bg-white text-amberBrown-800 border border-honey-200 hover:bg-honey-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Counter Row */}
      <div className="flex items-center justify-between text-xs text-amberBrown-500 font-medium pt-1">
        <span>{products.length} {products.length === 1 ? 'honey variety' : 'honey varieties'} found</span>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-honey-700 font-bold hover:underline"
          >
            Reset filters ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid products={products} loading={loading} />

      {/* 📱 Mobile Slide-up Bottom Sheet for Filters & Sorting */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-amberBrown-950/60 backdrop-blur-sm"
          />

          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl border-t border-honey-300 shadow-2xl p-5 sm:p-6 overflow-y-auto space-y-5 animate-slideUp pb-safe">
            
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-honey-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-honey-600" />
                <h3 className="font-serif font-bold text-lg text-amberBrown-950">Filters & Sorting</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-amberBrown-400 hover:text-amberBrown-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Options on Mobile */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-amberBrown-900 tracking-wider">
                Sort Products By
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'newest', label: 'Newest First' },
                  { id: 'price-asc', label: 'Price: Low → High' },
                  { id: 'price-desc', label: 'Price: High → Low' },
                  { id: 'rating', label: 'Highest Rated' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSortBy(opt.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                      sortBy === opt.id
                        ? 'bg-honey-100 border-honey-400 text-amberBrown-950 font-black'
                        : 'bg-cream-50 border-honey-200 text-amberBrown-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-honey-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2 pt-2 border-t border-honey-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-amberBrown-900 tracking-wider">
                  Maximum Price
                </label>
                <span className="font-serif font-black text-honey-700 text-sm">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-honey-600 cursor-pointer h-2 bg-cream-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-semibold text-amberBrown-400">
                <span>₹100</span>
                <span>₹1,500</span>
                <span>₹3,000</span>
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-2 pt-2 border-t border-honey-100">
              <label className="block text-xs font-bold uppercase text-amberBrown-900 tracking-wider">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-gold-gradient text-amberBrown-950'
                        : 'bg-cream-50 text-amberBrown-700 border border-honey-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex gap-2 border-t border-honey-100">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-3 bg-cream-50 hover:bg-honey-100 text-amberBrown-800 font-bold text-xs rounded-xl border border-honey-200"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-amber-gold-gradient text-amberBrown-950 font-black text-xs rounded-xl shadow-honey-sm"
              >
                Apply Filters ({products.length})
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
