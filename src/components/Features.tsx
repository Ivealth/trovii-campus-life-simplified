"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed, Briefcase, Users, TrendingUp, Clock, DollarSign } from "lucide-react"

const features = [
  {
    icon: UtensilsCrossed,
    title: "Food Delivery",
    description: "Order from campus restaurants with real-time tracking and flexible payment options.",
    metric: "10min avg delivery"
  },
  {
    icon: Briefcase,
    title: "Career Launchpad",
    description: "Access curated gigs, internships, and career opportunities that fit your schedule.",
    metric: "$500+ avg earnings"
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with peers, discover events, and build meaningful relationships on campus.",
    metric: "1,200+ members"
  }
]

const benefits = [
  { icon: Clock, label: "Save Time", value: "10+ hours weekly" },
  { icon: DollarSign, label: "Earn More", value: "$500+ monthly" },
  { icon: TrendingUp, label: "Grow Faster", value: "85% placement" }
]

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(80,0,153,0.03),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header - More sophisticated */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <span className="text-xs font-semibold text-[#500099] tracking-wider uppercase">Platform Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 tracking-tight leading-tight">
              Everything you need,<br />all in one place
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              A comprehensive platform designed to simplify and enhance every aspect of your campus experience.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards - More refined */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative h-full bg-stone-50 border border-stone-200 rounded-2xl p-8 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-white border border-stone-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#500099]/20 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-stone-900" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-stone-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                {/* Metric badge */}
                <div className="inline-flex items-center bg-white border border-stone-200 rounded-lg px-3 py-1.5">
                  <span className="text-xs font-semibold text-stone-700">{feature.metric}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section - More elegant */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-12 md:p-16 overflow-hidden"
        >
          {/* Sophisticated accent elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#500099]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#086BFA]/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Impact at a glance
              </h3>
              <p className="text-stone-400">
                Real results from students like you
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {benefits.map((benefit, index) => (
                <div key={benefit.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {benefit.value}
                  </div>
                  <div className="text-sm font-medium text-stone-400">
                    {benefit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}