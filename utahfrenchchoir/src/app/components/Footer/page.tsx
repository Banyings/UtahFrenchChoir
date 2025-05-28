/* eslint-disable @next/next/no-img-element */
// Footer
'use client';
import React, { useState } from "react";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Users, 
  Calendar,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from "lucide-react";

const Footer = () => {
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);

  const socialLinks = [
    { 
      name: "Facebook", 
      url: "https://facebook.com/utahfrenchchoir", 
      icon: Facebook,
      color: "hover:bg-blue-600",
      followers: "2.1K"
    },
    { 
      name: "Instagram", 
      url: "https://instagram.com/utahfrenchchoir", 
      icon: Instagram,
      color: "hover:bg-pink-600",
      followers: "1.8K"
    },
    { 
      name: "YouTube", 
      url: "https://youtube.com/utahfrenchchoir", 
      icon: Youtube,
      color: "hover:bg-red-600",
      followers: "950"
    },
    { 
      name: "Twitter", 
      url: "https://twitter.com/utahfrenchchoir", 
      icon: Twitter,
      color: "hover:bg-blue-400",
      followers: "780"
    }
  ];

  const quickLinks = [
    { name: "Choir Members", href: "/components/Members", icon: Users },
    { name: "Admin Portal", href: "/components/Sign-in", icon: Users },
    { name: "Choir Affairs", href: "/components/Affaires", icon: Calendar }
  ];

  const contactInfo = [
    { 
      icon: Mail, 
      label: "Email", 
      value: "utahfrchoir@gmail.com",
      link: "utahfrchoir-org.com"
    },
    { 
      icon: Phone, 
      label: "Phone", 
      value: "+1 (385) 307-3623",
      link: "tel:+1 (385) 307-3623"
    },
    { 
      icon: MapPin, 
      label: "Location", 
      value: "200 N Center St, Lehi, 84043, United States",
      link: "https://www.google.com/maps/place/200+N+Center+St,+Lehi,+UT+84043"
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Choir Logo Section */}
          <div className="lg:col-span-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="relative w-20 h-20 lg:w-24 lg:h-24">
                <img
                  src="/logo.png"
                  alt="Utah French Choir Logo"
                  className="w-full h-full object-contain shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Utah French Choir</h2>
                <p className="text-sm text-gray-300">Ministry through Music</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Spreading joy and worship through music since 2018. Join us in our mission to uplift hearts and bring communities together through the power of song.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Serving with love since 2018</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-center lg:text-left">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 group"
                  >
                    <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center group-hover:bg-blue-500/50 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-center lg:text-left">Get in Touch</h3>
            <div className="space-y-4">
              {contactInfo.map((contact) => {
                const IconComponent = contact.icon;
                return (
                  <a
                    key={contact.label}
                    href={contact.link}
                    className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center group-hover:bg-green-500/50 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{contact.label}</p>
                      <p className="text-sm font-medium">{contact.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-center lg:text-left">Follow Our Journey</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map(({ name, url, icon: IconComponent, color, followers }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-700/50 ${color}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">{name}</span>
                    <span className="text-xs text-gray-400">{followers} followers</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Quick Links Dropdown */}
        <div className="lg:hidden mb-8">
          <button
            onClick={() => setQuickLinksOpen(!quickLinksOpen)}
            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between text-white hover:bg-gray-700/50 transition-colors"
          >
            <span className="font-medium">Additional Links</span>
            {quickLinksOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${
            quickLinksOpen ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/30 transition-colors ${
                      index !== quickLinks.length - 1 ? 'border-b border-gray-700' : ''
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">©</span>
              </div>
              <span>{new Date().getFullYear()} Utah French Choir. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/components/Book-us" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;