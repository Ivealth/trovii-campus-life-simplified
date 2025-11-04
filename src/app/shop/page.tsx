"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Menu, ShoppingCart, Search, ChevronRight, Filter, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "fashion", name: "Fashion", icon: "shirt" },
    { id: "tech", name: "Tech", icon: "laptop" },
    { id: "books", name: "Books", icon: "book" },
    { id: "supplies", name: "Supplies", icon: "pen" },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Laptop Backpack",
      category: "Fashion",
      price: "$89.99",
      originalPrice: "$119.99",
      discount: "25% OFF",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Wireless Noise-Canceling Headphones",
      category: "Tech",
      price: "$149.99",
      originalPrice: "$199.99",
      discount: "25% OFF",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80",
      badge: "Featured"
    },
    {
      id: 3,
      name: "Smart Study Desk Lamp",
      category: "Supplies",
      price: "$45.99",
      originalPrice: "$65.99",
      discount: "30% OFF",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&q=80",
      badge: null
    },
    {
      id: 4,
      name: "Ergonomic Study Chair",
      category: "Supplies",
      price: "$199.99",
      originalPrice: "$299.99",
      discount: "33% OFF",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&q=80",
      badge: "Popular"
    },
    {
      id: 5,
      name: "Complete Calculus Textbook Set",
      category: "Books",
      price: "$79.99",
      originalPrice: "$120.99",
      discount: "34% OFF",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop&q=80",
      badge: null
    },
    {
      id: 6,
      name: "Professional Notebook Bundle",
      category: "Supplies",
      price: "$24.99",
      originalPrice: "$34.99",
      discount: "29% OFF",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop&q=80",
      badge: null
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-20">
      {/* Premium Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <div>
                <span className="text-lg font-bold text-stone-900 block leading-tight">Student Marketplace</span>
                <span className="text-xs text-stone-500">Exclusive deals for students</span>
              </div>
            </div>
            <button className="relative p-2.5 hover:bg-stone-100 rounded-xl transition-colors">
              <ShoppingCart className="w-5 h-5 text-stone-700" strokeWidth={2} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-stone-900 rounded-full"></div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 h-12 bg-white border-stone-300 rounded-xl text-sm placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-stone-900"
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 hover:bg-stone-100 rounded-lg"
            >
              <Filter className="w-4 h-4 mr-1.5" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-xl text-sm font-medium text-stone-700 transition-all whitespace-nowrap"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Banner */}
          <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl overflow-hidden mb-10 p-10 md:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#500099]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#086BFA]/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">Student Exclusive</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  Save up to 40%<br />on campus essentials
                </h2>
                <p className="text-stone-300 mb-6 text-sm">
                  Premium products curated for student success
                </p>
                <Button className="bg-white text-stone-900 hover:bg-stone-100 font-semibold h-11 px-6 rounded-xl">
                  Shop Now
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              <div className="flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=300&h=300&fit=crop&q=80" 
                  alt="Featured products"
                  className="w-48 h-48 rounded-2xl object-cover shadow-2xl ring-4 ring-white/20"
                />
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-1">Featured Products</h3>
                <p className="text-sm text-stone-600">Handpicked deals for students</p>
              </div>
              <Button variant="ghost" className="text-sm font-semibold text-stone-700 hover:text-stone-900 gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                      {product.discount}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-stone-500 mb-1 uppercase tracking-wider font-medium">{product.category}</p>
                    <h4 className="text-sm font-semibold text-stone-900 mb-3 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-stone-900">{product.price}</span>
                      <span className="text-xs text-stone-400 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Offer Banner */}
          <div className="bg-gradient-to-r from-stone-100 via-white to-stone-100 rounded-2xl border border-stone-200 p-8 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=200&fit=crop&q=80" 
                alt="Textbook sale"
                className="w-32 h-32 rounded-xl object-cover shadow-lg"
              />
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-bold text-stone-900 mb-2">📚 Semester Textbook Sale</h4>
                <p className="text-stone-600 mb-4">Save up to 50% on required course materials</p>
                <Button variant="outline" className="border-stone-300 hover:bg-stone-50 font-semibold rounded-xl">
                  Browse Books
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-200 shadow-2xl z-50">
        <div className="max-w-md mx-auto px-6">
          <div className="flex items-center justify-around h-16">
            {/* Shop Icon - Active */}
            <button className="flex flex-col items-center justify-center gap-1 py-2 px-4 group active:scale-95 transition-all">
              <div className="relative">
                <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-stone-900" />
              </div>
              <span className="text-[11px] font-semibold text-stone-900">Shop</span>
            </button>

            {/* Menu Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-xl bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-stone-900 group-hover:to-stone-700 flex items-center justify-center transition-all">
                <Menu className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-stone-900 group-hover:font-semibold transition-all">Menu</span>
            </button>

            {/* Profile Icon */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-stone-900 group-hover:to-stone-700 flex items-center justify-center transition-all">
                <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-stone-900 group-hover:font-semibold transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}