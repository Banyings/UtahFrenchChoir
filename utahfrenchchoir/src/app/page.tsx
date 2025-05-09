/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';
// import React, { useState } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@supabase/supabase-js';

// // Initialize Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const Home = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

//   const handleSubscribe = async () => {
//     if (!email || !email.includes('@')) {
//       setMessage('Please enter a valid email.');
//       setMessageType('error');
//       return;
//     }
  
//     try {
//       const { data, error } = await supabase
//         .from('subscribers')
//         .insert([{ email }]);
  
//       if (error) {
//         if (error.message.toLowerCase().includes('duplicate')) {
//           setMessage('You are already subscribed with this email.');
//         } else {
//           setMessage(error.message || 'Subscription failed.');
//         }
//         setMessageType('error');
//       } else {
//         setMessage('Subscribed successfully!');
//         setMessageType('success');
//         setEmail('');
//       }
//     } catch (err) {
//       setMessage('Error connecting to database. Please try again later.');
//       setMessageType('error');
//     }
//   };
  
//   // Leads to the Join-Us Page
//   const navigateToJoinUs = () => {
//     router.push('/components/Join-us');
//   };
  
//   // Frontend Tsx/Javascript and Tailwindcss
//   return (
//     <div className="max-w-auto mx-auto px-4 py-8">
//       {/* Hero Section */}
//       <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
//         <div>
//           <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Utah French Choir</h1>
//           <div className="space-y-4">
//             <p className="text-lg font-medium mb-4">
//               We combine cultures to enhance our voices together and our testimonies of the Lord. We sing for God and for others to join and become better.
//             </p>
//             <button
//               className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors"
//               onClick={navigateToJoinUs}
//             >
//               Join-Us
//             </button>
//           </div>
//         </div>
//         <div className="relative w-full aspect-[4/2] rounded-lg overflow-hidden">
//           <Image
//             src="/choir-group.png"
//             alt="Choir group"
//             fill
//             className="object-cover"
//             sizes="(max-width: 768px) 100vw, 50vw"
//             priority
//           />
//         </div>
//       </div>

//       {/* Feature Cards Section */}
//       <div className="grid md:grid-cols-3 gap-8 mb-8">
//         <FeatureCard
//           imageSrc="/choir-group.png"
//           description="Hey my name is Marjorie Badibanga. I love Singing"
//           buttonLabel="Visit Us"
//           buttonLink="/components/Visit-us"
//           router={router}
//         />
//         <FeatureCard
//           imageSrc="/choir-group.png"
//           description="Come visit Us. We are so happy to have you sing with us!"
//           buttonLabel="Learn more"
//           buttonLink="/components/About"
//           router={router}
//         />
//         <FeatureCard
//           imageSrc="/choir-group.png"
//           description="Nurturing Nations. An activity at Salem Utah"
//           buttonLabel="Activity"
//           buttonLink="/components/Activity"
//           router={router}
//         />
//       </div>

//       {/* Subscribe Section */}
//       <div className="max-w-2xl mx-auto text-center">
//         <h2 className="text-3xl font-bold mb-8">Stay Updated</h2>
//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             type="email"
//             placeholder="email-address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 border-black"
//             aria-label="Email address"
//           />
//           <button
//             className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
//             onClick={handleSubscribe}
//           >
//             Subscribe Now
//           </button>
//         </div>
//         {message && (
//           <p className={`mt-4 p-2 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800 border' : 'bg-red-100 text-red-800 border border-red-400'}`}>
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

// // --- Feature Card Component ---
// interface FeatureCardProps {
//   imageSrc: string;
//   description: string;
//   buttonLabel: string;
//   buttonLink: string;
//   router: ReturnType<typeof useRouter>;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, description, buttonLabel, buttonLink, router }) => {
//   return (
//     <div className="p-6 rounded-lg border border-neutral-950">
//       <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
//         <Image
//           src={imageSrc}
//           alt="Feature Image"
//           fill
//           className="object-cover"
//           sizes="128px"
//         />
//       </div>
//       <p className="text-center">{description}</p>
//       <button
//         className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-700 transition-colors"
//         onClick={() => router.push(buttonLink)}
//       >
//         {buttonLabel}
//       </button>
//     </div>
//   );
// };

'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - with fallback for missing env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jqmbpitwstegbcsxivim.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbWJwaXR3c3RlZ2Jjc3hpdmltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NzA1NzksImV4cCI6MjA2MjE0NjU3OX0.Xt2Wb2nLEwNshvZt0XJLy2vaBZtL2wr30aQhI46zPEw';

// Create client or use a mock if environment variables aren't properly set
const supabase = (supabaseUrl !== 'https://jqmbpitwstegbcsxivim.supabase.co')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      })
    };

const Home = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email.');
      setMessageType('error');
      return;
    }

    try {
      // Check if Supabase is properly configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined || 
          process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://jqmbpitwstegbcsxivim.supabase.co') {
        // For development/testing without Supabase configured
        console.log('Supabase not configured, but would save:', email);
        setMessage('Subscription feature coming soon! Your email would be saved.');
        setMessageType('success');
        setEmail('');
        return;
      }

      // Insert the email directly into Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{ email, created_at: new Date() }]);

      if (error) {
        // Check if it's a duplicate email error
        if ('code'in error && error.code === '23505') {
          setMessage('You are already subscribed with this email.');
        } else {
          setMessage(error.message || 'Subscription failed.');
        }
        setMessageType('error');
      } else {
        setMessage('Subscribed successfully!');
        setMessageType('success');
        setEmail('');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setMessage('Error connecting to database. Please try again later.');
      setMessageType('error');
    }
  };

  // Leads to the Join-Us Page
  const navigateToJoinUs = () => {
    router.push('/components/Join-us');
  };
  
  // Frontend Tsx/Javascript and Tailwindcss
  return (
    <div className="max-w-auto mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Utah French Choir</h1>
          <div className="space-y-4">
            <p className="text-lg font-medium mb-4">
              We combine cultures to enhance our voices together and our testimonies of the Lord. We sing for God and for others to join and become better.
            </p>
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors"
              onClick={navigateToJoinUs}
            >
              Join-Us
            </button>
          </div>
        </div>
        <div className="relative w-full aspect-[4/2] rounded-lg overflow-hidden">
          <Image
            src="/choir-group.png"
            alt="Choir group"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <FeatureCard
          imageSrc="/choir-group.png"
          description="Hey my name is Marjorie Badibanga. I love Singing"
          buttonLabel="Visit Us"
          buttonLink="/components/Visit-us"
          router={router}
        />
        <FeatureCard
          imageSrc="/choir-group.png"
          description="Come visit Us. We are so happy to have you sing with us!"
          buttonLabel="Learn more"
          buttonLink="/components/About"
          router={router}
        />
        <FeatureCard
          imageSrc="/choir-group.png"
          description="Nurturing Nations. An activity at Salem Utah"
          buttonLabel="Activity"
          buttonLink="/components/Activity"
          router={router}
        />
      </div>

      {/* Subscribe Section */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Stay Updated</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="email-address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 border-black"
            aria-label="Email address"
          />
          <button
            className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
            onClick={handleSubscribe}
          >
            Subscribe Now
          </button>
        </div>
        {message && (
          <p className={`mt-4 p-2 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800 border' : 'bg-red-100 text-red-800 border border-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;

// --- Feature Card Component ---
interface FeatureCardProps {
  imageSrc: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
  router: ReturnType<typeof useRouter>;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, description, buttonLabel, buttonLink, router }) => {
  return (
    <div className="p-6 rounded-lg border border-neutral-950">
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
        <Image
          src={imageSrc}
          alt="Feature Image"
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>
      <p className="text-center">{description}</p>
      <button
        className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-700 transition-colors"
        onClick={() => router.push(buttonLink)}
      >
        {buttonLabel}
      </button>
    </div>
  );
};