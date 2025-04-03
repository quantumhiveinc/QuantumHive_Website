import React from 'react';

const caseStudies = [
  {
    quote: "Before Lingo.dev, we struggled with translations for our top languages. Now, engineers focus on building features while translations occur automatically in 36 languages.",
    author: "Keith Williams",
    title: "Head of Engineering at Cal.com"
  },
  {
    quote: "Integrating Lingo.dev was seamless. The NexusAI translation quality is impressive, significantly reducing our manual review time.",
    author: "Jane Doe",
    title: "Product Manager at Evrythink"
  },
  {
    quote: "The localization engine is powerful. We can now target new markets much faster than before.",
    author: "John Smith",
    title: "CTO at Captions"
  },
  {
    quote: "Lingo.dev's API made integration into our existing workflow incredibly easy. Support was fantastic too.",
    author: "Alice Brown",
    title: "Lead Developer at IDA"
  },
  // Add more unique case studies if available
];

// Duplicate studies for seamless infinite scroll effect
const duplicatedStudies = [...caseStudies, ...caseStudies]; // Duplicate the array

const CaseStudiesSection = () => {
  return (
    <section className="bg-[#0A0A0A] text-white py-16 md:py-24 overflow-hidden relative group border-t border-b border-[#18181B]"> {/* Added group for hover pause, updated bg, added borders */}
      <div className="container mx-auto text-center mb-10 md:mb-16 px-4">
         <div className="inline-flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2">
           <span className="text-yellow-400 mr-2 text-lg font-semibold">”</span>
           <h2 className="text-sm font-medium tracking-wide uppercase">Case Studies</h2>
         </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="w-full inline-flex flex-nowrap">
        <div className="flex items-center justify-center md:justify-start [&_div]:mx-4 animate-infinite-scroll group-hover:animation-pause"> {/* Apply animation here */}
          {duplicatedStudies.map((study, index) => (
            <div key={`study-${index}`} className="flex-shrink-0 w-[90vw] max-w-md md:w-1/3"> {/* Adjusted width and added max-width */}
              <div className="p-8 rounded-lg text-center h-full flex flex-col justify-between min-h-[250px]"> {/* Ensure consistent height */}
                <blockquote className="text-lg md:text-xl mb-6 leading-relaxed italic">
                  &ldquo;{study.quote}&rdquo;
                </blockquote>
                <footer className="mt-auto">
                  <p className="font-medium text-base">{study.author}</p>
                  <p className="text-gray-400 text-sm">{study.title}</p>
                </footer>
              </div>
            </div>
          ))}
        </div>
        {/* Duplicate the content again for seamless loop - necessary for the CSS animation */}
        <div className="flex items-center justify-center md:justify-start [&_div]:mx-4 animate-infinite-scroll group-hover:animation-pause" aria-hidden="true">
          {duplicatedStudies.map((study, index) => (
            <div key={`study-clone-${index}`} className="flex-shrink-0 w-[90vw] max-w-md md:w-1/3"> {/* Adjusted width and added max-width */}
              <div className="p-8 rounded-lg text-center h-full flex flex-col justify-between min-h-[250px]"> {/* Ensure consistent height */}
                <blockquote className="text-lg md:text-xl mb-6 leading-relaxed italic">
                  &ldquo;{study.quote}&rdquo;
                </blockquote>
                <footer className="mt-auto">
                  <p className="font-medium text-base">{study.author}</p>
                  <p className="text-gray-400 text-sm">{study.title}</p>
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;