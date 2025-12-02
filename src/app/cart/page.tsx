"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Package, Truck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CartItem {
  id: number
  productId: number
  productName: string
  productPrice: number
  productImageUrl: string
  quantity: number
}

export default function CartPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingItem, setUpdatingItem] = useState<number | null>(null)
  const [deletingItem, setDeletingItem] = useState<number | null>(null)

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("bearer_token")
        const response = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setCartItems(data.items || [])
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error)
        toast.error("Failed to load cart")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchCart()
    }
  }, [session])

  // Update quantity
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItem(itemId)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        )
        toast.success("Cart updated")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update cart")
      }
    } catch (error) {
      console.error("Failed to update cart:", error)
      toast.error("Failed to update cart")
    } finally {
      setUpdatingItem(null)
    }
  }

  // Remove item
  const removeItem = async (itemId: number) => {
    setDeletingItem(itemId)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId))
        toast.success("Item removed from cart")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to remove item")
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast.error("Failed to remove item")
    } finally {
      setDeletingItem(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  )
  const shipping = subtotal >= 5000 ? 0 : 500
  const total = subtotal + shipping

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Modern Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button
              onClick={() => router.push("/shop")}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">Continue Shopping</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-stone-600" />
              <div>
                <h1 className="text-lg font-bold text-stone-900">Shopping Cart</h1>
                <p className="text-xs text-stone-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            
            <div className="w-20 sm:w-32"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {cartItems.length === 0 ? (
            // Empty Cart State - Enhanced
            <div className="text-center py-16 sm:py-24">
              <div className="max-w-md mx-auto">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-yellow-100 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">Your cart is empty</h2>
                <p className="text-base sm:text-lg text-stone-600 mb-8 leading-relaxed">
                  Looks like you haven't added anything to your cart yet. Start shopping and discover amazing products!
                </p>
                <Button
                  onClick={() => router.push("/shop")}
                  className="bg-stone-900 hover:bg-stone-800 h-12 px-8 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Button>
              </div>
            </div>
          ) : (
            // Cart Items - Modern Layout
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Items Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-stone-900">Cart Items</h2>
                  <span className="text-sm text-stone-500">{cartItems.length} {cartItems.length === 1 ? 'product' : 'products'}</span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div
                          onClick={() => router.push(`/shop/${item.productId}`)}
                          className="relative w-24 h-24 sm:w-28 sm:h-28 bg-stone-50 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity group"
                        >
                          <Image
                            src={item.productImageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 96px, 112px"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3
                                onClick={() => router.push(`/shop/${item.productId}`)}
                                className="text-base sm:text-lg font-bold text-stone-900 mb-1 cursor-pointer hover:text-stone-600 transition-colors line-clamp-2"
                              >
                                {item.productName}
                              </h3>
                              <p className="text-xl sm:text-2xl font-bold text-stone-900">
                                {formatPrice(item.productPrice)}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              disabled={deletingItem === item.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0 rounded-full flex-shrink-0"
                            >
                              {deletingItem === item.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                          {/* Quantity Controls & Item Total */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={updatingItem === item.id || item.quantity <= 1}
                                className="h-8 w-8 p-0 hover:bg-white rounded-md"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-10 text-center font-bold text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updatingItem === item.id}
                                className="h-8 w-8 p-0 hover:bg-white rounded-md"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Item Subtotal */}
                            <div className="text-right">
                              <p className="text-xs text-stone-500 mb-0.5">Subtotal</p>
                              <p className="text-lg font-bold text-stone-900">
                                {formatPrice(item.productPrice * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary - Enhanced */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-24 shadow-sm">
                  <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-base">
                      <span className="text-stone-600">Subtotal</span>
                      <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-stone-600">Shipping</span>
                      <span className="font-semibold text-stone-900">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-bold">Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    
                    {/* Free Shipping Progress */}
                    {shipping > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Truck className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-yellow-900 mb-1">
                              Almost there!
                            </p>
                            <p className="text-xs text-yellow-700">
                              Add {formatPrice(5000 - subtotal)} more for free shipping
                            </p>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-yellow-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t border-stone-200 pt-4 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-semibold text-stone-900">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-stone-900">{formatPrice(total)}</p>
                        <p className="text-xs text-stone-500">Tax included</p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={() => toast.info("Checkout feature coming soon!")}
                    className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all mb-4"
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Trust Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Fast delivery within 2-5 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}