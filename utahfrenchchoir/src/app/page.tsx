'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

const Home = () => {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Utah French Choir</h1>
          <div className="space-y-4">
            <p className="text-lg font-medium mb-4">We combine cultures to enhance our voices together and our testimonies of the Lord. We sing for God and for others to join and become better.</p>
            <button 
              className="bg-green-600  px-8 py-3 rounded-md hover:bg-green-700 transition-colors"
              onClick={() => router.push('/components/Join-us')}
            >
              Join-Us
            </button>
          </div>
        </div>
        <div className="relative w-full aspect-[4/2] rounded-lg overflow-hidden">
          <Image 
            src="./choir-group.png" 
            alt="Choir group" 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg border border-neutral-950">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <Image 
              src="./choir-group.png" 
              alt="I love Singing" 
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <p className="text-center">Hey my name is Marjorie Badibanga. I love Singing</p>
          <button 
            className="w-full bg-green-600 py-2 rounded-md mt-4 hover:bg-green-700 transition-colors"
            onClick={() => router.push('/components/Visit-us')}
          >
            Visit Us
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-neutral-950">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <Image 
              src="./choir-group.png" 
              alt="Come visit us" 
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <p className="text-center">Come visit Us. We are so happy to have you sing with us!</p>
          <button 
            className="w-full bg-green-600 py-2 rounded-md mt-4 hover:bg-green-700 transition-colors"
            onClick={() => router.push('/components/Abou')}
          >
            Learn more
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border4 border border-neutral-950">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <Image 
              src="./choir-group.png" 
              alt="Nurturing Nations" 
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <p className="text-center">Nurturing Nations. An activity at Salem Utah</p>
          <button 
            className="w-full bg-green-600 py-2 rounded-md mt-4 hover:bg-green-700 transition-colors"
            onClick={() => router.push('/components/Activity')}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Stay Updated</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="email-address"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600  border-black"
          />
          <button 
            className="bg-green-600 px-8 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
            onClick={() => router.push('/components/Subscribe')}
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
