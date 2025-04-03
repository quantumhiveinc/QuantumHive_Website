import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const navLinks = [
    { name: "Services", href: "#" },
    { name: "About", href: "#" },
    { name: "Case Studies", href: "#" },
    { name: "Industries", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Contact", href: "#" },
  ];

  // Placeholder for the repeating banner items
  const bannerItems = ["AI Agents", "AI Development", "AI Agency"];
  const repeatedBannerItems = Array(6).fill(bannerItems).flat(); // Repeat for visual effect

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center border-l border-r border-[#18181B]">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logos/quantumhive-logo.svg"
            alt="QuantumHive Logo"
            width={180} // Adjust as needed
            height={30} // Adjust as needed
            priority
          />
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
           <Link
            href="#"
            className="bg-[#FDB813] text-[#0A0A0A] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors flex items-center"
          >
            Free Consultation
            <span className="ml-1">&#8594;</span> {/* Right arrow */}
          </Link>
          {/* Placeholder for mobile menu button */}
          <button className="md:hidden ml-4 text-gray-300 hover:text-white">
            {/* Icon placeholder */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
      {/* Repeating Yellow Banner with Marquee Animation (Moved inside header) */}
      <div className="bg-[#FDB813] text-[#0A0A0A] py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          {/* Content is duplicated for seamless animation */}
          {repeatedBannerItems.map((item, index) => (
            <span key={`item1-${index}`} className="mx-4 font-medium text-sm">{item}</span>
          ))}
          {repeatedBannerItems.map((item, index) => (
            <span key={`item2-${index}`} className="mx-4 font-medium text-sm">{item}</span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;