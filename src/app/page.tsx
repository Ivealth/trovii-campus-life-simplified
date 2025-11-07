"use client"

import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Testimonials from "@/components/Testimonials"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />

      {/* Fixed Bottom Navigation */}
      {session?.user && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] z-50">
          <div className="max-w-md mx-auto px-4">
            <div className="flex items-center justify-around h-14">
              {/* Shop Icon */}
              <button 
                onClick={() => router.push("/shop")}
                className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-stone-400 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-stone-400 group-hover:text-yellow-400 group-hover:font-semibold transition-all">Shop</span>
              </button>

              {/* Menu Icon */}
              <button 
                onClick={() => router.push("/user-space")}
                className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-stone-400 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-stone-400 group-hover:text-yellow-400 group-hover:font-semibold transition-all">Menu</span>
              </button>

              {/* Profile Icon */}
              <button 
                onClick={() => router.push("/account")}
                className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 group relative"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-stone-400 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-stone-400 group-hover:text-yellow-400 group-hover:font-semibold transition-all">Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}