"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CS Junior @ Berkeley",
    content: "Trovii completely changed how I manage my time. Found an internship through the platform and now I'm earning while studying. The food delivery is a lifesaver during finals.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Business @ NYU",
    content: "The gig marketplace is incredible. I've made over $2,000 doing freelance work I found on Trovii. Plus, the community features help me stay connected with my classmates.",
    rating: 5
  },
  {
    name: "Emma Chen",
    role: "Psychology @ MIT",
    content: "As a senior, Trovii helped me land my dream job. The career resources and connections I made through the platform were invaluable. Highly recommend to any student.",
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-bold text-stone-900 mb-3 sm:mb-4 tracking-tight leading-tight">
              Trusted by students
            </h2>
            <p className="text-[15px] sm:text-[17px] text-stone-600">
              See what students are saying about their experience with Trovii.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full bg-stone-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-stone-200">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-900 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                <p className="text-[14px] sm:text-[15px] text-stone-700 mb-5 sm:mb-6 leading-relaxed">
                  {testimonial.content}
                </p>

                <div className="pt-5 sm:pt-6 border-t border-stone-200">
                  <div className="font-semibold text-[14px] sm:text-[15px] text-stone-900">
                    {testimonial.name}
                  </div>
                  <div className="text-[12px] sm:text-[13px] text-stone-500 mt-0.5">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* University Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p className="text-[12px] sm:text-[13px] font-medium text-stone-500 mb-6 sm:mb-8 uppercase tracking-wider">
            Available at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
            {["Berkeley", "MIT", "Stanford", "NYU", "Columbia"].map((uni) => (
              <div key={uni} className="text-[14px] sm:text-[15px] font-semibold text-stone-400">
                {uni}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}