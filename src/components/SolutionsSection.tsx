"use client";

import Image from "next/image";
import Script from 'next/script'; // Import Script component

// Extend the Window interface to include Calendly
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}
// Define data for structured data generation
const solutionsData = [
  {
    name: "NexusAI",
    description: "Intelligent business automation suite that streamlines workflows, manages communications, and processes documents across departments. Eliminates repetitive tasks while enhancing team productivity and decision-making.",
    iconPath: "/images/icons/nexusai-icon.svg",
    visualPath: "/images/Solutions_SVGs/SVG - AI Localization Engine.svg",
    visualAlt: "NexusAI Visual"
  },
  {
    name: "InsightIQ",
    description: "Advanced predictive analytics platform delivering actionable business intelligence through customizable dashboards and automated reporting. Transforms complex data into clear insights that drive strategic growth initiatives.",
    iconPlaceholder: "&#x1F50E;", // Magnifying Glass
    visualPath: "/images/Solutions_SVGs/SVG - Composable infrastructure.svg",
    visualAlt: "InsightIQ Visual"
  },
  {
    name: "EngageConnect",
    description: "Omnichannel customer experience solution that personalizes interactions across all touchpoints. Creates meaningful customer conversations that increase satisfaction, loyalty, and lifetime value.",
    iconPlaceholder: "</>", // Code Icon
    visualPath: "/images/Solutions_SVGs/SVG - Customizable brand voice.svg",
    visualAlt: "EngageConnect Visual"
  },
  {
    name: "SocialPulse",
    description: "AI-powered social media intelligence system that creates, optimizes, and analyzes content performance across platforms. Ensures your social presence drives engagement while delivering measurable marketing results.",
    iconPlaceholder: "&#x25A6;", // Square Grid Icon
    visualPath: "/images/Solutions_SVGs/SVG - Dynamic Content Translation.svg",
    visualAlt: "SocialPulse Visual"
  },
  {
    name: "ProspectRadar",
    description: "Intelligent sales development platform that identifies, engages, and qualifies high-value prospects. Accelerates pipeline growth by focusing your sales team on the most promising opportunities.",
    iconPlaceholder: "&#x1F3A4;", // Microphone Icon
    visualPath: "/images/Solutions_SVGs/SVG - Enterprise-grade support.svg",
    visualAlt: "ProspectRadar Visual"
  },
  {
    name: "ComplianceGuard",
    description: "Regulatory intelligence solution that monitors requirements, analyzes documents, and mitigates compliance risks. Simplifies complex regulatory landscapes while reducing the resources needed for compliance.",
    iconPlaceholder: "&#x26D3;", // Chain Icon (Alt)
    visualPath: "/images/Solutions_SVGs/SVG - Git-Native UI Localization.svg",
    visualAlt: "ComplianceGuard Visual"
  }
];

const SolutionsSection = () => {
  // Define the Service JSON-LD structured data
  // Assuming base URL from layout.tsx schema
  const baseUrl = "https://www.quantumhive.us";
  const solutionsSchema = {
    "@context": "https://schema.org",
    "@graph": solutionsData.map(solution => ({
      "@type": "Service",
      "name": solution.name,
      "description": solution.description,
      ...(solution.iconPath && { // Add image only if iconPath exists
         "image": `${baseUrl}${solution.iconPath}`
      }),
      "provider": {
        "@type": "Organization",
        "name": "Quantum Hive",
        "url": baseUrl
      },
      "serviceType": "AI Development Solution" // Generic service type, adjust if needed
      // Potential additions: areaServed, audience, offers (link to PricingSection offers later)
    }))
  };

  return (
    <section id="solutions" className="solutions-section bg-[#0A0A0A] border-t border-b border-[#18181B] bg-fade-overlay bg-fixed">
       {/* Calendly link widget begin */}
       <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
       <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
       {/* Calendly link widget end */}

       {/* Add the Service Schema */}
       <Script
        id="solutions-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solutionsSchema) }}
      />
      <div className="container mx-auto px-6 py-16 md:py-24 text-center border-l border-r border-[#18181B]">
        {/* Section Header */}
        <div className="mb-12">
           <span className="inline-flex items-center gap-1 bg-gray-800 text-[#FEC213] text-sm font-medium px-3 py-1 rounded-full mb-4"> {/* Standardized style */}
             &#x2699; Our Solutions {/* Gear Icon */}
           </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4">&ldquo;AI Solutions Built for Your Success&rdquo;</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Quantum Hive Inc, our AI development company approach transforms these challenges into opportunities
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Map over solutionsData to render cards dynamically */}
          {solutionsData.map((solution, index) => (
            <div key={index} className="bg-black/20 backdrop-blur-[20px] px-6 pt-6 rounded-[10px] border border-[#3F3F46] text-left flex flex-col h-full">
              <h3 className="text-xl font-normal text-[#FEC213] mb-3 flex items-center">
                {solution.iconPath ? (
                  <Image
                    src={solution.iconPath}
                    alt={`${solution.name} Icon`}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                ) : (
                  // Render placeholder HTML entity if no icon path
                  <span className="mr-2" dangerouslySetInnerHTML={{ __html: solution.iconPlaceholder || '' }} />
                )}
                {solution.name}
              </h3>
              <p className="text-[#ECEDEE] text-lg leading-[1.5em] mb-4 flex-grow">
                {solution.description}
              </p>
              {/* Visual */}
              <div className="mt-auto flex items-center justify-center">
                <Image src={solution.visualPath} alt={solution.visualAlt} width={250} height={100} className="w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {/* Calendly link widget begin */}
        <a
          href=""
          onClick={(e) => { e.preventDefault(); window.Calendly?.initPopupWidget({url: 'https://calendly.com/ceo-quantumhive'}); }}
          className="inline-flex items-center justify-center bg-[#FDB813] text-[#0A0A0A] px-8 py-3 rounded-full text-base font-semibold hover:bg-opacity-90 transition-colors"
        >
          Schedule a Solution Discovery Call
          <span className="ml-2">&#8594;</span> {/* Right arrow */}
        </a>
        {/* Calendly link widget end */}
      </div>
    </section>
  );
};

export default SolutionsSection;