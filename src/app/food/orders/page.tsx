"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  Clock, TruckIcon, CheckCircle, Package, ChefHat, 
  Home, ArrowLeft, User, ShoppingBag, X, Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrderItem {
  id: number
  menuItemId: number
  quantity: number
  price: number
  menuItem?: {
    id: number
    name: string
    imageUrl: string
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
  estimatedDeliveryTime: string | null
  createdAt: string
  restaurant?: {
    id: number
    name: string
    imageUrl: string
    cuisine: string
  }
  items?: OrderItem[]
}

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-blue-600", bgColor: "bg-blue-50", label: "Confirmed" },
  preparing: { icon: ChefHat, color: "text-purple-600", bgColor: "bg-purple-50", label: "Preparing" },
  ready: { icon: Package, color: "text-orange-600", bgColor: "bg-orange-50", label: "Ready" },
  "out-for-delivery": { icon: TruckIcon, color: "text-indigo-600", bgColor: "bg-indigo-50", label: "Out for Delivery" },
  delivered: { icon: Home, color: "text-green-600", bgColor: "bg-green-50", label: "Delivered" },
  cancelled: { icon: X, color: "text-red-600", bgColor: "bg-red-50", label: "Cancelled" }
}

export default function OrdersPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  // States
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("bearer_token")
        const response = await fetch("/api/food-orders?limit=50", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
        toast.error("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchOrders()
    }
  }, [session])

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders
    return orders.filter(order => order.status === statusFilter)
  }, [orders, statusFilter])

  // Categorize orders
  const activeOrders = useMemo(() => {
    return filteredOrders.filter(order => 
      !["delivered", "cancelled"].includes(order.status)
    )
  }, [filteredOrders])

  const pastOrders = useMemo(() => {
    return filteredOrders.filter(order => 
      ["delivered", "cancelled"].includes(order.status)
    )
  }, [filteredOrders])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const OrderCard = ({ order }: { order: Order }) => {
    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
    const StatusIcon = status.icon
    const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

    return (
      <div
        onClick={() => router.push(`/food/orders/${order.id}`)}
        className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer"
      >
        {/* Order Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900">Order #{order.id}</span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">{formatDate(order.createdAt)}</span>
          </div>
          <div className={`${status.bgColor} ${status.color} px-2.5 py-1 rounded-full flex items-center gap-1.5`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{status.label}</span>
          </div>
        </div>

        {/* Restaurant Info */}
        {order.restaurant && (
          <div className="flex gap-3 mb-3 pb-3 border-b border-stone-100">
            <div className="relative w-12 h-12 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={order.restaurant.imageUrl}
                alt={order.restaurant.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 mb-0.5">
                {order.restaurant.name}
              </h3>
              <p className="text-xs text-stone-500">{order.restaurant.cuisine}</p>
              <p className="text-xs text-stone-600 mt-0.5">
                {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        )}

        {/* Order Items Preview */}
        {order.items && order.items.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-2 mb-2">
              {order.items.slice(0, 3).map((item) => (
                item.menuItem && (
                  <div key={item.id} className="relative w-14 h-14 bg-stone-50 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">x{item.quantity}</span>
                    </div>
                  </div>
                )
              ))}
              {order.items.length > 3 && (
                <div className="w-14 h-14 bg-stone-100 rounded-md flex items-center justify-center">
                  <span className="text-xs font-semibold text-stone-600">+{order.items.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex flex-col">
            <span className="text-xs text-stone-500">Total Amount</span>
            <span className="text-base font-bold text-stone-900">{formatPrice(order.totalAmount)}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/food/orders/${order.id}`)
            }}
          >
            View Details
          </Button>
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDeliveryTime && !["delivered", "cancelled"].includes(order.status) && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Est. delivery: {order.estimatedDeliveryTime}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
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
                <span className="text-base font-bold text-stone-900 leading-none tracking-tight">My Orders</span>
                <span className="text-[10px] text-stone-500 leading-none tracking-wide">Order History</span>
              </div>
            </div>

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
      </header>

      <main className="container mx-auto px-4 pt-[72px] pb-6 max-w-3xl">
        {/* Filter Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 border-stone-300 text-xs sm:text-sm">
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-stone-600 ml-auto">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-stone-200 p-4 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-stone-100 rounded w-24"></div>
                  <div className="h-6 bg-stone-100 rounded w-20"></div>
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 bg-stone-100 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-stone-100 rounded w-3/4"></div>
                    <div className="h-3 bg-stone-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-stone-200">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">No orders yet</h3>
              <p className="text-stone-600 mb-6">
                Start exploring restaurants and place your first order!
              </p>
              <Button
                onClick={() => router.push("/food")}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Browse Restaurants
              </Button>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-stone-200">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-10 h-10 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">No orders found</h3>
              <p className="text-stone-600 mb-6">
                No orders match the selected filter.
              </p>
              <Button
                onClick={() => setStatusFilter("all")}
                variant="outline"
              >
                Clear Filter
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-orange-500" />
                  Active Orders
                  <span className="text-sm font-normal text-stone-500">({activeOrders.length})</span>
                </h2>
                <div className="space-y-3">
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-stone-400" />
                  Past Orders
                  <span className="text-sm font-normal text-stone-500">({pastOrders.length})</span>
                </h2>
                <div className="space-y-3">
                  {pastOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around h-14">
            <button 
              onClick={() => router.push("/food")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 1.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-orange-500 group-hover:font-semibold transition-all">Restaurants</span>
            </button>

            <button 
              onClick={() => router.push("/food/orders")}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-orange-500" strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-semibold text-orange-500">Orders</span>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
            </button>

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
