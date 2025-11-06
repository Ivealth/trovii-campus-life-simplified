"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  Search, Heart, Star, ShoppingCart, User, ChevronDown,
  SlidersHorizontal, X, Grid3x3, List, Plus, Minus, Check
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export default function ShopPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [showFilters, setShowFilters] = useState(false)
  
  // API Data States
  const [categories, setCategories] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  
  // Loading States
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

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
        toast.error("Failed to load products")
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.categoryName?.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.categoryId === parseInt(selectedCategory)
      )
    }

    // Apply price range filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    )

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
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // Keep original order (featured)
        break
    }

    return filtered
  }, [allProducts, searchQuery, selectedCategory, sortBy, priceRange])

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
          <p className="text-sm text-stone-600 font-medium">Loading store...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header - Fixed at Top (Banner Removed) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Row */}
          <div className="flex items-center justify-between py-3">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-stone-900 leading-none tracking-tight">Trovii</span>
                <span className="text-[10px] text-stone-500 leading-none tracking-wide">Marketplace</span>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/account")}
                className="hidden sm:flex items-center gap-1.5 h-8 px-2.5"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-xs">Account</span>
              </Button>
              
              {/* Store Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/shop")}
                className="h-8 px-2.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Button>
              
              <Button
                onClick={() => toast.info("Cart page coming soon!")}
                className="relative h-8 px-2.5 text-xs bg-transparent hover:bg-stone-100 text-stone-900 border-0 shadow-none"
                size="sm"
              >
                <ShoppingCart className="w-5 h-5 sm:mr-1.5" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 text-stone-900 text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-2.5">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search for products, brands, and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-9 text-sm border-stone-300 rounded-full focus:ring-2 focus:ring-stone-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Bar */}
          <div className="pb-2 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 min-w-max">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id.toString()
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner - Big Banner After Header (Konga Style) - Moved Down */}
      <div className="pt-[128px] pb-4">
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-y border-yellow-500 shadow-md">
          <div className="container mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center justify-center w-14 h-14 bg-stone-900 rounded-full">
                  <span className="text-3xl">🎉</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                    Black Friday Deals!
                  </h3>
                  <p className="text-sm sm:text-base text-stone-700 font-medium">
                    Up to 70% off on selected items • Limited time offer
                  </p>
                </div>
              </div>
              <Button 
                size="sm"
                className="hidden sm:flex bg-stone-900 hover:bg-stone-800 text-white font-semibold h-10 px-8 rounded-full shadow-lg"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters & Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg border border-stone-200">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
              {searchQuery && (
                <span className="text-sm text-stone-400">
                  • Showing results for "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-stone-200"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-stone-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-9 border-stone-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid/List */}
        {loadingProducts ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            : "space-y-4"
          }>
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">No products found</h3>
              <p className="text-stone-600 mb-6">
                We couldn't find any products matching your search. Try different keywords or filters.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSortBy("featured")
                }}
                className="bg-stone-900 hover:bg-stone-800"
              >
                Clear all filters
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              viewMode === "grid" ? (
                // Grid View
                <div
                  key={product.id}
                  className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300"
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
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.badge && (
                        <span className="bg-yellow-400 text-stone-900 text-[10px] font-bold px-2 py-1 rounded">
                          {product.badge}
                        </span>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                          -{calculateDiscount(product.originalPrice, product.price)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-stone-600"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <p className="text-[10px] text-stone-500 font-medium mb-1 uppercase tracking-wider">
                      {product.categoryName || "Uncategorized"}
                    </p>
                    <h3 className="text-sm font-semibold text-stone-900 mb-2 line-clamp-2 min-h-[2.5em] leading-tight">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-stone-200 text-stone-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-500">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-stone-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-stone-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product.id, product.name)}
                      disabled={addingToCart === product.id || product.stockQuantity === 0}
                      className="w-full h-9 text-xs font-medium bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300"
                    >
                      {addingToCart === product.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : product.stockQuantity === 0 ? (
                        "Out of Stock"
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={product.id}
                  className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex"
                >
                  {/* Product Image */}
                  <div className="relative w-48 h-48 bg-stone-50 flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.badge && (
                        <span className="bg-yellow-400 text-stone-900 text-[10px] font-bold px-2 py-1 rounded">
                          {product.badge}
                        </span>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                          -{calculateDiscount(product.originalPrice, product.price)}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 p-4 flex flex-col">
                    <p className="text-xs text-stone-500 font-medium mb-1 uppercase tracking-wider">
                      {product.categoryName || "Uncategorized"}
                    </p>
                    <h3 className="text-base font-semibold text-stone-900 mb-2">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-stone-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-stone-200 text-stone-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-stone-500">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-auto flex items-center justify-between">
                      {/* Price */}
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-stone-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-stone-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-stone-600"
                            }`}
                          />
                        </button>
                        
                        <Button
                          onClick={() => handleAddToCart(product.id, product.name)}
                          disabled={addingToCart === product.id || product.stockQuantity === 0}
                          className="h-10 px-6 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300"
                        >
                          {addingToCart === product.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : product.stockQuantity === 0 ? (
                            "Out of Stock"
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 mb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-stone-900 mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><a href="#" className="hover:text-stone-900">All Products</a></li>
                <li><a href="#" className="hover:text-stone-900">New Arrivals</a></li>
                <li><a href="#" className="hover:text-stone-900">Best Sellers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-3">Help</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><a href="#" className="hover:text-stone-900">Customer Service</a></li>
                <li><a href="#" className="hover:text-stone-900">Track Order</a></li>
                <li><a href="#" className="hover:text-stone-900">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-3">About</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><a href="#" className="hover:text-stone-900">About Trovii</a></li>
                <li><a href="#" className="hover:text-stone-900">Careers</a></li>
                <li><a href="#" className="hover:text-stone-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-3">Follow Us</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><a href="#" className="hover:text-stone-900">Instagram</a></li>
                <li><a href="#" className="hover:text-stone-900">Twitter</a></li>
                <li><a href="#" className="hover:text-stone-900">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-6 text-center">
            <p className="text-sm text-stone-600">
              © 2025 Trovii Marketplace. A product of Ivealth LTD. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Fixed Bottom Navigation - Reduced Height & Yellow Icons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around h-14">
            {/* Shop Icon - Active */}
            <button 
              onClick={() => router.push("/shop")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-yellow-400">Shop</span>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400" />
            </button>

            {/* Menu Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-yellow-400 group-hover:font-semibold transition-all">Menu</span>
            </button>

            {/* Profile Icon */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-yellow-400 group-hover:font-semibold transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}