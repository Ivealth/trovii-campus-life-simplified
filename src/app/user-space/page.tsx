"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Menu, ShoppingCart, UtensilsCrossed, Briefcase, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const services = [
    {
      icon: UtensilsCrossed,
      title: "Food Delivery",
      description: "Order from your favorite campus restaurants",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      metric: "10min delivery"
    },
    {
      icon: Briefcase,
      title: "Career Launchpad",
      description: "Discover gigs, internships, and opportunities",
      color: "from-stone-900 to-stone-700",
      bgColor: "bg-stone-100",
      metric: "$500+ avg"
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with fellow students and join events",
      color: "from-blue-600 to-indigo-700",
      bgColor: "bg-blue-50",
      metric: "1,200+ members"
    }
  ]

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pb-20">
      {/* Premium Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <span className="text-xl font-bold text-stone-900 tracking-tight">
                Trovii
              </span>
            </a>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-stone-700 hidden sm:inline">
                {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-3 tracking-tight">
              Welcome back, {session.user.name?.split(' ')[0]}
            </h1>
            <p className="text-lg text-stone-600">
              Everything you need for campus life, all in one place
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl border border-stone-200 p-8 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl ${service.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-stone-900" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="inline-flex items-center bg-stone-100 rounded-lg px-3 py-1.5">
                  <span className="text-xs font-semibold text-stone-700">{service.metric}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions Banner */}
          <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl overflow-hidden p-10 md:p-12 mb-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#500099]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#086BFA]/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Start exploring today
              </h3>
              <p className="text-stone-300 mb-6 max-w-2xl">
                Access exclusive student deals, career opportunities, and connect with your campus community.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => router.push("/shop")}
                  className="bg-white text-stone-900 hover:bg-stone-100 font-semibold h-11 px-6 rounded-xl"
                >
                  Browse Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 font-semibold h-11 px-6 rounded-xl"
                >
                  Explore Features
                </Button>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              Recent Activity
            </h2>
            <div className="bg-white rounded-2xl border border-stone-200 p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🎉</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900 mb-1">
                    Welcome to Trovii!
                  </h3>
                  <p className="text-stone-600">
                    Start exploring campus services and exclusive student deals
                  </p>
                </div>
              </div>
            </div>
          </div>
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

            {/* Menu Icon - Active */}
            <button className="flex flex-col items-center justify-center gap-1 py-2 px-4 group active:scale-95 transition-all">
              <div className="relative">
                <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-lg">
                  <Menu className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-stone-900" />
              </div>
              <span className="text-[11px] font-semibold text-stone-900">Menu</span>
            </button>

            {/* Profile Icon */}
            <button 
              onClick={() => router.push("/account")}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 group active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-gradient-to-br group-hover:from-stone-900 group-hover:to-stone-700 flex items-center justify-center transition-all">
                <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-stone-500 group-hover:text-stone-900 group-hover:font-semibold transition-all">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}