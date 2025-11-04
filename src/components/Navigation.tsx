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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">T</span>
              </div>
              <span className="text-lg font-semibold text-stone-900 tracking-tight">
                Trovii
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a href="#features" className="px-3 py-2 text-[13px] font-medium text-stone-600 hover:text-[#500099] transition-colors">
              Features
            </a>
            <a href="#testimonials" className="px-3 py-2 text-[13px] font-medium text-stone-600 hover:text-[#500099] transition-colors">
              Testimonials
            </a>
            <div className="w-px h-4 bg-stone-200 mx-2" />
            
            {!isPending && session?.user ? (
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-[#500099] to-[#3D0086] hover:from-[#3D0086] hover:to-[#500099] text-white text-[13px] font-medium h-9 ml-1 shadow-lg shadow-[#500099]/20 gap-1.5"
                onClick={() => router.push("/account")}
              >
                <User className="w-3.5 h-3.5" />
                {session.user.name}
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[13px] font-medium h-9 hover:text-[#500099]"
                  onClick={() => router.push("/register?mode=signin")}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-[#500099] to-[#3D0086] hover:from-[#3D0086] hover:to-[#500099] text-white text-[13px] font-medium h-9 ml-1 shadow-lg shadow-[#500099]/20"
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
              className="p-2 rounded-md hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="px-6 py-4 space-y-3">
            <a
              href="#features"
              className="block py-2 text-sm font-medium text-stone-600 hover:text-[#500099] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-sm font-medium text-stone-600 hover:text-[#500099] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <div className="pt-3 space-y-2">
              {!isPending && session?.user ? (
                <Button 
                  className="w-full bg-gradient-to-r from-[#500099] to-[#3D0086] hover:from-[#3D0086] hover:to-[#500099] text-white text-sm shadow-lg shadow-[#500099]/20 gap-1.5"
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
                    className="w-full text-sm border-[#500099] text-[#500099] hover:bg-[#500099]/5"
                    onClick={() => {
                      setIsOpen(false)
                      router.push("/register?mode=signin")
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#500099] to-[#3D0086] hover:from-[#3D0086] hover:to-[#500099] text-white text-sm shadow-lg shadow-[#500099]/20"
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