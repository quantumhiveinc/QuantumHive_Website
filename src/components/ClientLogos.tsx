import Image from "next/image";

const ClientLogos = () => {
  const clientLogos = [
    { name: "Evrythink", src: "/images/logos/evrythink.svg", alt: "Evrythink Logo" },
    { name: "Papermark", src: "/images/logos/papermark.svg", alt: "Papermark Logo" },
    { name: "IDA", src: "/images/logos/ida.svg", alt: "International Drivers Association Logo" },
    { name: "Truely", src: "/images/logos/truely.svg", alt: "Truely Logo" },
    { name: "Cal.com", src: "/images/logos/calcom.svg", alt: "Cal.com Logo" },
    { name: "Mistral", src: "/images/logos/mistral.svg", alt: "Mistral AI Logo" },
    { name: "Captions", src: "/images/logos/captions.svg", alt: "Captions Logo" },
  ];

  return (
    <section className="client-logos-section border-t border-b border-[#18181B]"> {/* Removed container, border-l, border-r classes */}
      <div className="container mx-auto px-6 py-12 border-l border-r border-[#18181B]"> {/* Added container, border-l, border-r classes */}
        {/* Removed inner section tag for better semantics */}
        <div className="relative overflow-hidden whitespace-nowrap"> {/* Changed inner section to div */}
        {/* Left Fade */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none z-10"></div>
        {/* Right Fade */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none z-10"></div>

        {/* Scrolling Logos */}
        <div className="inline-block animate-marquee">
          {/* Logos duplicated for seamless animation */}
          {[...clientLogos, ...clientLogos].map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="inline-block mx-8 align-middle">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120} // Adjust as needed
                height={30} // Adjust as needed
                className="filter grayscale hover:filter-none transition-all duration-300 ease-in-out opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>
        </div> {/* Changed inner section to div */}
      </div> {/* Closing container div */}
    </section>
  );
};

export default ClientLogos;