'use client'; // Required for useEffect and useRef

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

const BusinessTweetsSection = () => {
  // Static data for tweets (as requested)
  const tweets = [
    {
      id: 1,
      text: "With Lingo.dev, our complex fintech app is available to everyone, and we didn't need a massive team or budget to make it happen.",
      author: 'Ramon Sanchez',
      title: 'Co-founder, EvryThink',
      avatar: '/images/tweets/ramon-sanchez.png',
    },
    {
      id: 2,
      text: "Now with Lingo.dev, our engineers don't even think about localization – they just build features, and translations happen automatically in 36 languages.",
      author: 'Keith Williams',
      title: 'Head of Engineering, Cal.com',
      avatar: '/images/tweets/keith-williams.png',
    },
    {
      id: 3,
      text: 'We tested Lingo.dev against human translations for our recruitment platform, and the AI translations were actually more accurate.',
      author: 'Quentin Decré',
      title: 'Co-founder, Jarvi',
      avatar: '/images/tweets/quentin-decre.png',
    },
     {
      id: 4,
      text: 'With Lingo.dev, Dutch reads naturally, Russian fits our UI perfectly, and our brand voice stays consistent.',
      author: 'Sebastiaan van Leeuwen',
      title: 'Product Manager, Truely',
      avatar: '/images/tweets/sebastiaan-van-leeuwen.png',
    },
    // Add more static tweets if needed, following the pattern
  ];

  // Split tweets into two columns for the scrolling effect
  const column1Tweets = tweets.filter((_, index) => index % 2 === 0);
  const column2Tweets = tweets.filter((_, index) => index % 2 !== 0);

  // Reusable Tweet Card Component
  const TweetCard = ({ tweet, className }: { tweet: typeof tweets[0], className?: string }) => (
    <div
      className={`bg-[rgba(0,0,0,0.7)] border border-[rgba(63,63,70,0.5)] rounded-xl p-6 shadow-[0px_2px_30px_0px_rgba(0,0,0,0.22),_0px_0px_15px_0px_rgba(0,0,0,0.06),_inset_0px_0px_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-[20px] flex flex-col ${className}`} // Removed mb-6
    >
      <blockquote className="text-[#ECEDEE] text-lg font-normal mb-6 flex-grow">
        &ldquo;{tweet.text}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 mt-auto">
        <div className="relative w-12 h-12 rounded-full border-2 border-black shadow-[0px_0px_0px_4px_#3F3F46]">
           <Image
             src={tweet.avatar}
             alt={tweet.author}
             layout="fill"
             objectFit="cover"
             className="rounded-full"
           />
         </div>
        <div>
          <p className="text-[#ECEDEE] text-xl font-medium">{tweet.author}</p>
          <p className="text-[#ECEDEE] text-sm font-normal">{tweet.title}</p>
        </div>
      </div>
    </div>
  );



const column1Ref = useRef<HTMLDivElement>(null);
const column2Ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  const ctx = gsap.context(() => {
    const col1 = column1Ref.current;
    const col2 = column2Ref.current;

    if (!col1 || !col2) return;

    // Animate using yPercent for potentially smoother looping
    // Since content is duplicated, total height is 200%, so we animate by 50%

    // Column 1: Scroll Down
    gsap.fromTo(
      col1,
      { yPercent: 0 },
      {
        yPercent: -50,
        ease: 'none',
        duration: 20, // 20 second duration
        repeat: -1,
      }
    );

    // Column 2: Scroll Up
    gsap.fromTo(
      col2,
      { yPercent: -50 }, // Start from the duplicated content position
      {
        yPercent: 0,
        ease: 'none',
        duration: 20, // 20 second duration
        repeat: -1,
      }
    );

  }, [column1Ref, column2Ref]); // Scope the context to the refs

  // Cleanup function provided by gsap.context()
  return () => ctx.revert();

}, [column1Tweets, column2Tweets]); // Re-run if tweet data changes


  return (
    <section className="business-tweets bg-[#0A0A0A] bg-[url('/images/Business_Tweets_bg.png')] bg-cover bg-center relative overflow-hidden border-b border-t border-[#18181B]">
      {/* Background elements - simplified for now */}
      <div className="absolute inset-0 z-0 opacity-50">
         {/* Placeholder for background image/gradient if needed */}
      </div>
       <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/0 to-[#0A0A0A]"></div>


      <div className="container mx-auto px-4 py-16 md:py-24 relative z-20 border-l border-r border-[#18181B]">
        {/* Added flex container for side-by-side layout on large screens */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
          {/* Text Content Column */}
          <div className="flex flex-col items-start text-left lg:w-5/12 xl:w-1/3">
           <div className="inline-flex items-center gap-2 border border-[#3F3F46] rounded-full px-4 py-1.5 mb-4 text-sm">
             <Image src="/images/tweets/business-tweets-icon.svg" alt="Tweets Icon" width={16} height={16} />
             <span className="text-[#ECEDEE] font-normal">Business Tweets</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-normal text-[#ECEDEE] mb-4 max-w-3xl">
             Businesses are automating repetitive tasks with Gen AI
           </h2>
           <p className="text-lg text-[#ECEDEE] font-normal mb-8 max-w-xl">
             Join Founders & CTOs who love QuantumHive
           </p>
           <div className="flex flex-col sm:flex-row gap-4">
            <button className="inline-flex items-center justify-center gap-2 border-2 border-[#3F3F46] rounded-full px-6 py-3 text-[#ECEDEE] text-base font-normal hover:bg-[#18181B] transition-colors">
              Pricing
              <Image src="/images/tweets/arrow-down.svg" alt="Arrow Down" width={16} height={16} />
            </button>
            <button className="inline-flex items-center justify-center gap-2 bg-[#FEC213] rounded-full px-6 py-3 text-[#000000] text-base font-normal hover:bg-yellow-400 transition-colors">
              Create an account
              <Image src="/images/tweets/arrow-right.svg" alt="Arrow Right" width={16} height={16} />
            </button>
          </div>
          </div>

          {/* Scrolling Tweets Columns Container */}
          <div className="flex gap-6 lg:w-7/12 xl:w-2/3 h-[600px] overflow-hidden"> {/* Added fixed height and overflow */}

            {/* Column 1: Scrolling Down */}
            <div className="w-1/2 h-full relative">
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                }}
              >
                <div ref={column1Ref} className="flex flex-col gap-6"> {/* Removed animation class, added ref */}
                  {/* Render tweets twice for infinite loop */}
                  {[...column1Tweets, ...column1Tweets].map((tweet, index) => (
                    <TweetCard key={`${tweet.id}-${index}`} tweet={tweet} />
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Scrolling Up */}
             <div className="w-1/2 h-full relative">
               <div
                 className="absolute top-0 left-0 w-full h-full"
                 style={{
                   maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                   WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                 }}
               >
                 <div ref={column2Ref} className="flex flex-col gap-6"> {/* Removed animation class, added ref */}
                   {/* Render tweets twice for infinite loop */}
                   {[...column2Tweets, ...column2Tweets].map((tweet, index) => (
                     <TweetCard key={`${tweet.id}-${index}`} tweet={tweet} />
                   ))}
                 </div>
               </div>
             </div>

          </div>
        </div> {/* Close flex container */}
      </div>
    </section>
  );
};

export default BusinessTweetsSection;