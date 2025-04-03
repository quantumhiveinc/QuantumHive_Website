import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="hero-section container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center border-l border-r border-[#18181B]">
      {/* Left Content */}
      <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
        <span className="inline-block bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
          {/* Placeholder for 'Y' icon */}Y Trusted by Fortune 500 companies & innovative startups
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight mb-6">
          Business Growth <br />
          with Enterprise- <br />
          Grade <span className="text-[#FDB813]">AI Solutions</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto md:mx-0">
          Custom AI development and implementation for growing businesses that delivers measurable ROI without enterprise complexity or cost.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link
            href="#"
            className="border border-gray-600 rounded-full px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            Get Free Consultation
            <span className="ml-1">&#8594;</span> {/* Right arrow */}
          </Link>
          <Link
            href="#"
            className="bg-[#FDB813] text-[#0A0A0A] rounded-full px-6 py-3 text-sm font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center"
          >
            Explore Solutions
            <span className="ml-1">&#8594;</span> {/* Right arrow */}
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 flex justify-center md:justify-end">
        <Image
          src="/images/hero/Banner_Molecule_Image.png"
          alt="Abstract 3D Molecule"
          width={500} // Adjust as needed
          height={500} // Adjust as needed
          className="object-contain"
        />
      </div>
    </section>
  );
};

export default HeroSection;