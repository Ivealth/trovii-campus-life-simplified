"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, Share2 } from "lucide-react"
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

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, isPending } = useSession()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          toast.error("Product not found")
          router.push("/shop")
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast.error("Failed to load product")
        router.push("/shop")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user && params.id) {
      fetchProduct()
    }
  }, [session, params.id, router])

  const handleAddToCart = async () => {
    if (!session?.user || !product) return

    setAddingToCart(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      })

      if (response.ok) {
        toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
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

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600 font-medium">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || !product) return null

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
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <button
              onClick={() => toast.info("Share feature coming soon!")}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5 text-stone-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="relative aspect-square bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="bg-yellow-400 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-lg">
                    {product.badge}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                    -{calculateDiscount(product.originalPrice, product.price)}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => {
                  setWishlist(!wishlist)
                  toast.success(wishlist ? "Removed from wishlist" : "Added to wishlist")
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-5 h-5 ${wishlist ? "fill-red-500 text-red-500" : "text-stone-600"}`}
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <p className="text-sm text-stone-500 font-medium uppercase tracking-wider">
              {product.categoryName || "Uncategorized"}
            </p>

            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-stone-200 text-stone-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-stone-900">{product.rating}</span>
                <span className="text-sm text-stone-500">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-stone-100 rounded-xl p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg sm:text-xl text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-green-600 font-medium mt-2">
                  You save {formatPrice(product.originalPrice - product.price)} ({calculateDiscount(product.originalPrice, product.price)}% off)
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">Product Description</h2>
                <p className="text-stone-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div>
              <h2 className="text-lg font-semibold text-stone-900 mb-3">Specifications</h2>
              <div className="space-y-2 bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-sm font-medium text-stone-600">Product ID</span>
                  <span className="text-sm font-semibold text-stone-900">#{product.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-sm font-medium text-stone-600">Category</span>
                  <span className="text-sm font-semibold text-stone-900">{product.categoryName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-sm font-medium text-stone-600">Availability</span>
                  <span className={`text-sm font-semibold ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-stone-600">SKU</span>
                  <span className="text-sm font-semibold text-stone-900">{product.slug}</span>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-stone-900">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    disabled={quantity >= product.stockQuantity}
                    className="h-10 w-10 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stockQuantity === 0}
                className="w-full h-14 text-base font-semibold bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300"
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : product.stockQuantity === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart • {formatPrice(product.price * quantity)}
                  </>
                )}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-200">
                <Truck className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">Free Delivery</p>
                  <p className="text-xs text-stone-500 mt-0.5">On orders over ₦5,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-200">
                <Shield className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">Secure Payment</p>
                  <p className="text-xs text-stone-500 mt-0.5">100% protected</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-200">
                <RefreshCw className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">Easy Returns</p>
                  <p className="text-xs text-stone-500 mt-0.5">Within 7 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}