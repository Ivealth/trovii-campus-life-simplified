"use client"

import { Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* CTA Section */}
      <div className="border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-[2.5rem] sm:text-5xl font-bold text-stone-900 mb-4 tracking-tight leading-tight">
              Ready to simplify your campus life?
            </h2>
            <p className="text-[17px] text-stone-600 mb-8">
              Join 1,200+ students who are saving time and earning money with Trovii.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-medium text-[14px] px-6 h-11 rounded-lg"
              >
                Get started free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-stone-300 text-stone-700 hover:bg-stone-50 font-medium text-[14px] px-6 h-11 rounded-lg"
              >
                Contact sales
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="#500099"/>
                  <path d="M16 8V24M10 14H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className="text-[17px] font-semibold text-stone-900">Trovii</span>
              </div>
              <p className="text-[14px] text-stone-600 mb-6 max-w-xs leading-relaxed">
                Simplifying campus life for students. A project by Ivealth LTD.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-[14px] text-stone-900 mb-4">Product</h3>
              <ul className="space-y-3 text-[14px]">
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Features</a></li>
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Updates</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-[14px] text-stone-900 mb-4">Company</h3>
              <ul className="space-y-3 text-[14px]">
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">About</a></li>
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Blog</a></li>
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-[14px] text-stone-900 mb-4">Legal</h3>
              <ul className="space-y-3 text-[14px]">
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Terms</a></li>
                <li><a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[14px] text-stone-500">
              © {new Date().getFullYear()} Trovii by Ivealth LTD. All rights reserved.
            </p>
            <p className="text-[14px] text-stone-500">
              Made for students
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}