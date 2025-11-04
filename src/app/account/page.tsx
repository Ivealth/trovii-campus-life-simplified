"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import { ChevronLeft, Settings, LogOut, ChevronRight, ShoppingBag, LayoutGrid, User } from "lucide-react"

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#500099] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  // Create username from email
  const username = session.user.email?.split('@')[0] || 'user'

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-16">
      {/* Simple Header - More Compact */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <button 
              onClick={() => router.push("/user-space")}
              className="flex items-center justify-center w-8 h-8 -ml-2 text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            <h1 className="text-base font-semibold text-stone-900 absolute left-1/2 -translate-x-1/2">
              My Account
            </h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content - More Compact */}
      <div className="flex-1 px-4 py-4">
        <div className="max-w-md mx-auto space-y-3">
          {/* Profile Card - Smaller */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3">
            {/* Profile Picture - Smaller */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-lg font-bold">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {/* Username */}
            <div className="flex-1">
              <p className="text-base font-semibold text-stone-900">
                @{username}
              </p>
            </div>
          </div>

          {/* Settings Row - Smaller */}
          <button 
            className="bg-white rounded-xl border border-stone-200 p-3.5 flex items-center gap-3 w-full hover:bg-stone-50 transition-colors active:scale-[0.98]"
          >
            <Settings className="w-5 h-5 text-stone-900" strokeWidth={2} />
            <span className="text-sm font-medium text-stone-900 flex-1 text-left">
              Settings
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" strokeWidth={2} />
          </button>

          {/* Log Out Button - Smaller */}
          <button 
            onClick={handleSignOut}
            className="bg-rose-50 rounded-xl border border-rose-100 p-3.5 flex items-center justify-center gap-2 w-full hover:bg-rose-100 transition-colors active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 text-rose-600" strokeWidth={2} />
            <span className="text-sm font-semibold text-rose-600">
              Log Out
            </span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Navigation with Active State */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around h-14">
            {/* Shop Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-3 group active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-stone-400 group-hover:text-[#500099] transition-colors" strokeWidth={2} />
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-[#500099] transition-colors">Shop</span>
            </button>

            {/* Menu/Grid Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-3 group active:scale-95 transition-all"
            >
              <LayoutGrid className="w-5 h-5 text-stone-400 group-hover:text-[#500099] transition-colors" strokeWidth={2} />
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-[#500099] transition-colors">Menu</span>
            </button>

            {/* Profile Icon - Active State */}
            <button className="flex flex-col items-center justify-center gap-1 py-2 px-3 group active:scale-95 transition-all">
              <div className="relative">
                <User className="w-5 h-5 text-[#500099] transition-colors" strokeWidth={2} />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#500099]" />
              </div>
              <span className="text-[10px] font-semibold text-[#500099] transition-colors">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}