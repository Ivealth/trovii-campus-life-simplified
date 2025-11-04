"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Search, Filter, ShoppingBag, Sparkles, LayoutGrid, User, TrendingUp } from "lucide-react"

const categories = [
  { id: "all", name: "All", icon: "🛍️" },
  { id: "books", name: "Textbooks", icon: "📚" },
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "housing", name: "Housing", icon: "🏠" },
  { id: "services", name: "Services", icon: "⚡" },
]

const featuredListings = [
  {
    id: 1,
    title: "MacBook Pro 2021",
    price: "$899",
    category: "Electronics",
    seller: "Sarah K.",
    image: "💻",
    condition: "Like New",
    featured: true,
  },
  {
    id: 2,
    title: "Calculus Textbook",
    price: "$45",
    category: "Textbooks",
    seller: "John D.",
    image: "📚",
    condition: "Good",
    featured: true,
  },
  {
    id: 3,
    title: "Off-Campus Studio",
    price: "$650/mo",
    category: "Housing",
    seller: "Mike R.",
    image: "🏠",
    condition: "Available",
    featured: true,
  },
  {
    id: 4,
    title: "Tutoring Sessions",
    price: "$25/hr",
    category: "Services",
    seller: "Emma L.",
    image: "📝",
    condition: "Active",
    featured: false,
  },
  {
    id: 5,
    title: "iPhone 13 Pro",
    price: "$599",
    category: "Electronics",
    seller: "Alex M.",
    image: "📱",
    condition: "Excellent",
    featured: false,
  },
  {
    id: 6,
    title: "Dorm Furniture Set",
    price: "$120",
    category: "Housing",
    seller: "Lisa T.",
    image: "🛋️",
    condition: "Good",
    featured: false,
  },
]

export default function MarketplacePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#FFD800] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const filteredListings = selectedCategory === "all" 
    ? featuredListings 
    : featuredListings.filter(item => item.category.toLowerCase() === selectedCategory)

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-20">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-br from-[#500099] via-[#3D0086] to-[#500099] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD800] rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#086BFA] rounded-full blur-3xl opacity-20" />
        
        <div className="relative max-w-6xl mx-auto px-6 py-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <a href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-[#FFD800] font-bold text-base">T</span>
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                Trovii Market
              </span>
            </a>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/90 hidden sm:inline">
                {session.user.name}
              </span>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#FFD800]" />
              <h1 className="text-2xl font-bold text-white">
                Student Marketplace
              </h1>
            </div>
            <p className="text-white/80 text-sm">
              Buy, sell, and trade with fellow students
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search for items, housing, services..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/95 backdrop-blur-sm border-0 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD800] shadow-lg"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD800] to-[#FDC500] flex items-center justify-center hover:scale-105 transition-transform">
              <Filter className="w-4 h-4 text-stone-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories - Horizontal Scroll */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[#FFD800] to-[#FFEA32] text-stone-900 font-semibold shadow-lg shadow-[#FFD800]/30"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Featured Badge */}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#FFD800]" />
            <h2 className="text-lg font-semibold text-stone-900">
              Featured Listings
            </h2>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              >
                {/* Item Image/Icon */}
                <div className="relative h-40 bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform">
                    {listing.image}
                  </span>
                  {listing.featured && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFD800] to-[#FFEA32] text-xs font-semibold text-stone-900 shadow-lg">
                      Featured
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-900 mb-1 line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-stone-500">{listing.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <div>
                      <p className="text-lg font-bold text-[#500099]">
                        {listing.price}
                      </p>
                      <p className="text-xs text-stone-500">{listing.seller}</p>
                    </div>
                    <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD800] to-[#FDC500] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#FFD800]/30">
                      <ShoppingBag className="w-4 h-4 text-stone-900" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                No items found
              </h3>
              <p className="text-sm text-stone-500">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Premium Bottom Navigation with Yellow Accents */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-stone-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4">
          <div className="flex items-center justify-around h-16">
            {/* Shop Icon - Active with Yellow */}
            <button className="relative flex flex-col items-center justify-center w-16 h-16 group active:scale-95 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD800] to-[#FDC500] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#FFD800] rounded-xl blur-md opacity-40" />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD800] to-[#FDC500] flex items-center justify-center shadow-lg shadow-[#FFD800]/30">
                    <ShoppingBag className="w-5 h-5 text-stone-900" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#FFD800] tracking-wide">SHOP</span>
              </div>
            </button>

            {/* Menu Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="relative flex flex-col items-center justify-center w-16 h-16 group active:scale-95 transition-all"
            >
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <LayoutGrid className="w-6 h-6 text-stone-400 group-hover:text-[#500099] transition-colors" strokeWidth={2} />
                <span className="text-[9px] font-medium text-stone-400 group-hover:text-[#500099] transition-colors tracking-wide">MENU</span>
              </div>
            </button>

            {/* Profile Icon */}
            <button 
              onClick={() => router.push("/account")}
              className="relative flex flex-col items-center justify-center w-16 h-16 group active:scale-95 transition-all"
            >
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <User className="w-6 h-6 text-stone-400 group-hover:text-[#500099] transition-colors" strokeWidth={2} />
                <span className="text-[9px] font-medium text-stone-400 group-hover:text-[#500099] transition-colors tracking-wide">PROFILE</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
