"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { ShoppingBag, Grid3x3, User } from "lucide-react"

export default function UserSpacePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

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

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-20">
      {/* Header - White with Drop Shadow (matching landing page) */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-semibold text-sm">T</span>
              </div>
              <span className="text-lg font-semibold text-stone-900 tracking-tight">
                Trovii
              </span>
            </a>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-700 hidden sm:inline">
                {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              Welcome to Your Space! 👋
            </h1>
            <p className="text-stone-600">
              Everything you need for campus life in one place
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Food Delivery Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FFD800] to-[#FFEA32] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🍔</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Food Delivery
              </h3>
              <p className="text-sm text-stone-600">
                Order from your favorite campus restaurants
              </p>
            </div>

            {/* Career Launchpad Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Career Launchpad
              </h3>
              <p className="text-sm text-stone-600">
                Discover gigs, internships, and opportunities
              </p>
            </div>

            {/* Community Hub Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#086BFA] to-[#500099] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Community Hub
              </h3>
              <p className="text-sm text-stone-600">
                Connect with fellow students and join events
              </p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD800] to-[#FFEA32] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎉</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-900">
                    Welcome to Trovii!
                  </p>
                  <p className="text-xs text-stone-500">
                    Start exploring campus services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-50">
        <div className="max-w-md mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Shop/Cart Icon */}
            <button className="flex flex-col items-center justify-center gap-1 group p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <ShoppingBag className="w-6 h-6 text-stone-600 group-hover:text-[#500099] transition-colors" strokeWidth={1.5} />
            </button>

            {/* Grid/Menu Icon */}
            <button className="flex flex-col items-center justify-center gap-1 group p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <Grid3x3 className="w-6 h-6 text-stone-600 group-hover:text-[#500099] transition-colors" strokeWidth={1.5} />
            </button>

            {/* User/Profile Icon */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-1 group p-2 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <User className="w-6 h-6 text-stone-600 group-hover:text-[#500099] transition-colors" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
