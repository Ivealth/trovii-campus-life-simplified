"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Computer Science, Junior",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    content: "Trovii changed how I manage campus life. Found an amazing internship and now earning while gaining experience.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Business Admin, Sophomore",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    content: "Food delivery is a lifesaver during finals. Connected with so many people through the community hub.",
    rating: 5
  },
  {
    name: "Emma Chen",
    role: "Psychology, Senior",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
    content: "Saved so much time and the gig opportunities helped me pay off loans. Highly recommend.",
    rating: 5
  }
]

const partners = [
  "Stanford",
  "MIT",
  "Berkeley",
  "NYU",
  "Columbia"
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-24 bg-stone-50">
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
              Loved by students
            </h2>
            <p className="text-[15px] text-stone-600">
              Join thousands already thriving with Trovii.
            </p>
          </motion.div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-lg p-6 border border-stone-200 h-full flex flex-col hover:border-[#500099]/30 hover:shadow-lg hover:shadow-[#500099]/5 transition-all duration-200">
                {/* Rating */}
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#FFD800] fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-[14px] text-stone-700 mb-5 leading-relaxed flex-grow">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover mr-3 ring-2 ring-[#500099]/10"
                  />
                  <div>
                    <div className="font-medium text-[14px] text-stone-900">
                      {testimonial.name}
                    </div>
                    <div className="text-[12px] text-stone-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner Universities */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-[11px] font-medium text-stone-500 mb-6 uppercase tracking-wider">
            Trusted at leading universities
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-base font-medium text-stone-400 hover:text-[#500099] transition-colors"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}