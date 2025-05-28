/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Navbar
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DollarSign, Menu, X, Heart, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/components/About", label: "About" },
    { href: "/components/News", label: "News" },
    { href: "/components/Book-us", label: "Book Us" }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100/50'
      }`}>
        <div className="flex items-center justify-between px-4 lg:px-8 py-3 mx-auto max-w-7xl">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group">
            <div className="relative overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Utah French Choir" 
                className="w-16 h-12 object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Utah French Choir
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-full p-1 border border-gray-200/50">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-white/80 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-green-500/20 blur-sm -z-10"></div>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop Donate Button */}
            <a href="/components/Donate" className="hidden lg:block">
              <button className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-2">
                  <Heart size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Donate</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative w-10 h-10 rounded-lg bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 flex items-center justify-center hover:bg-gray-200/80 transition-all duration-300 hover:scale-105"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span className={`absolute block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 top-2' : 'top-1'
                }`}></span>
                <span className={`absolute block w-5 h-0.5 bg-gray-700 top-2 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 top-2' : 'top-3'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block relative overflow-hidden rounded-xl transition-all duration-300 ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {pathname === item.href && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                </a>
              ))}
              
              {/* Mobile Donate Button */}
              <a href="/components/Donate" className="block">
                <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="px-4 py-3 flex items-center space-x-3">
                    <Heart size={20} />
                    <span className="font-medium">Donate to Our Ministry</span>
                  </div>
                  <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Dynamic Spacer */}
      <div className={`transition-all duration-300 ${
        isMenuOpen ? 'h-80 lg:h-20' : 'h-20'
      }`} />
    </>
  );
}