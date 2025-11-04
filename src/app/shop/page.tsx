"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Menu, ShoppingCart, Search, ChevronRight } from "lucide-react"
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
    { id: "all", name: "Browse All", icon: "🏪" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "computers", name: "Computers", icon: "💻" },
    { id: "phones", name: "Phones", icon: "📱" },
    { id: "deals", name: "All Deals", icon: "🏷️" },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Backpack",
      category: "Fashion",
      price: "₦15,000",
      originalPrice: "₦20,000",
      discount: "25% OFF",
      image: "🎒",
    },
    {
      id: 2,
      name: "Wireless Earbuds",
      category: "Electronics",
      price: "₦8,500",
      originalPrice: "₦12,000",
      discount: "30% OFF",
      image: "🎧",
    },
    {
      id: 3,
      name: "Study Lamp",
      category: "Accessories",
      price: "₦4,200",
      originalPrice: "₦6,000",
      discount: "30% OFF",
      image: "💡",
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-20">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-[#500099] via-[#3D0086] to-[#500099] text-white py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-[#FFD800] text-[#500099] px-2 py-0.5 rounded">STUDENT DEALS</span>
            <span className="text-xs font-medium hidden sm:inline">UP TO 40% OFF</span>
          </div>
          <button className="text-xs font-semibold bg-white text-[#500099] px-3 py-1 rounded-md hover:bg-stone-100 transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-stone-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-base font-bold text-stone-900">Trovii Shop</span>
            </div>
            <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-stone-700" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-[#500099] rounded-full"></div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              type="text"
              placeholder="Search for products, brands and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border-0 rounded-lg text-sm placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#500099]"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                className="flex flex-col items-center justify-center min-w-[72px] gap-1.5 group"
              >
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-2xl group-hover:bg-gradient-to-br group-hover:from-[#500099] group-hover:to-[#3D0086] transition-all group-hover:scale-105">
                  <span className="group-hover:scale-110 transition-transform">{category.icon}</span>
                </div>
                <span className="text-[10px] font-medium text-stone-600 group-hover:text-[#500099] transition-colors text-center">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-5">
        <div className="max-w-6xl mx-auto">
          {/* Hero Banner */}
          <div className="relative bg-gradient-to-br from-[#500099] via-[#3D0086] to-[#500099] rounded-2xl overflow-hidden mb-6 shadow-lg">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD800] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#086BFA] rounded-full blur-3xl"></div>
            </div>
            <div className="relative px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="inline-block bg-[#FFD800] text-[#500099] text-[10px] font-bold px-2 py-1 rounded mb-2">
                    UP TO 40% OFF
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1.5">
                    Beauty Powered<br />by Nature
                  </h2>
                  <p className="text-xs text-white/80 mb-3">Free Delivery</p>
                  <button className="bg-white text-[#500099] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors">
                    Shop Now
                  </button>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-6xl">🧴</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-900">Featured Products</h3>
              <button className="flex items-center gap-1 text-xs font-semibold text-[#500099] hover:gap-2 transition-all">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative aspect-square bg-stone-50 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>
                    <div className="absolute top-2 right-2 bg-[#500099] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {product.discount}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-stone-500 mb-0.5">{product.category}</p>
                    <h4 className="text-sm font-semibold text-stone-900 mb-1.5 line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-[#500099]">{product.price}</span>
                      <span className="text-xs text-stone-400 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Offers */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-4">Special Offers</h3>
            <div className="bg-white rounded-xl border border-stone-200 p-4 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#FFD800] to-[#FFEA32] flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl">📚</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-stone-900 mb-1">Textbook Sale</h4>
                  <p className="text-xs text-stone-600 mb-2">Save up to 50% on academic books</p>
                  <button className="text-xs font-semibold text-[#500099] flex items-center gap-1 hover:gap-2 transition-all">
                    Shop Now <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-md mx-auto px-6">
          <div className="flex items-center justify-around h-16">
            {/* Shop Icon - Active with Stylish Logo */}
            <button className="flex flex-col items-center justify-center gap-1.5 py-2 px-4 group active:scale-95 transition-all">
              <div className="relative">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center shadow-lg shadow-[#500099]/20">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#500099]" />
              </div>
              <span className="text-[11px] font-semibold text-[#500099]">Shop</span>
            </button>

            {/* Menu Icon - Modern Logo */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-1.5 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="relative">
                <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-[#500099] group-hover:to-[#3D0086] flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-[#500099]/20">
                  <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-[#500099] group-hover:font-semibold transition-all">Menu</span>
            </button>

            {/* Profile Icon - Elegant Logo */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-1.5 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-[#500099] group-hover:to-[#3D0086] flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-[#500099]/20">
                  <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-[#500099] group-hover:font-semibold transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}