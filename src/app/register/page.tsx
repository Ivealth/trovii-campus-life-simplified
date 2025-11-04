"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight } from "lucide-react"
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
        const { error: signInError } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          callbackURL: "/user-space"
        })

        if (signInError) {
          router.push("/register?mode=signin")
        } else {
          router.push("/user-space")
        }
      } else {
        const { error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          callbackURL: "/user-space"
        })

        if (error?.code) {
          toast.error("Invalid email or password. Please make sure you have already registered an account and try again.")
          setIsSubmitting(false)
          return
        }

        router.push("/user-space")
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header */}
      <div className="border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">T</span>
              </div>
              <span className="text-lg font-semibold text-stone-900 tracking-tight">
                Trovii
              </span>
            </button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/")}
              className="text-sm font-medium text-stone-600 hover:text-stone-900"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-stone-900 mb-2 tracking-tight">
                {mode === "signup" ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-sm text-stone-600">
                {mode === "signup"
                  ? "Join thousands of students simplifying campus life"
                  : "Sign in to continue to Trovii"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-900 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    autoComplete="off"
                    className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-stone-400"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-900 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@school.edu"
                  required
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-stone-400"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-900 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-stone-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white h-11 text-sm font-medium mt-6 rounded-lg group transition-colors disabled:opacity-50"
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
            <div className="mt-6 pt-6 border-t border-stone-200 text-center">
              <p className="text-sm text-stone-600">
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="font-medium text-stone-900 hover:underline"
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
                      className="font-medium text-stone-900 hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-stone-500 mt-6">
            By continuing, you agree to Trovii's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}