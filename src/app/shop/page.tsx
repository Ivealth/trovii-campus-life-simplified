"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { 
  Search, ChevronRight, Heart, Star, 
  ShoppingCart, User, Filter, SlidersHorizontal,
  TrendingUp, Zap, Package, Shield
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Define hero banners at module scope
const HERO_BANNERS = [
  {
    id: "banner-1",
    title: "Welcome to Campus Marketplace",
    subtitle: "Everything students need, delivered to your dorm",
    cta: "Start Shopping",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
  },
  {
    id: "banner-2",
    title: "Tech Essentials for Every Student",
    subtitle: "Latest gadgets, best prices, fast delivery",
    cta: "Explore Tech",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
  },
  {
    id: "banner-3",
    title: "Fashion That Fits Your Style",
    subtitle: "Trendy looks for campus life",
    cta: "Shop Fashion",
    gradient: "from-pink-600 via-rose-600 to-red-600",
  },
]

export default function ShopPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [heroIndex, setHeroIndex] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Auto-rotate hero banners
  useEffect(() => {
    if (HERO_BANNERS.length <= 1) return
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % HERO_BANNERS.length), 6000)
    return () => clearInterval(id)
  }, [])

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const categories = [
    { id: "electronics", name: "Electronics", icon: "💻" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "books", name: "Books & Supplies", icon: "📚" },
    { id: "home", name: "Home & Living", icon: "🏠" },
    { id: "sports", name: "Sports & Fitness", icon: "⚽" },
    { id: "beauty", name: "Beauty & Health", icon: "💄" },
    { id: "food", name: "Food & Snacks", icon: "🍕" },
    { id: "accessories", name: "Accessories", icon: "⌚" },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 24500,
      originalPrice: 35000,
      rating: 4.8,
      reviews: 234,
      image: "🎧",
      badge: "Best Seller",
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      category: "Electronics",
      price: 45000,
      originalPrice: 65000,
      rating: 4.9,
      reviews: 189,
      image: "⌚",
      badge: "Trending",
      inStock: true,
    },
    {
      id: 3,
      name: "Designer Backpack Pro",
      category: "Fashion",
      price: 12900,
      originalPrice: 18000,
      rating: 4.7,
      reviews: 156,
      image: "🎒",
      badge: null,
      inStock: true,
    },
    {
      id: 4,
      name: "Ergonomic Wireless Mouse",
      category: "Electronics",
      price: 8200,
      originalPrice: 12000,
      rating: 4.6,
      reviews: 203,
      image: "🖱️",
      badge: "Best Value",
      inStock: true,
    },
    {
      id: 5,
      name: "Premium Running Sneakers",
      category: "Fashion",
      price: 32000,
      originalPrice: 48000,
      rating: 4.9,
      reviews: 178,
      image: "👟",
      badge: "Top Rated",
      inStock: true,
    },
    {
      id: 6,
      name: "LED Study Desk Lamp",
      category: "Home",
      price: 6800,
      originalPrice: 9500,
      rating: 4.5,
      reviews: 142,
      image: "💡",
      badge: null,
      inStock: true,
    },
    {
      id: 7,
      name: "Bluetooth Speaker Pro",
      category: "Electronics",
      price: 15500,
      originalPrice: 22000,
      rating: 4.7,
      reviews: 167,
      image: "🔊",
      badge: "New Arrival",
      inStock: true,
    },
    {
      id: 8,
      name: "Canvas Tote Bag",
      category: "Fashion",
      price: 4500,
      originalPrice: 7000,
      rating: 4.4,
      reviews: 98,
      image: "👜",
      badge: null,
      inStock: true,
    },
  ]

  const quickLinks = [
    { icon: <TrendingUp className="w-5 h-5" />, label: "Trending", count: "120+ items" },
    { icon: <Zap className="w-5 h-5" />, label: "Flash Deals", count: "Save up to 50%" },
    { icon: <Package className="w-5 h-5" />, label: "Free Delivery", count: "On orders ₦5,000+" },
    { icon: <Shield className="w-5 h-5" />, label: "Verified Sellers", count: "100% authentic" },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="hidden lg:flex items-center justify-between px-6 py-2 text-xs text-stone-600 border-b border-stone-100">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                Free delivery on orders over ₦5,000
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                100% authentic products
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-stone-900 transition-colors">Help Center</a>
              <a href="#" className="hover:text-stone-900 transition-colors">Track Order</a>
              <a href="#" className="hover:text-stone-900 transition-colors">Sell on Trovii</a>
            </div>
          </div>

          {/* Main Header */}
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-stone-900 block leading-none">Trovii</span>
                  <span className="text-[10px] text-stone-500 leading-none">Marketplace</span>
                </div>
              </a>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <Input
                    type="text"
                    placeholder="Search for products, brands, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-12 pr-4 bg-stone-50 border-stone-200 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-stone-900"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/account")}
                  className="hidden sm:flex items-center gap-2 h-10 px-4"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm">Account</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 px-4"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden lg:inline ml-2 text-sm">Cart</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Categories Bar */}
          <div className="hidden lg:block px-6 py-2 border-t border-stone-100">
            <div className="flex items-center gap-8">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors py-2"
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                </button>
              ))}
              <button className="flex items-center gap-1 text-sm text-stone-900 font-semibold ml-auto">
                <SlidersHorizontal className="w-4 h-4" />
                More
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Hero Section */}
        <section className="mb-8 lg:mb-12">
          <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl">
            {HERO_BANNERS.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  idx === heroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className={`h-full w-full bg-gradient-to-r ${banner.gradient} relative`}>
                  {/* Decorative elements */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
                  
                  <div className="relative h-full flex items-center">
                    <div className="w-full px-6 sm:px-12 lg:px-16">
                      <div className="max-w-xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 leading-tight">
                          {banner.title}
                        </h1>
                        <p className="text-base sm:text-lg text-white/90 mb-6 lg:mb-8 leading-relaxed">
                          {banner.subtitle}
                        </p>
                        <Button
                          size="lg"
                          className="bg-white text-stone-900 hover:bg-stone-100 h-12 px-8 text-base font-semibold rounded-xl shadow-lg"
                        >
                          {banner.cta}
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
              {HERO_BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === heroIndex 
                      ? 'w-8 bg-white' 
                      : 'w-1.5 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-8 lg:mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {quickLinks.map((link, idx) => (
              <button
                key={idx}
                className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-stone-100 group-hover:bg-stone-900 text-stone-700 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                    {link.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm lg:text-base font-semibold text-stone-900 mb-0.5">
                      {link.label}
                    </p>
                    <p className="text-xs lg:text-sm text-stone-500">
                      {link.count}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-5 lg:mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-stone-900 mb-1">Featured Products</h2>
              <p className="text-sm text-stone-600">Handpicked deals for students</p>
            </div>
            <Button variant="ghost" className="text-sm font-semibold group">
              View All
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="bg-white rounded-xl lg:rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all cursor-pointer group"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-6 lg:p-8">
                  <span className="text-6xl lg:text-7xl group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                  </span>
                  
                  {/* Badges */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] lg:text-xs font-bold px-2 lg:px-2.5 py-1 rounded-lg shadow-md">
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {product.originalPrice > product.price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                      -{calculateDiscount(product.originalPrice, product.price)}%
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-stone-900 hover:text-white">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3 lg:p-4">
                  <p className="text-[10px] lg:text-xs text-stone-500 font-medium mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-sm lg:text-base font-semibold text-stone-900 mb-2 line-clamp-2 leading-snug min-h-[2.5em]">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-stone-200 text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-stone-900">
                      {product.rating}
                    </span>
                    <span className="text-xs text-stone-400">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg lg:text-xl font-bold text-stone-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs lg:text-sm text-stone-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="sm"
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-lg h-9 lg:h-10 text-xs lg:text-sm font-semibold"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5 lg:mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-stone-900 mb-1">Shop by Category</h2>
              <p className="text-sm text-stone-600">Find what you need, fast</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 border border-stone-200 hover:border-stone-900 hover:shadow-lg transition-all group"
              >
                <div className="text-4xl lg:text-5xl mb-3 lg:mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-sm lg:text-base font-semibold text-stone-900 group-hover:text-stone-900">
                  {cat.name}
                </h3>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          <button className="flex flex-col items-center gap-1 px-3 py-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-stone-900" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-stone-900">Shop</span>
          </button>

          <button
            onClick={() => router.push("/user-space")}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <Filter className="w-5 h-5 text-stone-500" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-medium text-stone-500">Menu</span>
          </button>

          <button
            onClick={() => router.push("/account")}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <User className="w-5 h-5 text-stone-500" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-medium text-stone-500">Account</span>
          </button>
        </div>
      </div>
    </div>
  )
}