"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed, Briefcase, Users } from "lucide-react"

const features = [
  {
    icon: UtensilsCrossed,
    title: "Food Delivery",
    description: "Order from campus restaurants and get meals delivered to your dorm or library.",
    color: "#FFEA32"
  },
  {
    icon: Briefcase,
    title: "Career Launchpad",
    description: "Find gigs, internships, and opportunities tailored for students on your schedule.",
    color: "#500099"
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with students, join clubs, and stay updated on campus events.",
    color: "#086BFA"
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 tracking-tight">
              Everything in one place
            </h2>
            <p className="text-[15px] text-stone-600">
              Essential campus services integrated into a single platform.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full bg-stone-50 border border-stone-200 rounded-lg p-6 hover:border-[#500099]/30 hover:shadow-lg hover:shadow-[#500099]/5 transition-all duration-200">
                {/* Icon */}
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}${feature.color === '#FFEA32' ? '' : '15'}` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color === '#FFEA32' ? '#1c1917' : feature.color }} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-stone-900 mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-16 bg-gradient-to-br from-stone-900 via-[#1c1917] to-[#0f0f0f] rounded-xl p-10 md:p-12 relative overflow-hidden"
        >
          {/* Accent circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#500099]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFEA32]/5 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFEA32] to-[#FFD800] bg-clip-text text-transparent mb-1">
                10+
              </div>
              <div className="text-[13px] text-stone-400 font-medium">
                Hours saved weekly
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#500099] to-[#086BFA] bg-clip-text text-transparent mb-1">
                $500+
              </div>
              <div className="text-[13px] text-stone-400 font-medium">
                Average monthly earnings
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFEA32] to-[#FFD800] bg-clip-text text-transparent mb-1">
                85%
              </div>
              <div className="text-[13px] text-stone-400 font-medium">
                Career placement rate
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}