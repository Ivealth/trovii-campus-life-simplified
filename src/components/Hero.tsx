"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full mb-6 sm:mb-8"
          >
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[12px] sm:text-[13px] font-medium text-stone-700">Now available on campus</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 mb-4 sm:mb-6 leading-[1.1] sm:leading-[1.05] tracking-tight"
          >
            Campus life,{" "}
            <span className="text-stone-400">simplified</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[15px] sm:text-[17px] text-stone-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            The all-in-one platform for students. Order food, find gigs, and connect with your community—designed to save you time and help you earn.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 sm:mb-12"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-medium text-[13px] sm:text-[14px] px-6 sm:px-7 h-11 sm:h-12 rounded-lg group"
            >
              Get started free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-stone-300 text-stone-700 hover:bg-stone-50 font-medium text-[13px] sm:text-[14px] px-6 sm:px-7 h-11 sm:h-12 rounded-lg group"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-[13px] sm:text-[14px] text-stone-500"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-200 border-2 border-white"
                  />
                ))}
              </div>
              <span>1,200+ students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex text-stone-900">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span>4.9 from 340 reviews</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 relative px-4 sm:px-0"
        >
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 shadow-xl sm:shadow-2xl shadow-stone-900/10">
            <div className="aspect-[16/10] bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-stone-300 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4" />
                <p className="text-[12px] sm:text-[13px] text-stone-500 font-medium">App Preview</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}