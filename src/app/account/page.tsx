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
    <div className="min-h-screen bg-stone-50 flex flex-col pb-24">
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

      {/* Modern Premium Bottom Navigation with Yellow Accents */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-stone-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4">
          <div className="flex items-center justify-around h-16">
            {/* Shop Icon */}
            <button 
              onClick={() => router.push("/marketplace")}
              className="relative flex flex-col items-center justify-center w-16 h-16 group active:scale-95 transition-all"
            >
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <ShoppingBag className="w-6 h-6 text-stone-400 group-hover:text-[#FFD800] transition-colors" strokeWidth={2} />
                <span className="text-[9px] font-medium text-stone-400 group-hover:text-[#FFD800] transition-colors tracking-wide">SHOP</span>
              </div>
            </button>

            {/* Menu Icon */}
            <button 
              onClick={() => router.push("/user-space")}
              className="relative flex flex-col items-center justify-center w-16 h-16 group active:scale-95 transition-all"
            >
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <LayoutGrid className="w-6 h-6 text-stone-400 group-hover:text-[#FFD800] transition-colors" strokeWidth={2} />
                <span className="text-[9px] font-medium text-stone-400 group-hover:text-[#FFD800] transition-colors tracking-wide">MENU</span>
              </div>
            </button>

            {/* Profile Icon - Active with Yellow */}
            <button className="relative flex flex-col items-center justify-center w-16 h-16 group active:scale-95 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD800] to-[#FDC500] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#FFD800] rounded-xl blur-md opacity-40" />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD800] to-[#FDC500] flex items-center justify-center shadow-lg shadow-[#FFD800]/30">
                    <User className="w-5 h-5 text-stone-900" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#FFD800] tracking-wide">PROFILE</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}