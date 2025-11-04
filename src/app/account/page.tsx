"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import { ChevronRight, Settings, LogOut, User } from "lucide-react"
import BottomNav from "@/components/BottomNav"

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
          <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Header */}
      <div className="border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
            Account
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Section */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-semibold text-stone-900 mb-0.5">
                  {session.user.name}
                </div>
                <div className="text-sm text-stone-600">
                  {session.user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full bg-white hover:bg-stone-50 border border-stone-200 rounded-lg p-4 flex items-center gap-3 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-stone-700" strokeWidth={2} />
                <span className="text-sm font-medium text-stone-900 flex-1 text-left">
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </button>
            ))}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full bg-white hover:bg-stone-50 border border-stone-200 rounded-lg p-4 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-stone-700" strokeWidth={2} />
            <span className="text-sm font-medium text-stone-900">
              Sign Out
            </span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}