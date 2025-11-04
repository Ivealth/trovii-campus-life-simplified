"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - More refined */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <span className="text-xl font-bold text-stone-900 tracking-tight">
                Trovii
              </span>
            </a>
          </div>

          {/* Desktop Navigation - More sophisticated */}
          <div className="hidden md:flex items-center space-x-2">
            <a href="#features" className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors rounded-lg hover:bg-stone-50">
              Features
            </a>
            <a href="#testimonials" className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors rounded-lg hover:bg-stone-50">
              Testimonials
            </a>
            <div className="w-px h-5 bg-stone-200 mx-2" />
            
            {!isPending && session?.user ? (
              <Button 
                size="sm" 
                className="bg-stone-900 hover:bg-stone-800 text-white font-medium h-10 ml-2 shadow-sm gap-2 rounded-lg"
                onClick={() => router.push("/account")}
              >
                <User className="w-4 h-4" />
                {session.user.name}
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium h-10 hover:bg-stone-50 rounded-lg"
                  onClick={() => router.push("/register?mode=signin")}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="bg-stone-900 hover:bg-stone-800 text-white font-medium h-10 ml-2 shadow-sm rounded-lg"
                  onClick={() => router.push("/register")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white shadow-lg">
          <div className="px-6 py-5 space-y-4">
            <a
              href="#features"
              className="block py-2.5 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block py-2.5 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <div className="pt-2 space-y-3">
              {!isPending && session?.user ? (
                <Button 
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white shadow-sm gap-2 h-11 rounded-lg"
                  onClick={() => {
                    setIsOpen(false)
                    router.push("/account")
                  }}
                >
                  <User className="w-4 h-4" />
                  {session.user.name}
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full border-stone-300 hover:bg-stone-50 h-11 rounded-lg"
                    onClick={() => {
                      setIsOpen(false)
                      router.push("/register?mode=signin")
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white shadow-sm h-11 rounded-lg"
                    onClick={() => {
                      setIsOpen(false)
                      router.push("/register")
                    }}
                  >
                    Get Started
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