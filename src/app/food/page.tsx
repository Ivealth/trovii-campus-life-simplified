"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  Search, X, Star, Clock, TruckIcon, User, ShoppingBag,
  ArrowLeft, MapPin, SlidersHorizontal
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

interface Restaurant {
  id: number
  name: string
  slug: string
  description: string
  imageUrl: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minimumOrder: number
  cuisine: string
  isOpen: boolean
  location: string
  phone: string
}

export default function FoodPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("rating")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState(true)

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/api/restaurants?limit=50")
        if (response.ok) {
          const data = await response.json()
          setRestaurants(data.restaurants || [])
        }
      } catch (error) {
        console.error("Failed to fetch restaurants:", error)
        toast.error("Failed to load restaurants")
      } finally {
        setLoadingRestaurants(false)
      }
    }

    if (session?.user) {
      fetchRestaurants()
    }
  }, [session])

  // Get unique cuisines
  const cuisines = useMemo(() => {
    const uniqueCuisines = Array.from(new Set(restaurants.map(r => r.cuisine)))
    return uniqueCuisines.sort()
  }, [restaurants])

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    let filtered = [...restaurants]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query)
      )
    }

    // Apply cuisine filter
    if (selectedCuisine !== "all") {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine)
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "deliveryFee":
        filtered.sort((a, b) => a.deliveryFee - b.deliveryFee)
        break
      case "deliveryTime":
        filtered.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split("-")[0])
          const bTime = parseInt(b.deliveryTime.split("-")[0])
          return aTime - bTime
        })
        break
      default:
        break
    }

    return filtered
  }, [restaurants, searchQuery, selectedCuisine, sortBy])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Row */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/shop")}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-stone-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xl">🍽️</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-stone-900 leading-none tracking-tight">Trovii Food</span>
                  <span className="text-[10px] text-stone-500 leading-none tracking-wide">Delivery</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/food/orders")}
                className="flex items-center gap-1.5 h-8 px-2.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Orders</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/account")}
                className="flex items-center gap-1.5 h-8 px-2.5"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Account</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-2.5">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-9 text-sm border-stone-300 rounded-full focus:ring-2 focus:ring-orange-500"
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

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-[140px] pb-6">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white p-3 sm:p-4 rounded-lg border border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-stone-600">
              {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
            </span>
            {searchQuery && (
              <span className="text-xs sm:text-sm text-stone-400 truncate max-w-[150px] sm:max-w-none">
                • "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Cuisine Filter */}
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 border-stone-300 text-xs sm:text-sm">
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                {cuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 border-stone-300 text-xs sm:text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="deliveryFee">Delivery Fee</SelectItem>
                <SelectItem value="deliveryTime">Fastest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Restaurants Grid */}
        {loadingRestaurants ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-stone-200 overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-stone-100"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-stone-100 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-100 rounded w-full"></div>
                  <div className="h-3 bg-stone-100 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">No restaurants found</h3>
              <p className="text-stone-600 mb-6">
                Try adjusting your search or filters to find more options.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCuisine("all")
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Clear filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => router.push(`/food/${restaurant.id}`)}
                className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300 cursor-pointer"
              >
                {/* Restaurant Image */}
                <div className="relative aspect-[16/9] bg-stone-50 overflow-hidden">
                  <Image
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {restaurant.isOpen ? (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        Open
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Cuisine Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] font-semibold px-2 py-1 rounded-full shadow-lg">
                      {restaurant.cuisine}
                    </span>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-stone-900 mb-1 line-clamp-1">
                    {restaurant.name}
                  </h3>
                  
                  <p className="text-xs text-stone-600 mb-3 line-clamp-2 leading-relaxed">
                    {restaurant.description}
                  </p>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-stone-900">
                        {restaurant.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500">
                      ({restaurant.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Delivery Info */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-xs text-stone-600">{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TruckIcon className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-xs text-stone-600">{formatPrice(restaurant.deliveryFee)}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="text-xs text-stone-500 truncate">{restaurant.location}</span>
                  </div>

                  {/* Minimum Order */}
                  {restaurant.minimumOrder > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <span className="text-xs text-stone-500">
                        Min. order: <span className="font-semibold text-stone-700">{formatPrice(restaurant.minimumOrder)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around h-14">
            {/* Food Icon - Active */}
            <button 
              onClick={() => router.push("/food")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 1.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-orange-500">Restaurants</span>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
            </button>

            {/* Orders */}
            <button 
              onClick={() => router.push("/food/orders")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-stone-400 group-hover:text-orange-500 transition-colors" strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-orange-500 group-hover:font-semibold transition-all">Orders</span>
            </button>

            {/* Back to Shop */}
            <button 
              onClick={() => router.push("/shop")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-orange-500 group-hover:font-semibold transition-all">Shop</span>
            </button>

            {/* Profile */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <User className="w-6 h-6 text-stone-400 group-hover:text-orange-500 transition-colors" strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-orange-500 group-hover:font-semibold transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}