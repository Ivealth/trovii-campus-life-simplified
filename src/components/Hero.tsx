"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD800]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFEA32]/10 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FFD800]/10 to-[#FFEA32]/10 border border-[#FFD800]/20 rounded-full px-3 py-1.5 mb-6"
          >
            <span className="text-[11px] font-medium text-[#FDC500] tracking-wide uppercase">By Ivealth LTD</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[2.5rem] sm:text-5xl md:text-6xl font-bold text-stone-900 mb-5 leading-[1.1] tracking-tight"
          >
            Your campus life,
            <span className="block bg-gradient-to-r from-[#FFD800] to-[#FDC500] bg-clip-text text-transparent">
              simplified
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[15px] text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Food delivery, career opportunities, and community connections—all in one platform. Save time, earn money, and unlock opportunities designed for students.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#FFD800] to-[#FDC500] hover:from-[#FDC500] hover:to-[#FFD800] text-stone-900 font-medium text-[14px] px-6 h-11 rounded-lg shadow-lg shadow-[#FFD800]/25"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-[#FFD800] text-[#FDC500] hover:bg-[#FFD800]/5 font-medium text-[14px] px-6 h-11 rounded-lg"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-[13px] text-stone-500"
          >
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD800]/20 to-[#086BFA]/20 border-2 border-white"
                  />
                ))}
              </div>
              <span className="font-medium text-stone-600">1,200+ students joined</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="flex text-[#FFD800]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium text-stone-600">4.9/5 rating</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image/Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 md:mt-16 relative"
        >
          <div className="relative rounded-xl overflow-hidden shadow-xl shadow-stone-900/10 border border-stone-200 bg-white ring-1 ring-[#FFD800]/5">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&q=80"
              alt="Students using Trovii platform"
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}