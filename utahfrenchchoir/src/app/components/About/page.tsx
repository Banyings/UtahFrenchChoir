/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
//  About Page
'use client'
import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, Music, Globe, Heart, Star, Calendar } from "lucide-react";

const images = [
  "/choir-group.png",
  "/malau.png"
];

const leadership = [
  { role: "Choir President", name: "Francis Badibanga", icon: Star },
  { role: "Music Directors", name: "Serge Nkankonde, Joli Haboko, Corey Moore", icon: Music },
  { role: "Secretaries", name: "Sue Winmill and Jenny Gibbens Lyman", icon: Users },
  { role: "Developer and Designer", name: "Hyppolite Banyingela and Danny Motshikana", icon: Globe },
  { role: "Technicians", name: "Bernadi Kola and Eriel Yengo", icon: Users },
  { role: "Pianists", name: "Arthur Lono and Huggens Tshibanda", icon: Music },
  { role: "Administrator", name: "Lauren Kingoma", icon: Users }
];

export default function About() {
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Music className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            About Utah French Choir
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Spreading joy through music and worship across cultures and communities
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Est. 2018</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>International</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Faith-Based</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-400/20 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        
        {/* Leadership Section */}
        <section className="relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((leader, index) => {
              const IconComponent = leader.icon;
              return (
                <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {leader.role}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {leader.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full group-hover:from-blue-500 group-hover:to-green-500 transition-all duration-300"></div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Image Carousel Section */}
        <section className="relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Choir Family
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative bg-white rounded-3xl p-4 shadow-2xl">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={images[currentImage]}
                  alt="Utah French Choir"
                  className="w-full h-[400px] md:h-[500px] object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImage 
                        ? 'bg-white shadow-lg scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Members Section */}
        <section className="relative">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Diverse & Global
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full mb-8"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-500" />
                    International Community
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our members come from the Democratic Republic of the Congo, Canada, 
                    the United States, Ivory Coast, France and more.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <Music className="w-6 h-6 text-green-500" />
                    Multilingual Worship
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We sing primarily in French but can perform in Tshiluba, Swahili, 
                    English, and other languages.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-4">United in Song</h3>
                    <p className="text-lg opacity-90 leading-relaxed">
                      "Music is the universal language that brings hearts together across all cultures and backgrounds."
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      From Humble Beginnings to Global Ministry
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      We began singing in an apartment building in 2018 to praise God, with no initial 
                      intention of performing publicly. A year later, we started sharing our passion more widely, 
                      touching hearts across communities and spreading the joy of worship through music.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href="/components/News" 
                        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                      >
                        <span>Read Our Blog</span>
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Est. 2018</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Growing Strong</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-green-100/50 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100/50 to-blue-100/50 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
