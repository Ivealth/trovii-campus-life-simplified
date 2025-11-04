"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Search, Star, ArrowRight } from "lucide-react"
import BottomNav from "@/components/BottomNav"

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
          <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const categories = [
    "Electronics",
    "Fashion", 
    "Books",
    "Health",
    "Food",
    "Sports"
  ]

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: "₦24,500",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Premium Backpack",
      category: "Fashion",
      price: "₦12,900",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      name: "Smart Watch",
      category: "Electronics",
      price: "₦45,000",
      rating: 4.7,
      reviews: 203,
    },
    {
      id: 4,
      name: "Wireless Mouse",
      category: "Electronics",
      price: "₦8,200",
      rating: 4.6,
      reviews: 156,
    },
    {
      id: 5,
      name: "Canvas Sneakers",
      category: "Fashion",
      price: "₦32,000",
      rating: 4.9,
      reviews: 178,
    },
    {
      id: 6,
      name: "LED Desk Lamp",
      category: "Electronics",
      price: "₦6,800",
      rating: 4.5,
      reviews: 92,
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Header */}
      <div className="border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight mb-4">
            Shop
          </h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-full border border-stone-200 whitespace-nowrap transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-stone-900">
              Popular Products
            </h2>
            <button className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 transition-colors">
              View all
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                className="bg-white hover:bg-stone-50 border border-stone-200 rounded-lg overflow-hidden transition-colors text-left group"
              >
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-stone-100 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-lg bg-stone-200" />
                </div>
                
                {/* Product Info */}
                <div className="p-3">
                  <div className="text-xs text-stone-500 mb-1">
                    {product.category}
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-stone-900 text-stone-900" strokeWidth={2} />
                    <span className="text-xs font-medium text-stone-900">{product.rating}</span>
                    <span className="text-xs text-stone-500">({product.reviews})</span>
                  </div>
                  
                  {/* Price */}
                  <div className="text-base font-semibold text-stone-900">
                    {product.price}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}