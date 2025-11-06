"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Package } from "lucide-react"
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
    <div className="min-h-screen bg-stone-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => router.push("/shop")}
              className="flex items-center gap-2 text-stone-900 hover:text-stone-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Continue Shopping</span>
            </button>
            
            <h1 className="text-base sm:text-lg font-bold text-stone-900">Shopping Cart</h1>
            
            <div className="w-16 sm:w-24"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-12 sm:py-20 bg-white rounded-2xl border border-stone-200">
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-stone-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
              <p className="text-sm sm:text-base text-stone-600 mb-4 sm:mb-6">
                Add some products to your cart and they will show up here.
              </p>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-stone-900 hover:bg-stone-800 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
              >
                Start Shopping
              </Button>
            </div>
          </div>
        ) : (
          // Cart Items
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <div className="bg-white rounded-lg border border-stone-200 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
                  <h2 className="text-base sm:text-lg font-semibold text-stone-900">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-stone-50 rounded-lg border border-stone-200"
                    >
                      {/* Product Image */}
                      <div
                        onClick={() => router.push(`/shop/${item.productId}`)}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                      >
                        <Image
                          src={item.productImageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          onClick={() => router.push(`/shop/${item.productId}`)}
                          className="text-xs sm:text-sm md:text-base font-semibold text-stone-900 mb-1 cursor-pointer hover:text-stone-600 transition-colors line-clamp-2"
                        >
                          {item.productName}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-stone-900 mb-2 sm:mb-3">
                          {formatPrice(item.productPrice)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updatingItem === item.id || item.quantity <= 1}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 sm:w-8 text-center font-semibold text-xs sm:text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingItem === item.id}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={deletingItem === item.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 sm:h-8 px-2 sm:px-3"
                          >
                            {deletingItem === item.id ? (
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
                                <span className="hidden sm:inline text-xs">Remove</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-stone-200 p-4 sm:p-6 sticky top-20">
                <h2 className="text-base sm:text-lg font-semibold text-stone-900 mb-3 sm:mb-4">Order Summary</h2>

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-stone-600">Shipping</span>
                    <span className="font-semibold text-stone-900">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] sm:text-xs text-stone-500 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      💡 Add {formatPrice(5000 - subtotal)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-stone-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base font-semibold text-stone-900">Total</span>
                    <span className="text-lg sm:text-xl font-bold text-stone-900">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => toast.info("Checkout feature coming soon!")}
                  className="w-full h-10 sm:h-12 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm sm:text-base"
                >
                  Proceed to Checkout
                </Button>

                <p className="text-[10px] sm:text-xs text-center text-stone-500 mt-3 sm:mt-4">
                  Secure checkout • Safe payments
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}