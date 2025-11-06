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
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Food Delivery Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFD800] to-[#FDC500] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-stone-900 mb-1.5">
                Food Delivery
              </h3>
              <p className="text-xs text-stone-600 leading-snug">
                Order from campus restaurants
              </p>
            </div>

            {/* Career Launchpad Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-stone-900 mb-1.5">
                Career Hub
              </h3>
              <p className="text-xs text-stone-600 leading-snug">
                Gigs & internships
              </p>
            </div>

            {/* Community Hub Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#086BFA] to-[#500099] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-stone-900 mb-1.5">
                Community
              </h3>
              <p className="text-xs text-stone-600 leading-snug">
                Connect with students
              </p>
            </div>

            {/* Campus Events Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFEA32] to-[#FFD800] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-stone-900 mb-1.5">
                Campus Events
              </h3>
              <p className="text-xs text-stone-600 leading-snug">
                Join exciting activities
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

      {/* Clean Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {/* Shop Icon */}
            <button 
              onClick={() => router.push("/shop")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-[#500099] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-[#500099] group-hover:font-semibold transition-all">Shop</span>
            </button>

            {/* Menu Icon - Active */}
            <button className="flex flex-col items-center justify-center gap-1 py-2 px-4 group relative">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#500099]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-[#500099]">Menu</span>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#500099]" />
            </button>

            {/* Profile Icon */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group relative"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400 group-hover:text-[#500099] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-[#500099] group-hover:font-semibold transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}