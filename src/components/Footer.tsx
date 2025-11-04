"use client"

import { Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200">
      {/* Premium CTA Section */}
      <div className="border-b border-stone-200 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 tracking-tight leading-tight">
              Ready to transform your<br />campus experience?
            </h2>
            <p className="text-lg text-stone-600 mb-10 leading-relaxed">
              Join over 1,200 students who are already saving time and earning money with Trovii.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer - More refined */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <span className="text-xl font-bold text-stone-900 tracking-tight">Trovii</span>
            </div>
            <p className="text-stone-600 mb-6 leading-relaxed max-w-xs">
              The modern platform simplifying campus life for ambitious students everywhere.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white flex items-center justify-center transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white flex items-center justify-center transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white flex items-center justify-center transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4 text-sm">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Features</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">How It Works</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Updates</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">About</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Careers</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Blog</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4 text-sm">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Community</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-stone-600">
              © {new Date().getFullYear()} Trovii by <span className="font-semibold">Ivealth LTD</span>. All rights reserved.
            </p>
            <p className="text-sm text-stone-600">
              Made with ❤️ for students
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}