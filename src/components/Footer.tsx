"use client"

import { Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200">
      {/* CTA Section */}
      <div className="border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-[15px] text-stone-600 mb-7">
              Join 1,200+ students saving time and earning money with Trovii.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#500099] to-[#3D0086] hover:from-[#3D0086] hover:to-[#500099] text-white font-medium text-[14px] px-6 h-11 rounded-lg shadow-lg shadow-[#500099]/25"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-[#500099] text-[#500099] hover:bg-[#500099]/5 font-medium text-[14px] px-6 h-11 rounded-lg"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#500099] to-[#3D0086] flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">T</span>
              </div>
              <span className="text-lg font-semibold text-stone-900 tracking-tight">Trovii</span>
            </div>
            <p className="text-[13px] text-stone-600 mb-4 leading-relaxed">
              Simplifying campus life for students everywhere.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="w-8 h-8 rounded-md bg-stone-100 hover:bg-[#500099]/10 hover:text-[#500099] flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-stone-600" />
              </a>
              <a href="#" className="w-8 h-8 rounded-md bg-stone-100 hover:bg-[#500099]/10 hover:text-[#500099] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-stone-600" />
              </a>
              <a href="#" className="w-8 h-8 rounded-md bg-stone-100 hover:bg-[#500099]/10 hover:text-[#500099] flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4 text-stone-600" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-[13px] text-stone-900 mb-3">Product</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">Features</a></li>
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">How It Works</a></li>
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-[13px] text-stone-900 mb-3">Company</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">About</a></li>
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">Careers</a></li>
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-[13px] text-stone-900 mb-3">Support</h3>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">Privacy</a></li>
              <li><a href="#" className="text-stone-600 hover:text-[#500099] transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[13px] text-stone-500">
              © {new Date().getFullYear()} Trovii by Ivealth LTD. All rights reserved.
            </p>
            <p className="text-[13px] text-stone-500">
              Made for students
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}