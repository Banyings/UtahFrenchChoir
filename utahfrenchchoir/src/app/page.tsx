/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, CheckCircle, AlertCircle, Sparkles, Music, Heart, Users, Star, Play } from 'lucide-react';

const Home = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [videoError, setVideoError] = useState('');
  const [isClient, setIsClient] = useState(false); // Add client-side flag

  // YouTube video ID from the URL
  const youtubeVideoId = '4kR4B08TiBA';

  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true);
    setIsVideoLoaded(true);
  }, []);

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  // Construct YouTube URL only on client side
  const getYouTubeUrl = () => {
    if (!isClient) return ''; // Return empty string during SSR
    
    return `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&loop=1&playlist=${youtubeVideoId}&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=1&enablejsapi=1&origin=${window.location.origin}&widget_referrer=${window.location.origin}`;
  };

  const handleSubscribe = async () => {
    setMessage('');
    setMessageType('');

    const allowedDomains = ['@gmail.com', '@yahoo.fr'];
    const isAllowedDomain = allowedDomains.some((domain) =>
      email.toLowerCase().endsWith(domain)
    );

    if (!isAllowedDomain) {
      setMessage('Incorrect email address. Please enter something like example@gmail.com');
      setMessageType('error');
      return;
    }
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stayTuned/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMessage(data.error || 'Subscription failed. Please try again.');
        setMessageType('error');
      } else {
        setMessage('Subscribed successfully! Check your email for confirmation.');
        setMessageType('success');
        setEmail('');
      }
    } catch (err) {
      setMessage('Error connecting to server. Please try again later.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToJoinUs = () => {
    router.push('/components/Join-us');
  };

  const navigateToNews = () => {
    router.push('/components/News');
  };
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-4 lg:px-8 py-8 lg:py-16">
        {/* Hero Section with Better Desktop Layout */}
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-center mb-16 lg:mb-24">
            {/* Text Content - Left Side (1/4 width) */}
            <div className="lg:col-span-1 space-y-6 lg:space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 border border-blue-200/50 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                Ministry through Music
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight">
                <span className="block text-gray-900">Welcome to</span>
                <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text animate-pulse">
                  Utah French Choir
                </span>
              </h1>
              
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-medium">
                We combine cultures to enhance our voices together and our testimonies of the Lord. 
                <span className="text-purple-600 font-semibold"> We sing for God</span> and for others to join and become better.
              </p>
              
              <div className="flex flex-col gap-3 lg:gap-4">
                <button
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white px-4 lg:px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                  onClick={navigateToJoinUs}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4 group-hover:scale-125 transition-transform duration-300" />
                    <span className="tracking-wide text-sm lg:text-base">Join Our Choir</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </button>
                
                <button 
                  className="group flex items-center justify-center space-x-2 px-4 lg:px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={navigateToNews}
                >
                  <Play className="w-4 h-4 text-green-500" />
                  <span className="text-sm lg:text-base">See Us Singing</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 text-xs lg:text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-400 to-green-400 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="font-medium">50+ Active Members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Since 2018</span>
                </div>
              </div>
            </div>

            {/* Media Content - Right Side (3/4 width) */}
            <div className="lg:col-span-3 relative">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-700 group bg-black">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-purple-600/10 z-10 pointer-events-none"></div>
                
                {showVideo ? (
                  <>
                    {/* YouTube Video Embed - Only render after client mount */}
                    {isClient && (
                      <iframe
                        className="w-full h-full object-cover"
                        src={getYouTubeUrl()}
                        title="Utah French Choir Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                        allowFullScreen
                        loading="eager"
                        onLoad={() => {
                          console.log('YouTube video loaded successfully');
                          setIsVideoLoaded(true);
                          setVideoError('');
                        }}
                        onError={(e) => {
                          console.error('YouTube video error:', e);
                          setIsVideoLoaded(false);
                          setVideoError('YouTube video failed to load.');
                        }}
                        style={{ 
                          border: 'none',
                          outline: 'none',
                          backgroundColor: 'transparent'
                        }}
                      />
                    )}

                    {/* Video Controls Overlay - Minimal interference */}
                    <div className="absolute top-4 right-4 z-30 opacity-80 hover:opacity-100 transition-opacity duration-300">
                      {/* Hide Video Button */}
                      <button
                        onClick={toggleVideo}
                        className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-all duration-300 hover:scale-105"
                        title="Hide video"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Background image when video is hidden */
                  <div className="w-full h-full relative">
                    <img
                      src="/choir-group.png"
                      alt="Utah French Choir Group"
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Overlay with controls */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-white/30 transition-all duration-300">
                          <Play className="w-12 h-12 text-white ml-1" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Utah French Choir</h3>
                        <p className="text-white/90 mb-6 max-w-md mx-auto">Experience our beautiful choir performance</p>
                        <button
                          onClick={toggleVideo}
                          className="px-8 py-3 bg-white text-gray-800 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Watch Video
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Loading/Error overlay */}
                {showVideo && (!isVideoLoaded || videoError) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center z-20 rounded-3xl">
                    <div className="text-center">
                      {videoError ? (
                        <div>
                          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">⚠️</span>
                          </div>
                          <p className="text-red-600 font-medium">{videoError}</p>
                          <p className="text-sm text-gray-600 mt-2">Please refresh the page or check your connection</p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-600 font-medium">Loading choir video...</p>
                          <p className="text-sm text-gray-500 mt-1">Preparing audio and video</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-bounce opacity-80 z-30"></div>
                <div className="absolute -bottom-4 -left-4 w-8 lg:w-12 h-8 lg:h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full animate-pulse z-30"></div>
              </div>
              
              {/* Video Status */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {!showVideo ? 'Background image shown - click "Watch Video" to play' :
                   videoError ? 'YouTube video error - please refresh' :
                   !isVideoLoaded ? 'Loading choir video with audio...' : 
                   'Utah French Choir performing live - click ▶️ to pause/play'}
                </p>
                {showVideo && isVideoLoaded && (
                  <div className="flex justify-center gap-6 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span>▶️</span> Pause/Play in video controls
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🔊</span> Volume control available
                    </span>
                    <span className="flex items-center gap-1">
                      <span>⛶</span> Click for fullscreen
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="max-w-8xl mx-auto mb-16 lg:mb-24">
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-sm font-medium text-gray-700 border border-green-200/50 backdrop-blur-sm mb-6">
              <Heart className="w-4 h-4 mr-2 text-green-500" />
              Explore Our Community
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Discover Our <span className="text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">Ministry</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Join our vibrant community of believers as we worship through music and strengthen our faith together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              imageSrc="/meet-us.png"
              title="Meet Our Family"
              description="Hey we are the Utah French Choir. We love Singing and sharing our passion with our community."
              buttonLabel="Visit Us"
              buttonLink="/components/News"
              router={router}
              gradient="from-blue-500 to-purple-500"
              icon={<Users className="w-6 h-6" />}
            />
            <FeatureCard
              imageSrc="/join-our-sessions.png"
              title="Join Our Sessions"
              description="Come visit us! We are so happy to have you sing with us and become part of our choir family."
              buttonLabel="Learn More"
              buttonLink="/components/About"
              router={router}
              gradient="from-purple-500 to-green-500"
              icon={<Music className="w-6 h-6" />}
            />
            <FeatureCard
              imageSrc="/community-events.png"
              title="Community Events"
              description="Nurturing Nations. An activity at Salem Utah bringing together voices from all backgrounds."
              buttonLabel="View Activities"
              buttonLink="/components/News"
              router={router}
              gradient="from-green-500 to-blue-500"
              icon={<Star className="w-6 h-6" />}
            />
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 p-1 shadow-2xl">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-12 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
              
              <div className="relative text-center">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 border border-blue-200/50 backdrop-blur-sm mb-6">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  Newsletter Subscription
                </div>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                  Stay <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Connected</span>
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Get exclusive updates about our performances, events, and community activities delivered straight to your inbox
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-6">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium text-gray-700 placeholder-gray-400"
                      aria-label="Email address"
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  
                  <button
                    className={`group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all duration-500 whitespace-nowrap ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-500/25 hover:scale-105 hover:-translate-y-1'
                    }`}
                    onClick={handleSubscribe}
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="tracking-wide">Subscribe Now</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  </button>
                </div>
                
                {message && (
                  <div className={`p-4 rounded-2xl shadow-lg max-w-2xl mx-auto transition-all duration-500 ${
                    messageType === 'success' 
                      ? 'bg-green-50 text-green-800 border-2 border-green-200' 
                      : 'bg-red-50 text-red-800 border-2 border-red-200'
                  }`}>
                    <div className="flex items-center justify-center">
                      {messageType === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
                      )}
                      <p className="font-medium">{message}</p>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-4">
                  Join 200+ subscribers • No spam, unsubscribe anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// --- Feature Card Component ---
interface FeatureCardProps {
  imageSrc: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
  router: ReturnType<typeof useRouter>;
  gradient: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  imageSrc, 
  title,
  description, 
  buttonLabel, 
  buttonLink, 
  router,
  gradient,
  icon
}) => {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
      
      <div className="relative bg-white rounded-3xl p-6 lg:p-8">
        <div className={`inline-flex items-center justify-center w-14 lg:w-16 h-14 lg:h-16 bg-gradient-to-r ${gradient} rounded-2xl mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        <div className="relative w-28 lg:w-32 h-28 lg:h-32 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-100 group-hover:border-white transition-all duration-300">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
        </div>
        
        <h3 className="font-black text-lg lg:text-xl mb-3 text-center text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {title}
        </h3>
        <p className="text-center text-gray-600 mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
          {description}
        </p>
        
        <button
          className={`w-full bg-gradient-to-r ${gradient} text-white py-3 lg:py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 group-hover:scale-105`}
          onClick={() => router.push(buttonLink)}
        >
          <span className="tracking-wide text-sm lg:text-base">{buttonLabel}</span>
          <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};