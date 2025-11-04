"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#500099"/>
              <path d="M16 8V24M10 14H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[17px] font-semibold text-stone-900 tracking-tight">
              Trovii
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/shop" className="text-[14px] font-medium text-stone-600 hover:text-stone-900 transition-colors">
              Shop
            </a>
            <a href="#features" className="text-[14px] font-medium text-stone-600 hover:text-stone-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-[14px] font-medium text-stone-600 hover:text-stone-900 transition-colors">
              How it works
            </a>
            <a href="#testimonials" className="text-[14px] font-medium text-stone-600 hover:text-stone-900 transition-colors">
              Students
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!isPending && session?.user ? (
              <Button 
                size="sm"
                className="bg-stone-900 hover:bg-stone-800 text-white text-[13px] font-medium h-9 px-4 rounded-lg"
                onClick={() => router.push("/user-space")}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-[13px] font-medium text-stone-600 hover:text-stone-900 h-9"
                  onClick={() => router.push("/register?mode=signin")}
                >
                  Sign in
                </Button>
                <Button 
                  size="sm"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-[13px] font-medium h-9 px-4 rounded-lg"
                  onClick={() => router.push("/register")}
                >
                  Get started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200/50 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-6 space-y-4">
            <a
              href="/shop"
              className="block text-[15px] font-medium text-stone-600 hover:text-stone-900"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </a>
            <a
              href="#features"
              className="block text-[15px] font-medium text-stone-600 hover:text-stone-900"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-[15px] font-medium text-stone-600 hover:text-stone-900"
              onClick={() => setIsOpen(false)}
            >
              How it works
            </a>
            <a
              href="#testimonials"
              className="block text-[15px] font-medium text-stone-600 hover:text-stone-900"
              onClick={() => setIsOpen(false)}
            >
              Students
            </a>
            <div className="pt-4 space-y-2">
              {!isPending && session?.user ? (
                <Button 
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white"
                  onClick={() => {
                    setIsOpen(false)
                    router.push("/user-space")
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false)
                      router.push("/register?mode=signin")
                    }}
                  >
                    Sign in
                  </Button>
                  <Button 
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white"
                    onClick={() => {
                      setIsOpen(false)
                      router.push("/register")
                    }}
                  >
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}