import Image from 'next/image';
import React from 'react';

const PartnersSection = () => {
  return (
    <section className="bg-[#0A0A0A] text-white border-t border-b border-[#18181B]"> {/* Added top/bottom borders */}
      <div className="container mx-auto px-6 py-12 md:py-16 border-l border-r border-[#18181B] flex flex-col md:flex-row justify-between items-center"> {/* Adjusted padding, added flex */}
        {/* Left: Title */}
        <div className="mb-6 md:mb-0 md:mr-12"> {/* Added margin for spacing */}
          <h2 className="text-xl font-normal leading-relaxed text-[#ECEDEE]">
            Quantum Hive Inc<br />Technology Partners
          </h2>
        </div>

        {/* Right: Logos */}
        <div className="flex items-center space-x-8"> {/* Added flex and spacing for logos */}
          <Image
            src="/images/logos/github-logo.png"
            alt="GitHub Logo"
            width={40} // Adjust size as needed
            height={40} // Adjust size as needed
            className="opacity-90" // Added opacity from Figma
          />
          <Image
            src="/images/logos/gitlab-logo.png"
            alt="GitLab Logo"
            width={40} // Adjust size as needed
            height={40} // Adjust size as needed
            className="opacity-90" // Added opacity from Figma
          />
          {/* Add more partner logos here if needed */}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;