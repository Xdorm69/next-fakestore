import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-background text-white py-8 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">FakeStore</h3>
          <p className="text-sm text-gray-300">
            Your one-stop shop for all your online shopping needs. 
            Quality products, great prices, and exceptional service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-blue-300">Home</Link></li>
            <li><Link href="/products" className="hover:text-blue-300">Products</Link></li>
            <li><Link href="/about" className="hover:text-blue-300">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-300">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-2xl hover:text-blue-500"><Facebook /></a>
            <a href="#" className="text-2xl hover:text-blue-400"><Twitter /></a>
            <a href="#" className="text-2xl hover:text-pink-500"><Instagram /></a>
            <a href="#" className="text-2xl hover:text-blue-600"><Linkedin /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 pt-4 border-t border-gray-700">
        <p className="text-sm">&copy; {new Date().getFullYear()} FakeStore. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer