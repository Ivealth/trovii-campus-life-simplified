"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Computer Science, Junior",
    university: "Stanford",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    content: "Trovii transformed how I balance academics and work. The career launchpad helped me land an incredible internship that led to a full-time offer.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Business Admin, Sophomore",
    university: "MIT",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    content: "The convenience of having everything in one app is unmatched. Food delivery during finals and the community features keep me connected.",
    rating: 5
  },
  {
    name: "Emma Chen",
    role: "Psychology, Senior",
    university: "Berkeley",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
    content: "I've saved countless hours and earned enough through gigs to cover my textbooks. The platform genuinely cares about student success.",
    rating: 5
  }
]

const universities = [
  { name: "Stanford", count: "340+" },
  { name: "MIT", count: "280+" },
  { name: "Berkeley", count: "420+" },
  { name: "NYU", count: "310+" },
  { name: "Columbia", count: "250+" }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header - More refined */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <span className="text-xs font-semibold text-[#500099] tracking-wider uppercase">Student Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 tracking-tight leading-tight">
              Trusted by ambitious students
            </h2>
            <p className="text-lg text-stone-600">
              See what students are saying about their experience with Trovii.
            </p>
          </motion.div>
        </div>

        {/* Testimonial Cards - More elegant */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 border border-stone-200 h-full flex flex-col hover:border-stone-300 hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-300">
                {/* Quote icon */}
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-5">
                  <Quote className="w-5 h-5 text-stone-400" />
                </div>

                {/* Rating */}
                <div className="flex mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#FFD800] fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-stone-700 mb-6 leading-relaxed flex-grow">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center pt-4 border-t border-stone-100">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-stone-100"
                  />
                  <div>
                    <div className="font-semibold text-stone-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-stone-500">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {testimonial.university}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Universities Grid - More sophisticated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-stone-200 p-10 md:p-12"
        >
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wider">
              Active at leading universities
            </p>
            <h3 className="text-2xl font-bold text-stone-900">
              Trusted nationwide
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {universities.map((uni, index) => (
              <motion.div
                key={uni.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center p-4 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <div className="text-xl font-bold text-stone-900 mb-1">
                  {uni.name}
                </div>
                <div className="text-sm font-medium text-stone-500">
                  {uni.count} students
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}