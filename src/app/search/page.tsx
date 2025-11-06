"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { ArrowLeft, Search, X, Star, ShoppingCart, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const { data: session, isPending } = useSession()
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products?limit=100`)
      if (response.ok) {
        const data = await response.json()
        const filtered = data.products.filter((p: Product) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName?.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
      }
    } catch (error) {
      console.error("Search failed:", error)
      toast.error("Search failed")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: number) => {
    if (!session?.user) return
    
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
        toast.success("Added to cart")
      } else {
        toast.error("Failed to add to cart")
      }
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(null)
    }
  }

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

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 py-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-10 pr-10 h-10 text-sm border-stone-300 rounded-full focus:ring-2 focus:ring-stone-900"
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
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searchQuery.trim() === "" ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">Start searching</h3>
            <p className="text-stone-600">Enter keywords to find products</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">No results found</h3>
            <p className="text-stone-600 mb-4">
              We couldn't find any products matching "{searchQuery}"
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              className="mx-auto"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-stone-600">
                Found <span className="font-semibold text-stone-900">{searchResults.length}</span> {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-stone-50 overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-stone-900 text-[10px] font-bold px-2 py-1 rounded">
                        {product.badge}
                      </span>
                    )}

                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        -{calculateDiscount(product.originalPrice, product.price)}%
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-stone-600"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="text-[10px] text-stone-500 font-medium mb-1 uppercase tracking-wider">
                      {product.categoryName || "Uncategorized"}
                    </p>
                    <h3 className="text-sm font-semibold text-stone-900 mb-2 line-clamp-2 min-h-[2.5em] leading-tight">
                      {product.name}
                    </h3>

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

                    <Button
                      onClick={() => handleAddToCart(product.id)}
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
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
