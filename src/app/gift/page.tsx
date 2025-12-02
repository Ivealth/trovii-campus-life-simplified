"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  Gift, Search, Heart, Star, ShoppingCart, ArrowLeft, Sparkles,
  Clock, Package, CreditCard, X, Check, ChevronRight, Send, Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface GiftCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

interface GiftProduct {
  id: number
  name: string
  price: number
  originalPrice?: number
  imageUrl: string
  rating: number
  reviewCount: number
  category: string
  badge?: string
}

const giftCategories: GiftCategory[] = [
  { id: "birthday", name: "Birthday", icon: "🎂", description: "Celebrate their special day", color: "from-pink-500 to-rose-500" },
  { id: "anniversary", name: "Anniversary", icon: "💕", description: "Love & celebration", color: "from-red-500 to-pink-500" },
  { id: "graduation", name: "Graduation", icon: "🎓", description: "Academic achievements", color: "from-blue-500 to-indigo-500" },
  { id: "thank-you", name: "Thank You", icon: "🙏", description: "Show appreciation", color: "from-amber-500 to-orange-500" },
  { id: "congratulations", name: "Congrats", icon: "🎉", description: "Celebrate success", color: "from-yellow-500 to-amber-500" },
  { id: "get-well", name: "Get Well", icon: "💐", description: "Wishing recovery", color: "from-green-500 to-emerald-500" },
]

const featuredGifts: GiftProduct[] = [
  { id: 1, name: "Premium Gift Box Set", price: 15000, originalPrice: 20000, imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400", rating: 4.8, reviewCount: 124, category: "birthday", badge: "Best Seller" },
  { id: 2, name: "Luxury Chocolate Collection", price: 8500, imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400", rating: 4.9, reviewCount: 89, category: "thank-you" },
  { id: 3, name: "Spa & Wellness Hamper", price: 22000, originalPrice: 28000, imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400", rating: 4.7, reviewCount: 67, category: "get-well", badge: "Popular" },
  { id: 4, name: "Personalized Photo Frame", price: 5500, imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400", rating: 4.6, reviewCount: 156, category: "anniversary" },
  { id: 5, name: "Tech Gadget Bundle", price: 35000, originalPrice: 45000, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", rating: 4.8, reviewCount: 203, category: "graduation", badge: "New" },
  { id: 6, name: "Artisan Coffee Gift Set", price: 12000, imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400", rating: 4.5, reviewCount: 78, category: "thank-you" },
  { id: 7, name: "Luxury Perfume Set", price: 28000, imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400", rating: 4.9, reviewCount: 145, category: "birthday" },
  { id: 8, name: "Gourmet Food Basket", price: 18500, originalPrice: 22000, imageUrl: "https://images.unsplash.com/photo-1557275357-072087771588?w=400", rating: 4.7, reviewCount: 92, category: "congratulations" },
]

export default function GiftPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [cartCount, setCartCount] = useState(0)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

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

  const handleAddToCart = async (product: GiftProduct) => {
    setAddingToCart(product.id)
    
    // Simulate adding to cart
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setCartCount(prev => prev + 1)
    toast.success(`${product.name} added to cart`)
    setAddingToCart(null)
  }

  const filteredGifts = selectedCategory 
    ? featuredGifts.filter(g => g.category === selectedCategory)
    : featuredGifts

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading gifts...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-stone-50 pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/shop")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-stone-700" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  Gift Center
                </h1>
                <p className="text-[11px] text-stone-500">Send love & joy</p>
              </div>
            </div>

            {/* Cart */}
            <button
              onClick={() => router.push("/cart")}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-stone-900 hover:bg-stone-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-stone-50 border-stone-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[120px] pb-4">
        {/* Hero Banner */}
        <div className="container mx-auto px-4 mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Special Offer</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Send Joy Today! 🎁
              </h2>
              <p className="text-sm text-white/80 mb-4 max-w-sm">
                Free delivery on all gifts over ₦15,000. Make someone&apos;s day special!
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Package className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-medium text-white">Free Wrapping</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Clock className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-medium text-white">Same Day Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gift Categories */}
        <div className="container mx-auto px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-stone-900">Shop by Occasion</h3>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-medium text-pink-600 hover:text-pink-700"
              >
                Clear filter
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {giftCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`relative flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-br " + category.color + " text-white shadow-lg scale-[1.02]"
                    : "bg-white border border-stone-200 hover:border-stone-300 hover:shadow-md"
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1.5">{category.icon}</span>
                <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight ${
                  selectedCategory === category.id ? "text-white" : "text-stone-800"
                }`}>
                  {category.name}
                </span>
                {selectedCategory === category.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                    <Check className="w-3 h-3 text-pink-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="container mx-auto px-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-pink-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-stone-900">Send a Gift</h4>
                <p className="text-[11px] text-stone-500">Deliver directly</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-purple-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-stone-900">Gift Cards</h4>
                <p className="text-[11px] text-stone-500">Let them choose</p>
              </div>
            </button>
          </div>
        </div>

        {/* Featured Gifts */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-stone-900">
              {selectedCategory 
                ? `${giftCategories.find(c => c.id === selectedCategory)?.name} Gifts`
                : "Featured Gifts"
              }
            </h3>
            <span className="text-xs text-stone-500">{filteredGifts.length} items</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredGifts.map((gift) => (
              <div
                key={gift.id}
                className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-pink-200 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square bg-stone-100 overflow-hidden">
                  <Image
                    src={gift.imageUrl}
                    alt={gift.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {gift.badge && (
                      <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {gift.badge}
                      </span>
                    )}
                    {gift.originalPrice && (
                      <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        -{calculateDiscount(gift.originalPrice, gift.price)}%
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(gift.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.has(gift.id) ? "fill-pink-500 text-pink-500" : "text-stone-600"
                      }`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-stone-900 mb-1.5 line-clamp-2 min-h-[2.5em] leading-tight">
                    {gift.name}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                            i < Math.floor(gift.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-stone-200 text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-500">({gift.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-base sm:text-lg font-bold text-stone-900">
                      {formatPrice(gift.price)}
                    </span>
                    {gift.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                        {formatPrice(gift.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add Button */}
                  <Button
                    onClick={() => handleAddToCart(gift)}
                    disabled={addingToCart === gift.id}
                    className="w-full h-8 sm:h-9 text-[10px] sm:text-xs font-medium bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0"
                  >
                    {addingToCart === gift.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Gift className="w-3.5 h-3.5 mr-1.5" />
                        Add to Gift Box
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Gifting Section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-white rounded-2xl p-5 sm:p-6 border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
                  Group Gifting 🎊
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mb-3">
                  Pool resources with friends to send bigger, better gifts together!
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 h-8 text-xs font-medium"
                >
                  Start a Group Gift
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="container mx-auto px-4">
          <h3 className="text-base font-bold text-stone-900 mb-4 text-center">How It Works</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-lg font-bold text-pink-600">1</span>
              </div>
              <h4 className="text-[11px] sm:text-xs font-semibold text-stone-900 mb-0.5">Choose Gift</h4>
              <p className="text-[10px] text-stone-500">Browse our collection</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-lg font-bold text-pink-600">2</span>
              </div>
              <h4 className="text-[11px] sm:text-xs font-semibold text-stone-900 mb-0.5">Add Message</h4>
              <p className="text-[10px] text-stone-500">Personal touch</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-lg font-bold text-pink-600">3</span>
              </div>
              <h4 className="text-[11px] sm:text-xs font-semibold text-stone-900 mb-0.5">We Deliver</h4>
              <p className="text-[10px] text-stone-500">Fast & secure</p>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around h-14">
            {/* Shop Icon */}
            <button 
              onClick={() => router.push("/shop")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-pink-500 transition-all">Shop</span>
            </button>

            {/* Gift Icon - Active */}
            <button 
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Gift className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-[10px] font-semibold text-pink-500">Gifts</span>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-500" />
            </button>

            {/* Dashboard Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-pink-500 transition-all">Dashboard</span>
            </button>

            {/* Profile Icon */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-pink-500 transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
