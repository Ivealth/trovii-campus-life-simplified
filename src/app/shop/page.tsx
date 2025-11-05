"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import { 
  Search, Heart, Star, ShoppingCart, User, 
  SlidersHorizontal, X, ChevronDown, Home,
  ArrowUpDown, Filter
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

interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  description: string | null
  productCount: number
}

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

export default function ShopPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("featured")
  const [showFilters, setShowFilters] = useState(false)
  
  // API Data States
  const [categories, setCategories] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  
  // Loading States
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  // Auth redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    if (session?.user) {
      fetchCategories()
    }
  }, [session])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=100")
        if (response.ok) {
          const data = await response.json()
          setAllProducts(data.products)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
        toast.error("Failed to load products")
      } finally {
        setLoadingProducts(false)
      }
    }

    if (session?.user) {
      fetchProducts()
    }
  }, [session])

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.categoryName?.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.categoryId === parseInt(selectedCategory)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order (featured)
        break
    }

    return filtered
  }, [allProducts, searchQuery, selectedCategory, sortBy])

  // Add to cart
  const handleAddToCart = async (productId: number, productName: string) => {
    if (!session?.user) {
      toast.error("Please sign in to add items to cart")
      router.push("/register?mode=signin")
      return
    }

    setAddingToCart(productId)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        toast.success(`${productName} added to cart!`)
        setCartCount((prev) => prev + 1)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  // Toggle wishlist
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

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading store...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="container mx-auto px-4 py-4">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-base">T</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold text-foreground block leading-none">Trovii</span>
                <span className="text-[9px] text-muted-foreground leading-none">Shop</span>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="hidden sm:flex"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/account")}
                className="hidden sm:flex"
              >
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => toast.info("Cart page coming soon!")}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-10 h-11"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="h-8"
            >
              All Products
            </Button>
            {!loadingCategories && categories.slice(0, 5).map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id.toString())}
                className="h-8"
              >
                {cat.icon} {cat.name}
              </Button>
            ))}
            {categories.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8"
              >
                <SlidersHorizontal className="w-4 h-4 mr-1" />
                More
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] h-8">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
            {searchQuery && (
              <span> for "<span className="font-semibold text-foreground">{searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <Filter className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSortBy("featured")
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-muted/30">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.badge && (
                      <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                        {product.badge}
                      </div>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        -{calculateDiscount(product.originalPrice, product.price)}%
                      </div>
                    )}
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-card/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-border"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.has(product.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <p className="text-[10px] text-muted-foreground font-medium mb-1 uppercase tracking-wide">
                    {product.categoryName || "Uncategorized"}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-2 leading-tight min-h-[2.5em]">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-2.5">
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product.id, product.name)}
                    disabled={addingToCart === product.id || product.stockQuantity === 0}
                    className="w-full h-8 text-xs"
                  >
                    {addingToCart === product.id ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                        {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}