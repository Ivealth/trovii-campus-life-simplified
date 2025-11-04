"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Search, ChevronRight, Heart, Star } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ShopPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#500099] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const categories = [
    { id: "electronics", name: "Electronics", icon: "⚡", color: "from-[#086BFA] to-[#500099]" },
    { id: "fashion", name: "Fashion", icon: "👔", color: "from-[#500099] to-[#3D0086]" },
    { id: "books", name: "Books", icon: "📚", color: "from-[#FFD800] to-[#FDC500]" },
    { id: "health", name: "Health", icon: "🏥", color: "from-[#10b981] to-[#059669]" },
    { id: "food", name: "Food", icon: "🍕", color: "from-[#f97316] to-[#ea580c]" },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Noise Cancelling Headphones",
      category: "Electronics",
      price: "₦24,500",
      originalPrice: "₦35,000",
      discount: 30,
      rating: 4.8,
      reviews: 124,
      image: "🎧",
      inStock: true,
    },
    {
      id: 2,
      name: "Premium Backpack Pro",
      category: "Fashion",
      price: "₦12,900",
      originalPrice: "₦18,000",
      discount: 28,
      rating: 4.9,
      reviews: 89,
      image: "🎒",
      inStock: true,
    },
    {
      id: 3,
      name: "Smart Watch Series 5",
      category: "Electronics",
      price: "₦45,000",
      originalPrice: "₦65,000",
      discount: 31,
      rating: 4.7,
      reviews: 203,
      image: "⌚",
      inStock: true,
    },
    {
      id: 4,
      name: "Wireless Mouse Pro",
      category: "Electronics",
      price: "₦8,200",
      originalPrice: "₦12,000",
      discount: 32,
      rating: 4.6,
      reviews: 156,
      image: "🖱️",
      inStock: true,
    },
    {
      id: 5,
      name: "Designer Sneakers",
      category: "Fashion",
      price: "₦32,000",
      originalPrice: "₦48,000",
      discount: 33,
      rating: 4.9,
      reviews: 178,
      image: "👟",
      inStock: true,
    },
    {
      id: 6,
      name: "Study Desk Lamp LED",
      category: "Electronics",
      price: "₦6,800",
      originalPrice: "₦9,500",
      discount: 28,
      rating: 4.5,
      reviews: 92,
      image: "💡",
      inStock: true,
    },
  ]

  const trendingDeals = [
    {
      id: 1,
      title: "Flash Sale: Electronics",
      subtitle: "Up to 50% off on laptops & tablets",
      bgColor: "from-[#500099] to-[#3D0086]",
      icon: "⚡",
    },
    {
      id: 2,
      title: "Textbook Clearance",
      subtitle: "Academic books starting at ₦2,000",
      bgColor: "from-[#FFD800] to-[#FDC500]",
      icon: "📖",
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-20">
      {/* Modern Header with Search */}
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-stone-900 leading-none">Trovii Shop</h1>
                <p className="text-[10px] text-[#500099] font-medium">Student Marketplace</p>
              </div>
            </div>
            <button className="relative p-2 hover:bg-stone-100 rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-stone-700" strokeWidth={2} />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#500099] rounded-full"></div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" strokeWidth={2.5} />
              <Input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border-stone-200 rounded-xl text-sm placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#500099] focus-visible:border-[#500099] h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="bg-white border-b border-stone-100 px-4 py-4">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center min-w-[70px] gap-2 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                <span className="text-2xl filter drop-shadow-sm">{category.icon}</span>
              </div>
              <span className="text-[11px] font-medium text-stone-700 text-center leading-tight">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-5">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Trending Deals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-stone-900">🔥 Trending Deals</h2>
            </div>
            <div className="space-y-3">
              {trendingDeals.map((deal) => (
                <div
                  key={deal.id}
                  className={`relative bg-gradient-to-r ${deal.bgColor} rounded-2xl overflow-hidden shadow-lg cursor-pointer active:scale-[0.98] transition-transform`}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  </div>
                  <div className="relative px-5 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-0.5">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-white/90">
                        {deal.subtitle}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-3xl">{deal.icon}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Products Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-stone-900">Featured Products</h2>
              <button className="flex items-center gap-1 text-xs font-semibold text-[#500099] hover:gap-1.5 transition-all">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
                    <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-[#500099] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">
                        -{product.discount}%
                      </div>
                    )}
                    <button className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-3.5 h-3.5 text-stone-700" strokeWidth={2} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-stone-500 mb-0.5">{product.category}</p>
                    <h4 className="text-sm font-semibold text-stone-900 mb-1.5 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-[#FFD800] text-[#FFD800]" />
                      <span className="text-[11px] font-semibold text-stone-900">{product.rating}</span>
                      <span className="text-[10px] text-stone-400">({product.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#500099]">{product.price}</span>
                      <span className="text-[11px] text-stone-400 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clean Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {/* Shop Icon - Active */}
            <button className="flex flex-col items-center justify-center gap-1 py-2 px-4 group relative">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#500099]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-[#500099]">Shop</span>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#500099]" />
            </button>

            {/* Menu Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-[#500099] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-[#500099] group-hover:font-semibold transition-all">Menu</span>
            </button>

            {/* Profile Icon */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-[#500099] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-[#500099] group-hover:font-semibold transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}