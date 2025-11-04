"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

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
    <div className="min-h-screen bg-stone-50 flex flex-col pb-16">
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

      {/* Premium Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-md mx-auto px-6">
          <div className="flex items-center justify-around h-16">
            {/* Shop Icon - Stylish Logo Design */}
            <button 
              onClick={() => router.push("/shop")}
              className="flex flex-col items-center justify-center gap-1.5 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="relative">
                <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-[#500099] group-hover:to-[#3D0086] flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-[#500099]/20">
                  <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-[#500099] group-hover:font-semibold transition-all">Shop</span>
            </button>

            {/* Menu Icon - Active with Modern Logo */}
            <button className="flex flex-col items-center justify-center gap-1.5 py-2 px-4 group active:scale-95 transition-all">
              <div className="relative">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center shadow-lg shadow-[#500099]/20">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#500099]" />
              </div>
              <span className="text-[11px] font-semibold text-[#500099]">Menu</span>
            </button>

            {/* Profile Icon - Elegant Logo */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-1.5 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-[#500099] group-hover:to-[#3D0086] flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-[#500099]/20">
                  <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-[#500099] group-hover:font-semibold transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}