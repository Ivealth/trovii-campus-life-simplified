"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart, Star, TrendingUp, Zap, Package, Shield } from "lucide-react"
import { motion } from "framer-motion"

type Product = {
  id: number
  name: string
  slug: string
  price: number
  originalPrice: number | null
  categoryName: string
  imageUrl: string
  inStock: boolean
  badge: string | null
  rating: number
  reviewCount: number
  discount_percentage: number | null
}

type Category = {
  id: number
  name: string
  slug: string
  icon: string
  productCount: number
}

export default function Home() {
  const router = useRouter()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products/featured?limit=8"),
          fetch("/api/categories"),
        ])

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setFeaturedProducts(productsData)
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.slice(0, 8))
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price / 100)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white">Campus Marketplace Now Open</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Everything Students Need,
                <span className="text-stone-300"> One Platform</span>
              </h1>

              <p className="text-lg text-stone-300 mb-8 leading-relaxed">
                Shop the best deals on campus essentials. From tech gadgets to fashion, textbooks to accessories—delivered right to your dorm.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/shop")}
                  className="bg-white text-stone-900 hover:bg-stone-100 h-12 px-8 text-base font-semibold rounded-xl group"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/register")}
                  className="border-2 border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-semibold rounded-xl"
                >
                  Create Account
                </Button>
              </div>

              <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold text-white">1,200+</p>
                  <p className="text-sm text-stone-400">Active Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-stone-400">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.9★</p>
                  <p className="text-sm text-stone-400">Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:h-[500px] hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl backdrop-blur-sm" />
              <div className="relative h-full flex items-center justify-center">
                <ShoppingCart className="w-48 h-48 text-white/20" strokeWidth={1} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, label: "Trending Now", desc: "Hot deals daily" },
              { icon: Zap, label: "Fast Delivery", desc: "Same-day shipping" },
              { icon: Package, label: "Free Shipping", desc: "On orders ₦5,000+" },
              { icon: Shield, label: "Secure Payment", desc: "100% protected" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-stone-100 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-stone-900" />
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mb-1">{feature.label}</h3>
                <p className="text-xs text-stone-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-2">Featured Products</h2>
              <p className="text-stone-600">Top picks for students</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/shop")}
              className="hidden sm:flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * idx }}
                  onClick={() => router.push(`/shop/${product.id}`)}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-square bg-white">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-stone-900 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        {product.badge}
                      </div>
                    )}
                    {product.discount_percentage && product.discount_percentage > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{product.discount_percentage}%
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-stone-100">
                    <p className="text-xs text-stone-500 font-medium mb-1 uppercase">
                      {product.categoryName}
                    </p>
                    <h3 className="text-sm font-semibold text-stone-900 mb-2 line-clamp-2 min-h-[2.5em]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating / 10)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-stone-200 text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-stone-900">
                        {(product.rating / 10).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
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
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              onClick={() => router.push("/shop")}
              className="w-full"
            >
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-3">Shop by Category</h2>
            <p className="text-stone-600">Find exactly what you need</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, idx) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.05 * idx }}
                  onClick={() => router.push("/shop")}
                  className="bg-stone-50 rounded-xl p-6 border border-stone-200 hover:border-stone-900 hover:shadow-lg transition-all group text-center"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-stone-500">{category.productCount} items</p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-900 to-stone-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg text-stone-300 mb-8">
              Join 1,200+ students already saving time and money on campus essentials
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="bg-white text-stone-900 hover:bg-stone-100 h-12 px-8 text-base font-semibold rounded-xl"
              >
                Create Free Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/shop")}
                className="border-2 border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-semibold rounded-xl"
              >
                Browse Products
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}