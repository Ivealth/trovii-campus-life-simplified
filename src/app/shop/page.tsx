"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  Search, Heart, Star, ShoppingCart, User, ChevronDown,
  SlidersHorizontal, X, Grid3x3, List, Plus, Minus, Check, Menu
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
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  
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
      {/* Header - Fixed at Top */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Row - Redesigned with bigger icons */}
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg sm:text-xl">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-stone-900 leading-none tracking-tight">Trovii</span>
                <span className="text-[10px] sm:text-xs text-stone-500 leading-none tracking-wide">Marketplace</span>
              </div>
            </button>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Account Button - Matching bottom nav size */}
              <button
                onClick={() => router.push("/account")}
                className="flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-stone-200 transition-all group"
              >
                <svg 
                  className="w-6 h-6 text-stone-700 group-hover:text-stone-900 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Cart Icon - Matching bottom nav size */}
              <button
                onClick={() => router.push("/cart")}
                className="relative flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-stone-700 transition-all group shadow-md"
              >
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-stone-900 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-3">
            <button
              onClick={() => router.push("/shop/search")}
              className="relative max-w-2xl mx-auto w-full"
            >
              <div className="flex items-center gap-3 h-11 sm:h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl hover:border-stone-300 hover:bg-white transition-all">
                <Search className="w-5 h-5 text-stone-400" />
                <span className="text-sm text-stone-400 flex-1 text-left">
                  Search products, brands, categories...
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="pt-[140px] sm:pt-[152px] pb-2">
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-y border-yellow-500 shadow-md">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-stone-900 rounded-xl sm:rounded-2xl shadow-lg">
                  <span className="text-2xl sm:text-4xl">🎉</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-stone-900 leading-tight mb-0.5 sm:mb-1">
                    Black Friday Deals!
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-stone-700 font-medium">
                    Up to 70% off • Limited time
                  </p>
                </div>
              </div>
              <Button 
                size="sm"
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold h-9 sm:h-11 px-4 sm:px-8 rounded-full shadow-xl text-xs sm:text-sm whitespace-nowrap"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-3">
        {/* Products Grid/List */}
        {loadingProducts ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
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
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              viewMode === "grid" ? (
                // Grid View
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

      {/* Fixed Bottom Navigation with Burger Icon */}
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

            {/* Burger Menu Icon - Categories */}
            <button 
              onClick={() => setShowCategoryMenu(true)}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="flex flex-col gap-1">
                  <div className="w-5 h-0.5 bg-stone-400 group-hover:bg-yellow-400 rounded-full transition-colors"></div>
                  <div className="w-5 h-0.5 bg-stone-400 group-hover:bg-yellow-400 rounded-full transition-colors"></div>
                  <div className="w-5 h-0.5 bg-stone-400 group-hover:bg-yellow-400 rounded-full transition-colors"></div>
                </div>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-yellow-400 group-hover:font-semibold transition-all">Menu</span>
            </button>

            {/* Dashboard Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-yellow-400 group-hover:font-semibold transition-all">Dashboard</span>
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

      {/* Category Menu Overlay */}
      {showCategoryMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
            onClick={() => setShowCategoryMenu(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-stone-900">Menu</h3>
              <button
                onClick={() => setShowCategoryMenu(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(80vh-72px)]">
              {/* Menu Items Section */}
              <div className="px-4 sm:px-6 py-3 border-b border-stone-200">
                <div className="grid grid-cols-2 gap-2">
                  {/* Sell on Trovii */}
                  <button className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-stone-50 transition-colors text-left group">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm group-hover:shadow-md transition-shadow">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-stone-900 leading-tight">
                        Sell on Trovii
                      </div>
                      <div className="text-[10px] text-stone-500 leading-tight">
                        Start selling
                      </div>
                    </div>
                  </button>

                  {/* Order meals */}
                  <button 
                    onClick={() => {
                      setShowCategoryMenu(false)
                      router.push("/food")
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-stone-50 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm group-hover:shadow-md transition-shadow">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 1.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-stone-900 leading-tight">
                        Order meals
                      </div>
                      <div className="text-[10px] text-stone-500 leading-tight">
                        Food delivery
                      </div>
                    </div>
                  </button>

                  {/* Gift center */}
                  <button 
                    onClick={() => {
                      setShowCategoryMenu(false)
                      router.push("/gift")
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-stone-50 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 shadow-sm group-hover:shadow-md transition-shadow">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-stone-900 leading-tight">
                        Gift center
                      </div>
                      <div className="text-[10px] text-stone-500 leading-tight">
                        Send gifts
                      </div>
                    </div>
                  </button>

                  {/* Business management */}
                  <button className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-stone-50 transition-colors text-left group">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm group-hover:shadow-md transition-shadow">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-stone-900 leading-tight">
                        Business
                      </div>
                      <div className="text-[10px] text-stone-500 leading-tight">
                        Manage tools
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Categories Section */}
              <div className="px-4 sm:px-6 py-4">
                <h4 className="text-sm sm:text-base font-bold text-stone-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("all")
                      setShowCategoryMenu(false)
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl font-medium transition-all ${
                      selectedCategory === "all"
                        ? "bg-yellow-400 text-stone-900 shadow-md"
                        : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base">🛍️ All Products</span>
                      {selectedCategory === "all" && (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                  </button>
                  
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id.toString())
                        setShowCategoryMenu(false)
                      }}
                      className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl font-medium transition-all ${
                        selectedCategory === cat.id.toString()
                          ? "bg-yellow-400 text-stone-900 shadow-md"
                          : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-xl">{cat.icon}</span>
                          <div>
                            <div className="text-sm sm:text-base">{cat.name}</div>
                            <div className="text-[10px] sm:text-xs text-stone-500 mt-0.5">{cat.productCount} products</div>
                          </div>
                        </div>
                        {selectedCategory === cat.id.toString() && (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}