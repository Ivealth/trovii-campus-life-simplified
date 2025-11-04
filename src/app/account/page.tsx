"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import { ChevronLeft, Settings, LogOut, ChevronRight, Menu, ShoppingCart, User } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const { data: session, isPending, refetch } = useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/register?mode=signin")
    }
  }, [session, isPending, router])

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token")

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      toast.success("Signed out successfully")
      router.push("/")
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const username = session.user.email?.split('@')[0] || 'user'

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-20">
      {/* Premium Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push("/user-space")}
              className="flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-lg font-bold text-stone-900">
              Account
            </h1>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-10">
        <div className="max-w-2xl mx-auto px-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-8 mb-6 shadow-sm">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-stone-900 mb-1">
                  {session.user.name}
                </h2>
                <p className="text-stone-600 mb-0.5">
                  @{username}
                </p>
                <p className="text-sm text-stone-500">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Account Options */}
          <div className="space-y-3 mb-8">
            <button 
              className="bg-white rounded-2xl border border-stone-200 p-6 flex items-center gap-4 w-full hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5 transition-all active:scale-[0.98] group"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                <Settings className="w-6 h-6 text-stone-700 group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-stone-900 mb-0.5">
                  Settings
                </h3>
                <p className="text-sm text-stone-500">
                  Manage your account preferences
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-colors" strokeWidth={2} />
            </button>

            <button 
              className="bg-white rounded-2xl border border-stone-200 p-6 flex items-center gap-4 w-full hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5 transition-all active:scale-[0.98] group"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                <User className="w-6 h-6 text-stone-700 group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-stone-900 mb-0.5">
                  Profile
                </h3>
                <p className="text-sm text-stone-500">
                  Edit your personal information
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-colors" strokeWidth={2} />
            </button>
          </div>

          {/* Log Out Button */}
          <button 
            onClick={handleSignOut}
            className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 p-6 flex items-center justify-center gap-3 w-full hover:from-red-100 hover:to-rose-100 hover:border-red-200 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5 text-red-600" strokeWidth={2} />
            <span className="text-base font-semibold text-red-600">
              Log Out
            </span>
          </button>
        </div>
      </div>

      {/* Premium Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-200 shadow-2xl z-50">
        <div className="max-w-md mx-auto px-6">
          <div className="flex items-center justify-around h-16">
            {/* Shop Icon */}
            <button 
              onClick={() => router.push("/shop")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-xl bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-stone-900 group-hover:to-stone-700 flex items-center justify-center transition-all">
                <ShoppingCart className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-stone-900 group-hover:font-semibold transition-all">Shop</span>
            </button>

            {/* Menu Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-xl bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-stone-900 group-hover:to-stone-700 flex items-center justify-center transition-all">
                <Menu className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-stone-900 group-hover:font-semibold transition-all">Menu</span>
            </button>

            {/* Profile Icon - Active */}
            <button className="flex flex-col items-center justify-center gap-1 py-2 px-4 group active:scale-95 transition-all">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-lg">
                  <User className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-stone-900" />
              </div>
              <span className="text-[11px] font-semibold text-stone-900">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}