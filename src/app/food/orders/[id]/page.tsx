"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  CheckCircle, Clock, TruckIcon, MapPin, Phone, 
  ArrowLeft, Package, ChefHat, Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface OrderItem {
  id: number
  menuItemId: number
  quantity: number
  price: number
  menuItem?: {
    id: number
    name: string
    imageUrl: string
    category: string
  }
}

interface Order {
  id: number
  userId: string
  restaurantId: number
  status: string
  totalAmount: number
  deliveryFee: number
  deliveryAddress: string
  specialInstructions: string | null
  estimatedDeliveryTime: string | null
  createdAt: string
  updatedAt: string
  restaurant?: {
    id: number
    name: string
    phone: string
    location: string
    imageUrl: string
  }
  items?: OrderItem[]
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Order Received",
    description: "Your order is being confirmed"
  },
  confirmed: {
    icon: CheckCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Confirmed",
    description: "Restaurant is preparing your order"
  },
  preparing: {
    icon: ChefHat,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    label: "Preparing",
    description: "Your food is being prepared"
  },
  ready: {
    icon: Package,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Ready for Pickup",
    description: "Your order is ready for delivery"
  },
  "out-for-delivery": {
    icon: TruckIcon,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    label: "Out for Delivery",
    description: "Your order is on the way"
  },
  delivered: {
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Delivered",
    description: "Your order has been delivered"
  },
  cancelled: {
    icon: Clock,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Cancelled",
    description: "This order was cancelled"
  }
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id as string
  const { data: session, isPending } = useSession()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("bearer_token")
        const response = await fetch(`/api/food-orders/${orderId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setOrder(data.order)
        } else {
          toast.error("Order not found")
          router.push("/food/orders")
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
        toast.error("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user && orderId) {
      fetchOrder()
    }
  }, [session, orderId, router])

  const handleCancelOrder = async () => {
    if (!order) return

    // Only allow cancellation for pending/confirmed orders
    if (!["pending", "confirmed"].includes(order.status)) {
      toast.error("This order cannot be cancelled")
      return
    }

    setCancelling(true)

    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch(`/api/food-orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success("Order cancelled successfully")
        setOrder(prev => prev ? { ...prev, status: "cancelled" } : null)
      } else {
        throw new Error("Failed to cancel order")
      }
    } catch (error) {
      console.error("Cancel error:", error)
      toast.error("Failed to cancel order")
    } finally {
      setCancelling(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || !order) return null

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = currentStatus.icon
  const subtotal = order.totalAmount - order.deliveryFee

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/food/orders")}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-stone-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-900 leading-none">Order #{order.id}</span>
                <span className="text-[10px] text-stone-500 leading-none">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/food")}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              Order Again
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 max-w-2xl">
        {/* Success Banner */}
        {order.status !== "cancelled" && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 mb-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Order Confirmed!</h2>
                <p className="text-sm text-white/90">Thank you for your order</p>
              </div>
            </div>
            {order.estimatedDeliveryTime && (
              <p className="text-sm mt-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Clock className="w-4 h-4 inline mr-1.5" />
                Estimated delivery: <span className="font-semibold">{order.estimatedDeliveryTime}</span>
              </p>
            )}
          </div>
        )}

        {/* Cancelled Banner */}
        {order.status === "cancelled" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900">Order Cancelled</h2>
                <p className="text-sm text-red-700">This order has been cancelled</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Card */}
        <div className={`${currentStatus.bgColor} border ${currentStatus.borderColor} rounded-xl p-5 mb-6`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 ${currentStatus.bgColor} rounded-full flex items-center justify-center border-2 ${currentStatus.borderColor}`}>
              <StatusIcon className={`w-5 h-5 ${currentStatus.color}`} />
            </div>
            <div>
              <h3 className={`text-base font-bold ${currentStatus.color}`}>{currentStatus.label}</h3>
              <p className="text-xs text-stone-600">{currentStatus.description}</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mt-4 space-y-2">
            {Object.entries(statusConfig).map(([key, config], index) => {
              const Icon = config.icon
              const isActive = key === order.status
              const isPast = Object.keys(statusConfig).indexOf(key) < Object.keys(statusConfig).indexOf(order.status)
              
              if (key === "cancelled") return null

              return (
                <div key={key} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    isActive ? config.borderColor + " " + config.bgColor : 
                    isPast ? "bg-green-500 border-green-500" : 
                    "bg-stone-100 border-stone-200"
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${
                      isActive ? config.color : 
                      isPast ? "text-white" : 
                      "text-stone-400"
                    }`} />
                  </div>
                  <span className={`text-xs ${
                    isActive ? "font-semibold text-stone-900" : 
                    isPast ? "text-stone-600" : 
                    "text-stone-400"
                  }`}>
                    {config.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Restaurant Info */}
        {order.restaurant && (
          <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
            <h3 className="text-sm font-bold text-stone-900 mb-3">Restaurant Details</h3>
            <div className="flex gap-3">
              <div className="relative w-16 h-16 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={order.restaurant.imageUrl}
                  alt={order.restaurant.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-stone-900 mb-1">{order.restaurant.name}</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">{order.restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{order.restaurant.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
          <h3 className="text-sm font-bold text-stone-900 mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.menuItem && (
                  <>
                    <div className="relative w-14 h-14 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                            {item.menuItem.name}
                          </h4>
                          <p className="text-xs text-stone-500">{item.menuItem.category}</p>
                        </div>
                        <span className="text-sm font-bold text-stone-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-stone-600">Qty: {item.quantity}</span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-600">{formatPrice(item.price)} each</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
          <h3 className="text-sm font-bold text-stone-900 mb-2">Delivery Address</h3>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-stone-700">{order.deliveryAddress}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
          <h3 className="text-sm font-bold text-stone-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Delivery Fee</span>
              <span className="font-semibold text-stone-900">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between text-base pt-2 border-t">
              <span className="font-bold text-stone-900">Total</span>
              <span className="font-bold text-stone-900">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Special Instructions</h3>
            <p className="text-sm text-blue-700">{order.specialInstructions}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {["pending", "confirmed"].includes(order.status) && (
            <Button
              onClick={handleCancelOrder}
              disabled={cancelling}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 h-11"
            >
              {cancelling ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                "Cancel Order"
              )}
            </Button>
          )}

          <Button
            onClick={() => router.push("/food/orders")}
            variant="outline"
            className="w-full h-11"
          >
            View All Orders
          </Button>

          <Button
            onClick={() => router.push("/food")}
            className="w-full bg-orange-500 hover:bg-orange-600 h-11"
          >
            Order More Food
          </Button>
        </div>
      </main>
    </div>
  )
}
