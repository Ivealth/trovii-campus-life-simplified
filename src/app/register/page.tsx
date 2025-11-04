"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<"signup" | "signin">("signup")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam === "signin") {
      setMode("signin")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({
          email: formData.email,
          name: formData.name,
          password: formData.password
        })

        if (error?.code) {
          const errorMap: Record<string, string> = {
            USER_ALREADY_EXISTS: "Email already registered. Please sign in instead."
          }
          toast.error(errorMap[error.code] || "Registration failed. Please try again.")
          setIsSubmitting(false)
          return
        }

        toast.success("Account created successfully!")
        // Auto sign in after registration
        const { error: signInError } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          callbackURL: "/account"
        })

        if (signInError) {
          router.push("/register?mode=signin")
        } else {
          router.push("/account")
        }
      } else {
        const { error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          callbackURL: "/account"
        })

        if (error?.code) {
          toast.error("Invalid email or password. Please make sure you have already registered an account and try again.")
          setIsSubmitting(false)
          return
        }

        router.push("/account")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header - White with Drop Shadow (matching landing page) */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-semibold text-sm">T</span>
              </div>
              <span className="text-lg font-semibold text-stone-900 tracking-tight">
                Trovii
              </span>
            </a>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/")}
              className="text-[13px] font-medium h-9 text-stone-600 hover:text-[#500099]"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[440px]">
          {/* Card with Yellow Shadow */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-[0_8px_30px_rgb(255,234,50,0.25)] overflow-hidden">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-[#500099] via-[#3D0086] to-[#500099] px-8 pt-8 pb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFEA32]/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFEA32]" />
                  <span className="text-[11px] font-medium text-white/90">Welcome to Trovii</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mb-2">
                  {mode === "signup" ? "Create your account" : "Welcome back"}
                </h1>
                <p className="text-[13px] text-purple-100">
                  {mode === "signup"
                    ? "Join thousands of students simplifying campus life"
                    : "Sign in to continue your journey"}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
              {mode === "signup" && (
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={focusedField === "name" ? "John Doe" : ""}
                    required
                    className="peer w-full h-12 px-4 text-[14px] text-stone-900 bg-white border border-stone-300 rounded-lg focus:border-[#500099] focus:outline-none focus:ring-2 focus:ring-[#500099]/20 transition-all placeholder:text-stone-400 placeholder:text-[13px]"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-stone-600 bg-white px-1 transition-all duration-200 pointer-events-none
                    peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-[#500099] peer-focus:font-medium
                    peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-stone-700 peer-[:not(:placeholder-shown)]:font-medium"
                  >
                    Full Name
                  </label>
                </div>
              )}

              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder={focusedField === "email" ? "you@school.edu" : ""}
                  required
                  autoComplete="off"
                  className="peer w-full h-12 px-4 text-[14px] text-stone-900 bg-white border border-stone-300 rounded-lg focus:border-[#500099] focus:outline-none focus:ring-2 focus:ring-[#500099]/20 transition-all placeholder:text-stone-400 placeholder:text-[13px]"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-stone-600 bg-white px-1 transition-all duration-200 pointer-events-none
                  peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-[#500099] peer-focus:font-medium
                  peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-stone-700 peer-[:not(:placeholder-shown)]:font-medium"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder={focusedField === "password" ? "At least 6 characters" : ""}
                  required
                  minLength={6}
                  autoComplete="off"
                  className="peer w-full h-12 px-4 text-[14px] text-stone-900 bg-white border border-stone-300 rounded-lg focus:border-[#500099] focus:outline-none focus:ring-2 focus:ring-[#500099]/20 transition-all placeholder:text-stone-400 placeholder:text-[13px]"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-stone-600 bg-white px-1 transition-all duration-200 pointer-events-none
                  peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-[#500099] peer-focus:font-medium
                  peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-stone-700 peer-[:not(:placeholder-shown)]:font-medium"
                >
                  Password
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#500099] to-[#3D0086] hover:from-[#3D0086] hover:to-[#500099] text-white h-12 text-[14px] font-semibold mt-6 rounded-lg shadow-lg shadow-[#500099]/20 group transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Please wait..."
                ) : (
                  <>
                    {mode === "signup" ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="px-8 pb-8 pt-2">
              <div className="text-center pt-4 border-t border-stone-100">
                <p className="text-[13px] text-stone-600">
                  {mode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signin")}
                        className="text-[#500099] font-semibold hover:text-[#3D0086] transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-[#500099] font-semibold hover:text-[#3D0086] transition-colors"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-center text-[11px] text-stone-500 mt-6 px-4">
            By continuing, you agree to Trovii's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}