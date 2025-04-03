// website/src/components/TechStackSection.tsx
import Image from 'next/image';

const techLogos = [
  // Row 1
  { src: '/images/logos/tech/nextjs.svg', alt: 'Next.js' },
  { src: '/images/logos/tech/react.svg', alt: 'React' },
  { src: '/images/logos/tech/rails.svg', alt: 'Ruby on Rails' },
  { src: '/images/logos/tech/flutter.svg', alt: 'Flutter' },
  { src: '/images/logos/tech/couchbase.svg', alt: 'Couchbase' },
  { src: '/images/logos/tech/contentful.svg', alt: 'Contentful' },
  // Row 2
  { src: '/images/logos/tech/apple.svg', alt: 'Apple' },
  { src: '/images/logos/tech/android.svg', alt: 'Android' },
  { src: '/images/logos/tech/django.svg', alt: 'Django' },
  { src: '/images/logos/tech/php.svg', alt: 'PHP' },
  { src: '/images/logos/tech/laravel.svg', alt: 'Laravel' },
  { src: '/images/logos/tech/wordpress.svg', alt: 'WordPress' },
];

const TechStackSection = () => {
  return (
    <section className="bg-[#0A0A0A] tech-stack-section">
      <div className="container mx-auto px-16 py-16 md:py-24 border-l border-r border-[#18181B]"> {/* Increased horizontal padding, added borders & vertical padding */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-center">
          {/* Left Column: Text */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-medium text-[#EDEDED]">
              Technology we rely on
            </h2>
            {/* Assuming 'Documentation' is a link or just text */}
            <p className="text-lg text-[#A3A3A3] flex items-center">
              Documentation
              {/* Added external link icon */}
              <svg className="ml-2 w-4 h-4 text-[#A3A3A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6h4v4m0-4L9 15"></path></svg>
            </p>
          </div>

          {/* Right Column: Logos */}
          <div className="grid grid-cols-3 sm:grid-cols-6"> {/* Removed border from grid container */}
            {techLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center px-12 py-4 border border-[#18181B] aspect-square" // Increased px to 12, kept py-4, updated border color
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={60} // Adjust size as needed
                  height={60} // Adjust size as needed
                  className="object-contain" // Ensure logo fits well
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;