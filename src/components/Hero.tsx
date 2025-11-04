"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-stone-50/30 to-white">
      {/* Sophisticated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-[#500099]/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[5%] w-[500px] h-[500px] bg-gradient-to-tr from-[#086BFA]/5 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white border border-stone-200 shadow-sm rounded-full px-4 py-2 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#500099] animate-pulse" />
            <span className="text-xs font-medium text-stone-700 tracking-wide">Powered by Ivealth LTD</span>
          </motion.div>

          {/* Main Headline - More sophisticated */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[3rem] sm:text-6xl md:text-7xl font-bold text-stone-900 mb-6 leading-[1.05] tracking-[-0.02em]"
          >
            The modern way to
            <span className="block mt-2 bg-gradient-to-r from-[#500099] via-[#3D0086] to-[#086BFA] bg-clip-text text-transparent">
              navigate campus life
            </span>
          </motion.h1>

          {/* Refined Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Streamline your student experience with integrated food delivery, career opportunities, and community connections—designed exclusively for ambitious students.
          </motion.p>

          {/* Refined CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-medium px-8 h-12 rounded-xl shadow-lg shadow-stone-900/25 transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-700 font-medium px-8 h-12 rounded-xl transition-all"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Sophisticated Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-stone-600"
          >
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 border-2 border-white shadow-sm"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="font-semibold text-stone-900">1,200+</div>
                <div className="text-xs text-stone-500">students joined</div>
              </div>
            </div>
            <div className="h-8 w-px bg-stone-200 hidden sm:block" />
            <div className="flex items-center space-x-2">
              <div className="flex text-[#FFD800]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <div className="text-left">
                <div className="font-semibold text-stone-900">4.9/5</div>
                <div className="text-xs text-stone-500">average rating</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-200 bg-white">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#500099]/5 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=700&fit=crop&q=90"
              alt="Students collaborating on Trovii platform"
              className="w-full h-auto"
            />
          </div>
          {/* Floating accent elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#FFD800] to-[#FFEA32] rounded-2xl opacity-20 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#500099] to-[#086BFA] rounded-2xl opacity-20 blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}