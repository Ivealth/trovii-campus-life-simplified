"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed, Briefcase, Users, ArrowRight } from "lucide-react"

const features = [
  {
    icon: UtensilsCrossed,
    title: "Food Delivery",
    description: "Order from campus restaurants and get meals delivered directly to your location. Save time during busy study sessions.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Briefcase,
    title: "Career Launchpad",
    description: "Browse gigs, internships, and part-time opportunities tailored for students. Earn money on your schedule.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with classmates, join clubs, and stay updated on campus events. Build your network.",
    gradient: "from-blue-500 to-blue-600"
  }
]

const stats = [
  { label: "Active students", value: "1,200+" },
  { label: "Jobs posted", value: "450+" },
  { label: "Hours saved", value: "10k+" },
]

export default function Features() {
  return (
    <>
      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-[2.5rem] sm:text-5xl font-bold text-stone-900 mb-4 tracking-tight leading-tight">
                Everything you need
              </h2>
              <p className="text-[17px] text-stone-600 leading-relaxed">
                Three essential services integrated into one platform. Designed specifically for student life.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="group h-full p-8 rounded-2xl border border-stone-200 hover:border-transparent hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-[19px] font-semibold text-stone-900 mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-[2.5rem] sm:text-5xl font-bold text-stone-900 mb-4 tracking-tight leading-tight">
              Simple to get started
            </h2>
            <p className="text-[17px] text-stone-600">
              Create an account, explore opportunities, and start saving time in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {[
              { step: "01", title: "Sign up", desc: "Create your free account with your student email", color: "purple" },
              { step: "02", title: "Browse", desc: "Explore food options, gigs, and community events", color: "blue" },
              { step: "03", title: "Get started", desc: "Order, apply, or connect—it's that simple", color: "yellow" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-[13px] font-bold ${
                  item.color === 'purple' ? 'text-purple-600' : 
                  item.color === 'blue' ? 'text-blue-600' : 
                  'text-yellow-600'
                } mb-4 tracking-wider`}>{item.step}</div>
                <h3 className="text-[19px] font-semibold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-[15px] text-stone-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto py-12 border-t border-purple-200"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[2rem] sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">{stat.value}</div>
                <div className="text-[13px] text-stone-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}