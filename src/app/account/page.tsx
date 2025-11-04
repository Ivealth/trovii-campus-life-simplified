"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { LogOut, Mail, User, Calendar, Shield, ArrowLeft } from "lucide-react"

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

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header with Back Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push("/user-space")}
                className="flex items-center gap-2 text-stone-600 hover:text-[#500099] transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back to Space</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-600 hidden sm:inline">
                {session.user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-xs font-medium h-8 text-stone-600 hover:text-[#500099] hover:bg-stone-50 gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              Welcome back, {session.user.name}! 👋
            </h1>
            <p className="text-stone-600">
              Manage your account details and preferences
            </p>
          </div>

          {/* Account Details Card */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-[0_8px_30px_rgb(255,234,50,0.15)] overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#500099] to-[#3D0086] px-6 py-5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Information
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                Your personal details stored securely
              </p>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-6">
              {/* Full Name */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#500099]/20">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <p className="text-lg font-semibold text-stone-900 mt-1">
                    {session.user.name}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD800] to-[#FFEA32] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FFD800]/20">
                  <Mail className="w-5 h-5 text-stone-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="text-lg font-semibold text-stone-900 mt-1 break-all">
                    {session.user.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {session.user.emailVerified ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs text-amber-600 font-medium">
                          Unverified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#086BFA] to-[#500099] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#086BFA]/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    User ID
                  </label>
                  <p className="text-sm font-mono text-stone-700 mt-1 break-all bg-stone-50 px-3 py-2 rounded border border-stone-200">
                    {session.user.id}
                  </p>
                </div>
              </div>

              {/* Account Created */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 border border-stone-200">
                  <Calendar className="w-5 h-5 text-stone-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Account Created
                  </label>
                  <p className="text-lg font-semibold text-stone-900 mt-1">
                    {formatDate(session.user.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100">
              <p className="text-xs text-stone-500">
                Last updated: {formatDate(session.user.updatedAt)}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🍔</div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">
                Food Delivery
              </h3>
              <p className="text-xs text-stone-600">
                Order from campus restaurants
              </p>
            </div>
            <div className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">
                Career Hub
              </h3>
              <p className="text-xs text-stone-600">
                Find gigs and internships
              </p>
            </div>
            <div className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">
                Community
              </h3>
              <p className="text-xs text-stone-600">
                Connect with students
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}