import Link from "next/link";
import Image from "next/image";

const SolutionsSection = () => {
  return (
    <section className="solutions-section bg-[#0A0A0A] border-t border-b border-[#18181B] bg-fade-overlay bg-fixed">
      <div className="container mx-auto px-6 py-16 md:py-24 text-center border-l border-r border-[#18181B]">
        {/* Section Header */}
        <div className="mb-12">
           <span className="inline-block bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
             &#x2699; Our Solutions {/* Gear Icon */}
           </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4">&quot;AI Solutions Built for Your Success&quot;</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Quantum Hive Inc, our AI development company approach transforms these challenges into opportunities
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Solution Card 1: NexusAI */}
          <div className="bg-black/20 backdrop-blur-[20px] px-6 pt-6 rounded-[10px] border border-[#3F3F46] text-left flex flex-col h-full">
            <h3 className="text-xl font-normal text-[#FEC213] mb-3 flex items-center">
              <Image
                src="/images/icons/nexusai-icon.svg"
                alt="NexusAI Icon"
                width={24} // Adjust size as needed
                height={24} // Adjust size as needed
                className="mr-2"
              />
              NexusAI
            </h3>
            <p className="text-[#ECEDEE] text-sm leading-[1.5em] mb-4 flex-grow">
              Intelligent business automation suite that streamlines workflows, manages communications, and processes documents across departments. Eliminates repetitive tasks while enhancing team productivity and decision-making.
            </p>
            {/* Visual from Figma */}
            <div className="mt-auto flex items-center justify-center">
              <Image src="/images/Solutions_SVGs/SVG - AI Localization Engine.svg" alt="NexusAI Visual" width={250} height={100} className="w-4/5" />
            </div>
          </div>

          {/* Solution Card 2: InsightIQ */}
          <div className="bg-black/20 backdrop-blur-[20px] px-6 pt-6 rounded-[10px] border border-[#3F3F46] text-left flex flex-col h-full">
            <h3 className="text-xl font-normal text-[#FEC213] mb-3 flex items-center">
               {/* Placeholder Icon */} <span className="mr-2">&#x1F50E;</span> InsightIQ {/* Magnifying Glass */} {/* TODO: Replace icon */}
            </h3>
            <p className="text-[#ECEDEE] text-sm leading-[1.5em] mb-4 flex-grow">
              Advanced predictive analytics platform delivering actionable business intelligence through customizable dashboards and automated reporting. Transforms complex data into clear insights that drive strategic growth initiatives.
            </p>
            {/* Placeholder Visual */}
            <div className="mt-auto flex items-center justify-center">
              <Image src="/images/Solutions_SVGs/SVG - Composable infrastructure.svg" alt="InsightIQ Visual" width={250} height={100} className="w-4/5" />
            </div>
          </div>

          {/* Solution Card 3: EngageConnect */}
          <div className="bg-black/20 backdrop-blur-[20px] px-6 pt-6 rounded-[10px] border border-[#3F3F46] text-left flex flex-col h-full">
            <h3 className="text-xl font-normal text-[#FEC213] mb-3 flex items-center">
               {/* Placeholder Icon */} <span className="mr-2">&lt;/&gt;</span> EngageConnect {/* Code Icon */} {/* TODO: Replace icon */}
            </h3>
            <p className="text-[#ECEDEE] text-sm leading-[1.5em] mb-4 flex-grow">
              Omnichannel customer experience solution that personalizes interactions across all touchpoints. Creates meaningful customer conversations that increase satisfaction, loyalty, and lifetime value.
            </p>
            {/* Placeholder Visual */}
            <div className="mt-auto flex items-center justify-center">
              <Image src="/images/Solutions_SVGs/SVG - Customizable brand voice.svg" alt="EngageConnect Visual" width={250} height={100} className="w-4/5" />
            </div>
          </div>

          {/* Solution Card 4: SocialPulse */}
          <div className="bg-black/20 backdrop-blur-[20px] px-6 pt-6 rounded-[10px] border border-[#3F3F46] text-left flex flex-col h-full">
            <h3 className="text-xl font-normal text-[#FEC213] mb-3 flex items-center">
               {/* Placeholder Icon */} <span className="mr-2">&#x25A6;</span> SocialPulse {/* Square Grid Icon */} {/* TODO: Replace icon */}
            </h3>
            <p className="text-[#ECEDEE] text-sm leading-[1.5em] mb-4 flex-grow">
              AI-powered social media intelligence system that creates, optimizes, and analyzes content performance across platforms. Ensures your social presence drives engagement while delivering measurable marketing results.
            </p>
            {/* Placeholder Visual */}
            <div className="mt-auto flex items-center justify-center">
              <Image src="/images/Solutions_SVGs/SVG - Dynamic Content Translation.svg" alt="SocialPulse Visual" width={250} height={100} className="w-4/5" />
            </div>
          </div>

          {/* Solution Card 5: ProspectRadar */}
          <div className="bg-black/20 backdrop-blur-[20px] px-6 pt-6 rounded-[10px] border border-[#3F3F46] text-left flex flex-col h-full">
            <h3 className="text-xl font-normal text-[#FEC213] mb-3 flex items-center">
               {/* Placeholder Icon */} <span className="mr-2">&#x1F3A4;</span> ProspectRadar {/* Microphone Icon */} {/* TODO: Replace icon */}
            </h3>
            <p className="text-[#ECEDEE] text-sm leading-[1.5em] mb-4 flex-grow">
              Intelligent sales development platform that identifies, engages, and qualifies high-value prospects. Accelerates pipeline growth by focusing your sales team on the most promising opportunities.
            </p>
            {/* Placeholder Visual */}
            <div className="mt-auto flex items-center justify-center">
              <Image src="/images/Solutions_SVGs/SVG - Enterprise-grade support.svg" alt="ProspectRadar Visual" width={250} height={100} className="w-4/5" />
            </div>
          </div>

          {/* Solution Card 6: ComplianceGuard */}
          <div className="bg-black/20 backdrop-blur-[20px] px-6 pt-6 rounded-[10px] border border-[#3F3F46] text-left flex flex-col h-full">
            <h3 className="text-xl font-normal text-[#FEC213] mb-3 flex items-center">
               {/* Placeholder Icon */} <span className="mr-2">&#x26D3;</span> ComplianceGuard {/* Chain Icon (Alt) */} {/* TODO: Replace icon */}
            </h3>
            <p className="text-[#ECEDEE] text-sm leading-[1.5em] mb-4 flex-grow">
              Regulatory intelligence solution that monitors requirements, analyzes documents, and mitigates compliance risks. Simplifies complex regulatory landscapes while reducing the resources needed for compliance.
            </p>
            {/* Placeholder Visual */}
            <div className="mt-auto flex items-center justify-center">
              <Image src="/images/Solutions_SVGs/SVG - Git-Native UI Localization.svg" alt="ComplianceGuard Visual" width={250} height={100} className="w-4/5" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="#"
          className="inline-flex items-center justify-center bg-[#FDB813] text-[#0A0A0A] px-8 py-3 rounded-full text-base font-semibold hover:bg-opacity-90 transition-colors"
        >
          Schedule a Solution Discovery Call
          <span className="ml-2">&#8594;</span> {/* Right arrow */}
        </Link>
      </div>
    </section>
  );
};

export default SolutionsSection;