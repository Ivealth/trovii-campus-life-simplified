"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { 
  Search, ChevronRight, ChevronLeft, Heart, Star, 
  ShoppingCart, User, ChevronDown, Store, Timer
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ShopPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [now, setNow] = useState(() => Date.now())
  const [heroIndex, setHeroIndex] = useState(0)
  const [showCategories, setShowCategories] = useState(false)

  // Countdown to next 2 hours for Deals of the Day
  const dealEndsAt = useMemo(() => Date.now() + 2 * 60 * 60 * 1000, [])
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const remainingMs = Math.max(0, dealEndsAt - now)
  const hours = String(Math.floor(remainingMs / (1000 * 60 * 60))).padStart(2, "0")
  const minutes = String(Math.floor((remainingMs / (1000 * 60)) % 60)).padStart(2, "0")
  const seconds = String(Math.floor((remainingMs / 1000) % 60)).padStart(2, "0")

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Auto-rotate hero banners
  useEffect(() => {
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % heroBanners.length), 5000)
    return () => clearInterval(id)
  }, [])

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

  const topLinks = [
    { label: "Sell on Trovii", href: "#" },
    { label: "Help", href: "#" },
    { label: "Track Order", href: "#" },
  ]

  const categories = [
    { id: "phones", name: "Phones & Tablets" },
    { id: "computers", name: "Computers & Accessories" },
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "beauty", name: "Beauty & Health" },
    { id: "home", name: "Home & Kitchen" },
    { id: "grocery", name: "Grocery" },
    { id: "gaming", name: "Gaming" },
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

  const heroBanners = [
    {
      id: "banner-1",
      title: "Back to Campus Deals",
      sub: "Save big on tech, fashion & essentials",
      bg: "from-[#500099] to-[#3D0086]",
    },
    {
      id: "banner-2",
      title: "Food Delivery Savings",
      sub: "Free delivery on first 3 orders",
      bg: "from-[#086BFA] to-[#500099]",
    },
    {
      id: "banner-3",
      title: "Internship Kickstart",
      sub: "Launch your career on Trovii",
      bg: "from-[#FDC500] to-[#FFD800]",
    },
  ]

  const officialStores = [
    { id: "apple", name: "Apple", bg: "from-stone-100 to-stone-50" },
    { id: "samsung", name: "Samsung", bg: "from-stone-100 to-stone-50" },
    { id: "nike", name: "Nike", bg: "from-stone-100 to-stone-50" },
    { id: "adidas", name: "Adidas", bg: "from-stone-100 to-stone-50" },
    { id: "hp", name: "HP", bg: "from-stone-100 to-stone-50" },
    { id: "dell", name: "Dell", bg: "from-stone-100 to-stone-50" },
  ]

  // Brands strip (reuse official stores names for now)
  const brands = officialStores.map((s) => s.name)

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top Utility Bar */}
      <div className="hidden md:block bg-stone-100 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-end gap-6 text-[13px] text-stone-600">
          {topLinks.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-stone-900 transition-colors">{l.label}</a>
          ))}
        </div>
      </div>

      {/* Main Header: Logo + Search + Icons */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-12 items-center gap-4">
          {/* Logo */}
          <a href="/" className="col-span-6 sm:col-span-3 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold">T</div>
            <span className="text-base font-semibold text-stone-900">Trovii</span>
          </a>

          {/* Search */}
          <div className="col-span-12 sm:col-span-6">
            <div className="flex items-stretch rounded-xl border border-stone-200 overflow-hidden">
              <button className="hidden sm:flex items-center gap-1 px-3 bg-stone-50 border-r border-stone-200 text-[13px] text-stone-700">
                All Categories <ChevronDown className="w-4 h-4" />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Search for products, brands and categories"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 pl-9 border-0 focus-visible:ring-0"
                />
              </div>
              <button className="px-4 bg-stone-900 text-white text-[13px] font-medium hover:bg-stone-800">Search</button>
            </div>
          </div>

          {/* Icons */}
          <div className="col-span-6 sm:col-span-3 flex items-center justify-end gap-3">
            <button
              onClick={() => router.push("/account")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100"
            >
              <User className="w-5 h-5 text-stone-700" />
              <span className="hidden md:inline text-[13px] font-medium text-stone-700">Account</span>
            </button>
            <button className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100">
              <ShoppingCart className="w-5 h-5 text-stone-700" />
              <span className="hidden md:inline text-[13px] font-medium text-stone-700">Cart</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#500099] text-white text-[11px] grid place-items-center">0</span>
            </button>
          </div>
        </div>

        {/* Category Nav Bar */}
        <div className="hidden md:block border-t border-stone-200 relative">
          <div className="max-w-6xl mx-auto px-4 h-11 flex items-center gap-6 text-[13px]">
            <button onClick={() => setShowCategories((s) => !s)} className="flex items-center gap-2 font-semibold text-stone-900">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
              </svg>
              All Categories
            </button>
            <div className="flex items-center gap-6 text-stone-700">
              {categories.map((c) => (
                <button key={c.id} className="hover:text-stone-900">{c.name}</button>
              ))}
            </div>
          </div>

          {showCategories && (
            <div className="absolute left-0 right-0 top-11 z-30">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-2xl">
                  {categories.map((c) => (
                    <button key={c.id} className="text-left p-3 rounded-lg hover:bg-stone-50">
                      <p className="text-[13px] font-semibold text-stone-900">{c.name}</p>
                      <p className="text-[12px] text-stone-500">Explore {c.name.toLowerCase()}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Hero Area: Left Sidebar + Carousel + Side Banners */}
      <section className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left categories (desktop) */}
        <aside className="hidden md:block md:col-span-3 bg-white rounded-xl border border-stone-200 sticky top-24">
          <ul className="py-2">
            {categories.map((c) => (
              <li key={c.id}>
                <button className="w-full flex items-center justify-between text-left text-[14px] px-4 py-2.5 hover:bg-stone-50">
                  <span className="text-stone-700">{c.name}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center hero carousel */}
        <div className="md:col-span-6">
          <div className="relative bg-white rounded-xl border border-stone-200 overflow-hidden h-56 md:h-72">
            {heroBanners.map((b, idx) => (
              <div
                key={b.id}
                className={`absolute inset-0 transition-opacity duration-500 ${idx === heroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className={`h-full w-full bg-gradient-to-r ${b.bg} p-6 relative text-white`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-6 -top-6 w-40 h-40 bg-white rounded-full blur-3xl" />
                  </div>
                  <div className="relative h-full flex flex-col items-start justify-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-1">{b.title}</h3>
                    <p className="text-sm/6 text-white/90 mb-4">{b.sub}</p>
                    <button className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-[13px] font-medium px-3 py-2 rounded-lg">
                      Shop Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute inset-y-0 left-0 flex items-center p-2">
              <button
                aria-label="Previous"
                onClick={() => setHeroIndex((i) => (i - 1 + heroBanners.length) % heroBanners.length)}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-stone-800" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center p-2">
              <button
                aria-label="Next"
                onClick={() => setHeroIndex((i) => (i + 1) % heroBanners.length)}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-stone-800" />
              </button>
            </div>
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
              {heroBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === heroIndex ? 'w-6 bg-white' : 'w-3 bg-white/60'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side banners */}
        <div className="md:col-span-3 grid grid-rows-2 gap-4">
          <div className="rounded-xl border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-50 p-5">
            <p className="text-sm font-semibold text-stone-900">Student Essentials</p>
            <p className="text-[13px] text-stone-600">Bags, bottles & more</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-50 p-5">
            <p className="text-sm font-semibold text-stone-900">Campus Tech</p>
            <p className="text-[13px] text-stone-600">Laptops & accessories</p>
          </div>
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="max-w-6xl mx-auto px-4 mt-2">
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFD800] grid place-items-center">
                <Timer className="w-4 h-4 text-stone-900" />
              </div>
              <h2 className="text-base font-semibold">Deals of the Day</h2>
            </div>
            <div className="text-[13px] font-mono bg-stone-100 rounded-md px-2 py-1">
              Ends in {hours}:{minutes}:{seconds}
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {featuredProducts.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
                  <span className="text-5xl group-hover:scale-110 transition-transform">{product.image}</span>
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-[#500099] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">
                      -{product.discount}%
                    </div>
                  )}
                  <button className="absolute bottom-2 left-2 right-2 h-8 rounded-lg bg-stone-900 text-white text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Add to Cart
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-stone-500 mb-0.5">{product.category}</p>
                  <h4 className="text-[13px] font-semibold text-stone-900 mb-1.5 line-clamp-2 leading-tight">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-[#FFD800] text-[#FFD800]" />
                    <span className="text-[11px] font-semibold text-stone-900">{product.rating}</span>
                    <span className="text-[10px] text-stone-400">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-[#500099]">{product.price}</span>
                    <span className="text-[11px] text-stone-400 line-through">{product.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Stores */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-stone-900 grid place-items-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base font-semibold">Official Stores</h2>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-[#500099] hover:gap-1.5 transition-all">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar">
            {officialStores.map((s) => (
              <div key={s.id} className={`min-w-[180px] rounded-xl border border-stone-200 bg-gradient-to-br ${s.bg} p-4`}>
                <div className="h-24 rounded-lg bg-white/60 grid place-items-center">
                  <span className="text-stone-700 font-semibold">{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands strip */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl border border-stone-200 p-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
          {brands.map((b) => (
            <div key={b} className="px-4 py-2 rounded-full border border-stone-200 bg-stone-50 text-[13px] text-stone-700 whitespace-nowrap hover:bg-stone-100">
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* Recommended for You */}
      <section className="max-w-6xl mx-auto px-4 mt-6 mb-24">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Recommended for you</h2>
          <button className="flex items-center gap-1 text-xs font-semibold text-[#500099] hover:gap-1.5 transition-all">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                <button className="absolute bottom-2 left-2 right-2 h-9 rounded-lg bg-stone-900 text-white text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Add to Cart
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
      </section>

      {/* Clean Fixed Bottom Navigation (kept for existing UX) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] z-50 md:hidden">
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