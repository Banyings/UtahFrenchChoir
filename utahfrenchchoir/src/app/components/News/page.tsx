/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
// News Room Page
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, Pause, Calendar, MapPin, Users, Heart, Star, 
  Music, Volume2, Share2, BookOpen, Award, Clock,
  ChevronRight, 
} from "lucide-react";

// Enhanced interfaces
interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnailUrl: string;
  description: string;
  date: string;
  views: string;
  duration: string;
  category: "performance" | "rehearsal" | "event";
}

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: "news" | "event" | "achievement";
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  ticketsAvailable: boolean;
}

// Enhanced video data
const videos: Video[] = [
  {
    id: "1",
    title: "Utah French Choir - Divine Performance",
    videoId: "4kR4B08TiBA",
    thumbnailUrl: `https://img.youtube.com/vi/4kR4B08TiBA/maxresdefault.jpg`,
    description: "Our soul-stirring performance showcasing the beauty of French worship music, touching hearts and lifting spirits in perfect harmony.",
    date: "2024-12-15",
    views: "12.5K",
    duration: "4:32",
    category: "performance"
  },
  {
    id: "2",
    title: "Sacred Hymns in French Tradition",
    videoId: "r3lSd1HERoE",
    thumbnailUrl: `https://img.youtube.com/vi/r3lSd1HERoE/maxresdefault.jpg`,
    description: "Celebrating our faith through time-honored French hymns, preserving tradition while creating new memories in worship.",
    date: "2024-11-28",
    views: "8.7K",
    duration: "6:18",
    category: "performance"
  },
];

// News articles data
const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Choir Wins Regional Competition",
    excerpt: "Our talented choir members brought home first place in the Utah Regional Sacred Music Competition, showcasing months of dedicated practice.",
    date: "2024-12-20",
    author: "Marie Dubois",
    image: "/choir-group.png",
    category: "achievement"
  },
  {
    id: "2",
    title: "New Members Welcome Ceremony",
    excerpt: "We welcomed 15 new voices to our choir family last Sunday, each bringing unique talents and passion for French sacred music.",
    date: "2024-12-10",
    author: "Pastor Jean-Luc",
    image: "/choir-group.png",
    category: "news"
  },
  {
    id: "3",
    title: "Christmas Concert Highlights",
    excerpt: "Our Christmas concert touched over 500 hearts with traditional French carols and contemporary worship songs in a magical evening.",
    date: "2024-12-05",
    author: "Sarah Johnson",
    image: "/choir-group.png",
    category: "event"
  }
];

// Upcoming events
const upcomingEvents: UpcomingEvent[] = [
  {
    id: "1",
    title: "Easter Sunrise Service",
    date: "2025-04-20",
    time: "6:00 AM",
    location: "Liberty Park Amphitheater",
    description: "Join us for a beautiful sunrise service with special Easter hymns in French and English.",
    ticketsAvailable: true
  },
  {
    id: "2",
    title: "French Heritage Festival",
    date: "2025-05-15",
    time: "2:00 PM",
    location: "Salt Lake Community Center",
    description: "Celebrating French culture with music, food, and fellowship in our annual heritage festival.",
    ticketsAvailable: true
  }
];

export default function NewsPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-rotate news articles
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % newsArticles.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay]);

  const toggleVideo = (videoId: string) => {
    setActiveVideo(activeVideo === videoId ? null : videoId);
  };

  const filteredVideos = selectedCategory === "all" 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance": return "bg-purple-100 text-purple-800";
      case "rehearsal": return "bg-blue-100 text-blue-800";
      case "event": return "bg-green-100 text-green-800";
      case "news": return "bg-orange-100 text-orange-800";
      case "achievement": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          {/* Floating musical notes - Fixed positions to avoid hydration mismatch */}
          {[
            { id: 1, fontSize: 24, left: 15, top: 20, delay: 0, duration: 4 },
            { id: 2, fontSize: 32, left: 85, top: 40, delay: 1, duration: 5 },
            { id: 3, fontSize: 28, left: 30, top: 70, delay: 2, duration: 3.5 },
            { id: 4, fontSize: 26, left: 70, top: 15, delay: 1.5, duration: 4.5 },
            { id: 5, fontSize: 30, left: 50, top: 85, delay: 3, duration: 4 },
            { id: 6, fontSize: 22, left: 5, top: 50, delay: 2.5, duration: 3.8 },
            { id: 7, fontSize: 34, left: 95, top: 25, delay: 0.5, duration: 5.2 },
            { id: 8, fontSize: 25, left: 20, top: 90, delay: 4, duration: 3.2 },
            { id: 9, fontSize: 29, left: 75, top: 60, delay: 1.8, duration: 4.8 },
            { id: 10, fontSize: 27, left: 45, top: 35, delay: 3.5, duration: 4.2 },
            { id: 11, fontSize: 31, left: 60, top: 10, delay: 2.2, duration: 3.6 },
            { id: 12, fontSize: 23, left: 10, top: 75, delay: 4.5, duration: 5.5 }
          ].map((note) => (
            <div
              key={note.id}
              className="absolute text-white/10 animate-float"
              style={{
                fontSize: `${note.fontSize}px`,
                left: `${note.left}%`,
                top: `${note.top}%`,
                animationDelay: `${note.delay}s`,
                animationDuration: `${note.duration}s`
              }}
            >
              ♪ ♫ ♪
            </div>
          ))}
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Utah French Choir
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              Latest news, performances, and moments from our musical ministry
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>50+ Members</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                <span>Award Winning</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span>Community Loved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured News Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Highlights</h2>
            <p className="text-xl text-gray-600">Stay updated with our most recent news and achievements</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={newsArticles[currentNewsIndex].image}
                    alt={newsArticles[currentNewsIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(newsArticles[currentNewsIndex].category)}`}>
                      {newsArticles[currentNewsIndex].category.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 text-white flex flex-col justify-center">
                  <div className="flex items-center text-blue-200 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{new Date(newsArticles[currentNewsIndex].date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">By {newsArticles[currentNewsIndex].author}</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                    {newsArticles[currentNewsIndex].title}
                  </h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    {newsArticles[currentNewsIndex].excerpt}
                  </p>
                  <Link 
                    href="/components/Join-us"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
                  >
                    Read Full Story
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            {/* News Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {newsArticles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentNewsIndex(index);
                    setIsAutoPlay(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentNewsIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Section with Advanced Features */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Performance Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Experience our most cherished performances and witness the power of worship through music
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {["all", "performance", "rehearsal", "event"].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Video Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Video Container */}
                <div className="relative">
                  <div className="relative w-full pt-[56.25%] overflow-hidden">
                    {activeVideo === video.id ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=0`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-cover bg-center cursor-pointer transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${video.thumbnailUrl})` }}
                        onClick={() => toggleVideo(video.id)}
                      >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md rounded-full p-6 group-hover:bg-white/30 group-hover:scale-125 transition-all duration-300 shadow-2xl">
                            <Play className="text-white w-16 h-16" />
                          </div>
                        </div>

                        {/* Video Info Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(video.category)} mb-2 inline-block`}>
                                {video.category.toUpperCase()}
                              </span>
                              <div className="text-white text-sm opacity-90">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {video.duration}
                                  </span>
                                  <span className="flex items-center">
                                    <Volume2 className="w-4 h-4 mr-1" />
                                    {video.views} views
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
                              <span className="text-white text-xs font-medium">HD</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Details */}
                <div className="p-8">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(video.date).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {video.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">Like</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Upcoming Events</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join us for these special occasions of worship, fellowship, and musical celebration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <div
                key={event.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center text-blue-200 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-blue-200">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  {event.ticketsAvailable && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </span>
                  )}
                </div>
                
                <p className="text-blue-100 mb-6 leading-relaxed">
                  {event.description}
                </p>
                
                <Link 
                  href="/components/Join-us"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Be Part of Our Story
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Every voice matters, every heart counts. Join our musical family and help us spread joy through worship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/components/Join-us"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center justify-center"
              >
                <Users className="w-6 h-6 mr-2" />
                Join Our Choir
              </Link>
              <Link 
                href="/components/Donate"
                className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                <Heart className="w-6 h-6 mr-2" />
                Support Our Ministry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) rotate(180deg); 
            opacity: 0.7;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}