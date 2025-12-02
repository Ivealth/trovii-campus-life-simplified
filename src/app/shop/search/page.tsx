"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  Search, Heart, Star, ShoppingCart, X, ArrowLeft, TrendingUp, Clock, SlidersHorizontal, Check
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  description: string | null
  productCount: number
}

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  originalPrice: number | null
  imageUrl: string
  badge: string | null
  rating: number
  reviewCount: number
  stockQuantity: number
  categoryName: string | null
  categoryId: number | null
}

const POPULAR_SEARCHES = [
  "iPhone",
  "Laptop",
  "Headphones",
  "Smart Watch",
  "Camera",
  "Gaming",
]

const PRICE_RANGES = [
  { label: "Under ₦5,000", min: 0, max: 5000 },
  { label: "₦5,000 - ₦20,000", min: 5000, max: 20000 },
  { label: "₦20,000 - ₦50,000", min: 20000, max: 50000 },
  { label: "₦50,000 - ₦100,000", min: 50000, max: 100000 },
  { label: "Above ₦100,000", min: 100000, max: Infinity },
]

export default function SearchPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>("relevance")

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    if (session?.user) {
      fetchCategories()
    }
  }, [session])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=100")
        if (response.ok) {
          const data = await response.json()
          setAllProducts(data.products)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoadingProducts(false)
      }
    }

    if (session?.user) {
      fetchProducts()
    }
  }, [session])

  // Fetch cart count
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("bearer_token")
        const response = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setCartCount(data.totalItems || 0)
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      }
    }

    if (session?.user) {
      fetchCart()
    }
  }, [session])

  // Auto-focus search input
  useEffect(() => {
    const input = document.getElementById("search-input")
    if (input) {
      input.focus()
    }
  }, [])

  // Filter products based on search and filters
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    let filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.categoryName?.toLowerCase().includes(query)
    )
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.categoryId === parseInt(selectedCategory))
    }
    
    // Apply price range filter
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange]
      filtered = filtered.filter((p) => p.price >= range.min && p.price <= range.max)
    }
    
    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating)
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // relevance - keep original order
        break
    }
    
    return filtered
  }, [allProducts, searchQuery, selectedCategory, selectedPriceRange, minRating, sortBy])

  // Save search to recent
  const saveSearch = (query: string) => {
    if (!query.trim()) return
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      saveSearch(query)
    } else {
      setIsSearching(false)
    }
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory("all")
    setSelectedPriceRange(null)
    setMinRating(0)
    setSortBy("relevance")
  }

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== "all") count++
    if (selectedPriceRange !== null) count++
    if (minRating > 0) count++
    return count
  }, [selectedCategory, selectedPriceRange, minRating])

  // Add to cart
  const handleAddToCart = async (productId: number, productName: string) => {
    if (!session?.user) {
      toast.error("Please sign in to add items to cart")
      router.push("/register?mode=signin")
      return
    }

    setAddingToCart(productId)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        toast.success(`Added to cart`)
        setCartCount((prev) => prev + 1)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  // Toggle wishlist
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
        toast.success("Removed from wishlist")
      } else {
        newSet.add(productId)
        toast.success("Added to wishlist")
      }
      return newSet
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header - Fixed at Top */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-stone-600" />
            </button>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search for products, brands, and categories..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10 h-9 text-sm border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => router.push("/cart")}
              className="relative w-9 h-9 flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 text-stone-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-stone-900 text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[72px] min-h-screen">
        <div className="container mx-auto px-4 py-4">
          {/* Search Suggestions / Results */}
          {!isSearching || !searchQuery.trim() ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <h3 className="text-sm font-semibold text-stone-900">Recent Searches</h3>
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-stone-500 hover:text-stone-900"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm rounded-lg transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-stone-400" />
                  <h3 className="text-sm font-semibold text-stone-900">Popular Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Empty State */}
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-stone-400" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Start searching
                </h3>
                <p className="text-sm text-stone-600">
                  Search for products, brands, or categories
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Results Header with Filters */}
              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-900">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-9 gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 w-5 h-5 bg-yellow-400 text-stone-900 text-xs font-bold rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Filter Bar */}
                {showFilters && (
                  <div className="bg-white rounded-lg border border-stone-200 p-4 space-y-4">
                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-semibold text-stone-900 mb-2 block">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Most Relevant</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Top Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Categories */}
                    {!loadingCategories && categories.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-stone-900 mb-2 block">Category</label>
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedCategory("all")}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedCategory === "all"
                                ? "bg-yellow-400 text-stone-900"
                                : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>All Categories</span>
                              {selectedCategory === "all" && <Check className="w-4 h-4" />}
                            </div>
                          </button>
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id.toString())}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedCategory === cat.id.toString()
                                  ? "bg-yellow-400 text-stone-900"
                                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {cat.icon && <span>{cat.icon}</span>}
                                  <span>{cat.name}</span>
                                </div>
                                {selectedCategory === cat.id.toString() && <Check className="w-4 h-4" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-semibold text-stone-900 mb-2 block">Price Range</label>
                      <div className="space-y-2">
                        {PRICE_RANGES.map((range, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedPriceRange === idx
                                ? "bg-yellow-400 text-stone-900"
                                : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{range.label}</span>
                              {selectedPriceRange === idx && <Check className="w-4 h-4" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-sm font-semibold text-stone-900 mb-2 block">Minimum Rating</label>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              minRating === rating
                                ? "bg-yellow-400 text-stone-900"
                                : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-stone-300 text-stone-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-1">& Up</span>
                              </div>
                              {minRating === rating && <Check className="w-4 h-4" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Results Grid */}
              {loadingProducts ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-stone-200 overflow-hidden animate-pulse">
                      <div className="aspect-square bg-stone-100"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-stone-100 rounded w-3/4"></div>
                        <div className="h-3 bg-stone-100 rounded w-1/2"></div>
                        <div className="h-8 bg-stone-100 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-stone-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">No results found</h3>
                    <p className="text-stone-600 mb-6">
                      {activeFiltersCount > 0
                        ? "Try adjusting your filters or search for different keywords."
                        : `We couldn't find any products matching "${searchQuery}". Try different keywords.`}
                    </p>
                    <div className="flex gap-3 justify-center">
                      {activeFiltersCount > 0 && (
                        <Button
                          onClick={clearAllFilters}
                          variant="outline"
                        >
                          Clear Filters
                        </Button>
                      )}
                      <Button
                        onClick={() => handleSearch("")}
                        className="bg-stone-900 hover:bg-stone-800"
                      >
                        Clear search
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => router.push(`/shop/${product.id}`)}
                      className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300 cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-stone-50 overflow-hidden">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1">
                          {product.badge && (
                            <span className="bg-yellow-400 text-stone-900 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                              {product.badge}
                            </span>
                          )}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                              -{calculateDiscount(product.originalPrice, product.price)}% OFF
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWishlist(product.id)
                          }}
                          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-7 h-7 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-stone-600"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-2.5 sm:p-3">
                        <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium mb-1 uppercase tracking-wider line-clamp-1">
                          {product.categoryName || "Uncategorized"}
                        </p>
                        <h3 className="text-xs sm:text-sm font-semibold text-stone-900 mb-1.5 sm:mb-2 line-clamp-2 min-h-[2.5em] leading-tight">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                  i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-stone-200 text-stone-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-stone-500">
                            ({product.reviewCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-2 sm:mb-3">
                          <div className="flex items-baseline gap-1 sm:gap-1.5">
                            <span className="text-base sm:text-lg font-bold text-stone-900">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToCart(product.id, product.name)
                          }}
                          disabled={addingToCart === product.id || product.stockQuantity === 0}
                          className="w-full h-8 sm:h-9 text-[10px] sm:text-xs font-medium bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300"
                        >
                          {addingToCart === product.id ? (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : product.stockQuantity === 0 ? (
                            "Out of Stock"
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}