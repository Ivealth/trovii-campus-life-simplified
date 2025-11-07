"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  Star, Clock, TruckIcon, MapPin, ArrowLeft, 
  ShoppingCart, Plus, Minus, X, Search, Phone
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface Restaurant {
  id: number
  name: string
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

interface MenuItem {
  id: number
  restaurantId: number
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  isAvailable: boolean
  preparationTime: string
}

interface CartItem extends MenuItem {
  quantity: number
}

export default function RestaurantDetailPage() {
  const router = useRouter()
  const params = useParams()
  const restaurantId = params?.id as string
  const { data: session, isPending } = useSession()
  
  // States
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loadingRestaurant, setLoadingRestaurant] = useState(true)
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`)
        if (response.ok) {
          const data = await response.json()
          setRestaurant(data.restaurant)
        } else {
          toast.error("Restaurant not found")
          router.push("/food")
        }
      } catch (error) {
        console.error("Failed to fetch restaurant:", error)
        toast.error("Failed to load restaurant")
      } finally {
        setLoadingRestaurant(false)
      }
    }

    if (session?.user && restaurantId) {
      fetchRestaurant()
    }
  }, [session, restaurantId, router])

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`/api/menu-items?restaurantId=${restaurantId}&limit=100`)
        if (response.ok) {
          const data = await response.json()
          setMenuItems(data.menuItems || [])
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error)
        toast.error("Failed to load menu")
      } finally {
        setLoadingMenu(false)
      }
    }

    if (session?.user && restaurantId) {
      fetchMenuItems()
    }
  }, [session, restaurantId])

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(menuItems.map(item => item.category)))
    return uniqueCategories.sort()
  }, [menuItems])

  // Filter menu items
  const filteredMenuItems = useMemo(() => {
    let filtered = [...menuItems]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    return filtered
  }, [menuItems, searchQuery, selectedCategory])

  // Cart functions
  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) {
      toast.error("This item is currently unavailable")
      return
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
    toast.success(`${item.name} added to cart`)
  }

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
    toast.success("Item removed from cart")
  }

  const updateQuantity = (itemId: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change
          if (newQuantity <= 0) {
            return null
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean) as CartItem[]
    })
  }

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cart])

  const cartItemsCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const handleCheckout = async () => {
    if (!restaurant) return

    // Check minimum order
    if (cartTotal < restaurant.minimumOrder) {
      toast.error(`Minimum order is ${formatPrice(restaurant.minimumOrder)}`)
      return
    }

    setIsCheckingOut(true)

    try {
      const token = localStorage.getItem("bearer_token")
      
      // Create order
      const orderResponse = await fetch("/api/food-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          items: cart.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          deliveryAddress: "Default Address", // In production, get from user profile
          deliveryFee: restaurant.deliveryFee,
          totalAmount: cartTotal + restaurant.deliveryFee
        })
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await orderResponse.json()

      // Clear cart and redirect to confirmation
      setCart([])
      toast.success("Order placed successfully!")
      router.push(`/food/orders/${orderData.order.id}`)
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isPending || loadingRestaurant) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading restaurant...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || !restaurant) return null

  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/food")}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-stone-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-900 leading-none line-clamp-1">{restaurant.name}</span>
                <span className="text-[10px] text-stone-500 leading-none">{restaurant.cuisine}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 h-9 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="text-xs font-bold">{cartItemsCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Restaurant Hero */}
      <div className="pt-[60px]">
        <div className="relative h-48 sm:h-56 md:h-64 bg-stone-100">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Restaurant Status */}
          <div className="absolute top-4 left-4">
            {restaurant.isOpen ? (
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Open Now
              </span>
            ) : (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Restaurant Info Card */}
        <div className="container mx-auto px-4 -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-stone-200">
            <h1 className="text-xl font-bold text-stone-900 mb-2">{restaurant.name}</h1>
            <p className="text-sm text-stone-600 mb-3 leading-relaxed">{restaurant.description}</p>

            {/* Rating & Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-stone-900">{restaurant.rating}</span>
                <span className="text-xs text-stone-500">({restaurant.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                <span className="text-sm text-stone-600">{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TruckIcon className="w-4 h-4 text-stone-400" />
                <span className="text-sm text-stone-600">{formatPrice(restaurant.deliveryFee)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-stone-400" />
                <span className="text-sm text-stone-600 truncate">{restaurant.phone}</span>
              </div>
            </div>

            {/* Location & Minimum Order */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <span className="text-xs text-stone-600">{restaurant.location}</span>
              </div>
              {restaurant.minimumOrder > 0 && (
                <span className="text-xs text-stone-500">
                  Min. order: <span className="font-semibold text-stone-700">{formatPrice(restaurant.minimumOrder)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container mx-auto px-4 mt-6">
        {/* Search & Filter */}
        <div className="mb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10 text-sm border-stone-300 rounded-lg"
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

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-stone-700 border border-stone-300 hover:border-orange-500"
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-white text-stone-700 border border-stone-300 hover:border-orange-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {loadingMenu ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-stone-200 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-stone-100 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-stone-100 rounded w-3/4"></div>
                    <div className="h-3 bg-stone-100 rounded w-full"></div>
                    <div className="h-4 bg-stone-100 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMenuItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">No menu items found</h3>
              <p className="text-sm text-stone-600 mb-4">
                Try adjusting your search or filters.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                variant="outline"
                size="sm"
              >
                Clear filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMenuItems.map((item) => {
              const cartItem = cart.find(ci => ci.id === item.id)
              const inCart = !!cartItem

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg p-3 sm:p-4 border ${
                    item.isAvailable ? "border-stone-200" : "border-stone-200 opacity-60"
                  } transition-all hover:shadow-md`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Item Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-stone-50 rounded-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">Unavailable</span>
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-stone-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-stone-600 mb-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-base sm:text-lg font-bold text-stone-900">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {item.preparationTime}
                          </span>
                        </div>

                        {/* Add to Cart / Quantity Controls */}
                        {item.isAvailable && (
                          <div className="flex items-center gap-2">
                            {inCart ? (
                              <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-1">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-stone-100 text-orange-500 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-bold text-stone-900 min-w-[20px] text-center">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-stone-100 text-orange-500 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => addToCart(item)}
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-white h-9 px-3"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Your Order</SheetTitle>
            <SheetDescription>
              {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'} in cart
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-8 h-8 text-stone-400" />
                </div>
                <p className="text-sm text-stone-600">Your cart is empty</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-stone-50 rounded-lg">
                      <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-stone-900 line-clamp-1 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-sm font-bold text-stone-900 mb-2">
                          {formatPrice(item.price * item.quantity)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-white rounded-md p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-stone-100 text-stone-600"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-bold text-stone-900 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-stone-100 text-stone-600"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-semibold text-stone-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Delivery Fee</span>
                    <span className="font-semibold text-stone-900">{formatPrice(restaurant.deliveryFee)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base pt-2 border-t">
                    <span className="font-bold text-stone-900">Total</span>
                    <span className="font-bold text-stone-900">
                      {formatPrice(cartTotal + restaurant.deliveryFee)}
                    </span>
                  </div>
                </div>

                {/* Minimum Order Warning */}
                {restaurant.minimumOrder > 0 && cartTotal < restaurant.minimumOrder && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      Add {formatPrice(restaurant.minimumOrder - cartTotal)} more to meet minimum order
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !restaurant.isOpen || cartTotal < restaurant.minimumOrder}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : !restaurant.isOpen ? (
                    "Restaurant Closed"
                  ) : (
                    `Checkout • ${formatPrice(cartTotal + restaurant.deliveryFee)}`
                  )}
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
