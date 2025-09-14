'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-2xl font-bold text-gray-900">
              llElevenLabs
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="#" className="flex items-center gap-1 hover:text-black">
              Creative Platform <ChevronDown className="h-4 w-4" />
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-black">
              Agents Platform <ChevronDown className="h-4 w-4" />
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-black">
              Developers <ChevronDown className="h-4 w-4" />
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-black">
              Resources <ChevronDown className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:text-black">Enterprise</Link>
            <Link href="#" className="hover:text-black">Pricing</Link>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="#" className="block px-3 py-2 flex justify-between items-center text-gray-700 hover:bg-gray-50">
            Creative Platform <ChevronDown className="h-4 w-4" />
          </Link>
          <Link href="#" className="block px-3 py-2 flex justify-between items-center text-gray-700 hover:bg-gray-50">
            Agents Platform <ChevronDown className="h-4 w-4" />
          </Link>
          <Link href="#" className="block px-3 py-2 flex justify-between items-center text-gray-700 hover:bg-gray-50">
            Developers <ChevronDown className="h-4 w-4" />
          </Link>
          <Link href="#" className="block px-3 py-2 flex justify-between items-center text-gray-700 hover:bg-gray-50">
            Resources <ChevronDown className="h-4 w-4" />
          </Link>
          <Link href="#" className="block px-3 py-2 flex justify-between items-center text-gray-700 hover:bg-gray-50">
            Enterprise <ChevronDown className="h-4 w-4" />
          </Link>
          <Link href="#" className="block px-3 py-2 flex justify-between items-center text-gray-700 hover:bg-gray-50">
            Pricing <ChevronDown className="h-4 w-4" />
          </Link>
          <Link href="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Login</Link>
          <Link href="/signup" className="block px-3 py-2 text-white bg-black rounded-lg">Sign Up</Link>
        </div>
      )}
    </header>
  )
}

export default Header
