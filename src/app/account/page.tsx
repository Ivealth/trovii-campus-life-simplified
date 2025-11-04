"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import { ChevronLeft, Settings, LogOut, ChevronRight } from "lucide-react"

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
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Simple Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button 
              onClick={() => router.push("/user-space")}
              className="flex items-center justify-center w-10 h-10 -ml-2 text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <h1 className="text-lg font-semibold text-stone-900 absolute left-1/2 -translate-x-1/2">
              My Account
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4">
            {/* Profile Picture */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white text-2xl font-bold">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {/* Username */}
            <div className="flex-1">
              <p className="text-lg font-semibold text-stone-900">
                @{username}
              </p>
            </div>
          </div>

          {/* Settings Row */}
          <button 
            className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4 w-full hover:bg-stone-50 transition-colors active:scale-[0.98]"
          >
            <Settings className="w-6 h-6 text-stone-900" strokeWidth={2} />
            <span className="text-base font-medium text-stone-900 flex-1 text-left">
              Settings
            </span>
            <ChevronRight className="w-5 h-5 text-stone-400" strokeWidth={2} />
          </button>

          {/* Log Out Button */}
          <button 
            onClick={handleSignOut}
            className="bg-rose-50 rounded-2xl border border-rose-100 p-5 flex items-center justify-center gap-2.5 w-full hover:bg-rose-100 transition-colors active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5 text-rose-600" strokeWidth={2} />
            <span className="text-base font-semibold text-rose-600">
              Log Out
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}