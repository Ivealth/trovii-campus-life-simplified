"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import BottomNav from "@/components/BottomNav"
import { ArrowRight, Package, Briefcase, Users, TrendingUp } from "lucide-react"

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
          <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const services = [
    {
      title: "Food Delivery",
      description: "Order from campus restaurants and cafes",
      icon: Package,
      href: "/food",
      stats: "15+ restaurants",
      color: "bg-stone-900"
    },
    {
      title: "Career Hub",
      description: "Find gigs, internships, and job opportunities",
      icon: Briefcase,
      href: "/careers",
      stats: "200+ listings",
      color: "bg-stone-900"
    },
    {
      title: "Community",
      description: "Connect with students and join events",
      icon: Users,
      href: "/community",
      stats: "5,000+ students",
      color: "bg-stone-900"
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Simple Header */}
      <div className="border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-stone-600 mt-0.5">
                Welcome back, {session.user.name?.split(' ')[0] || 'there'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
              <div className="text-2xl font-semibold text-stone-900">0</div>
              <div className="text-xs text-stone-600 mt-1">Orders</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
              <div className="text-2xl font-semibold text-stone-900">0</div>
              <div className="text-xs text-stone-600 mt-1">Applications</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
              <div className="text-2xl font-semibold text-stone-900">0</div>
              <div className="text-xs text-stone-600 mt-1">Events</div>
            </div>
          </div>

          {/* Services Grid */}
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Services
            </h2>
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service.title}
                  onClick={() => router.push(service.href)}
                  className="w-full bg-white hover:bg-stone-50 border border-stone-200 rounded-lg p-5 transition-colors group text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${service.color} rounded-lg p-3 transition-transform group-hover:scale-105`}>
                      <service.icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold text-stone-900">
                          {service.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                      </div>
                      <p className="text-sm text-stone-600 mb-2">
                        {service.description}
                      </p>
                      <span className="text-xs text-stone-500">
                        {service.stats}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Recent Activity
            </h2>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-stone-400" strokeWidth={2} />
              </div>
              <p className="text-sm text-stone-600 mb-1">No activity yet</p>
              <p className="text-xs text-stone-500">
                Start using Trovii services to see your activity here
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}