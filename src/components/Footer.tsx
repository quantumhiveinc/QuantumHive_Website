import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'X', href: 'https://x.com/QuantumHiveInc', icon: faXTwitter },
    { name: 'GitHub', href: 'https://github.com/quantumhiveinc', icon: faGithub },
    { name: 'Instagram', href: 'https://www.instagram.com/quantumhiveinc/', icon: faInstagram },
  ];

  const sitemapLinks = [
    { name: 'Features', href: '/#solutions' }, // Mapped to Solutions
    { name: 'Pricing', href: '/#pricing' },
    { name: 'FAQs', href: '/#faq' },
  ];

  const resourcesLinks = [
    { name: 'Documentation', href: '#' }, // No specific section yet
    { name: 'AI localization', href: '#' }, // No specific section yet
    { name: 'Launch Week 0', href: '#' }, // No specific section yet
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' }, // No specific page yet
    { name: 'Terms of Service', href: '#' }, // No specific page yet
  ];

  return (
    <footer className="bg-[#0A0A0A] text-[#ECEDEE] relative overflow-hidden pt-16 pb-8 border-t border-[rgba(24,24,27,0.5)]">
      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section: Logo, Address, Links */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
          {/* Left Side: Logo, Address, Social */}
          <div className="flex flex-col gap-4 items-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logos/quantumhive-logo.svg"
                alt="QuantumHive Logo"
                width={180}
                height={30}
              />
            </Link>
            <p className="text-sm font-tt-hoves-pro leading-relaxed">
              1111b South Governors Avenue<br />
              Dover, Delaware,<br />
              19904 US
                         </p>
                         <p className="text-sm font-tt-hoves-pro leading-relaxed mt-2 flex items-center gap-2">
                           <Link href="mailto:hello@quantumhive.us" className="group flex items-center gap-2 hover:text-[#FEC213] transition-colors">
                             <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-white group-hover:text-[#FEC213] transition-colors" />
                             hello@quantumhive.us
                           </Link>
                         </p>
                         <p className="text-sm font-tt-hoves-pro leading-relaxed flex items-center gap-2">
                           <Link href="tel:+17077222212" className="group flex items-center gap-2 hover:text-[#FEC213] transition-colors">
                             <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-white group-hover:text-[#FEC213] transition-colors" />
                             +1 707-722-2212
                           </Link>
                         </p>
                         <div className="flex gap-4 mt-4"> {/* Increased margin-top */}
                           {socialLinks.map((link) => (
                             <Link key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                               <FontAwesomeIcon icon={link.icon} className="w-6 h-6" /> {/* Use FontAwesomeIcon */}
                             </Link>
                           ))}
            </div>
          </div>

          {/* Right Side: Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
            <div>
              <h3 className="text-xl font-tt-hoves-pro mb-4">Sitemap</h3>
              <ul className="space-y-2">
                {sitemapLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base font-tt-hoves-pro hover:text-[#FEC213] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-tt-hoves-pro mb-4">Resources</h3>
              <ul className="space-y-2">
                {resourcesLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base font-tt-hoves-pro hover:text-[#FEC213] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-tt-hoves-pro mb-4">Legal</h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base font-tt-hoves-pro hover:text-[#FEC213] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
      {/* Full Width Logo Section */}
      <div className="w-full px-8 mt-8">
        <Image
          src="/images/icons/quantumhive-logo-footer.svg"
          alt="QuantumHive Footer Logo"
          width={1920} // Set a large base width for full-width scaling
          height={50} // Adjust height as needed, h-auto will maintain aspect ratio
          className="w-full h-auto opacity-30"
        />
      </div>
      {/* Bottom Section: Copyright */}
      <div className="pt-8 mt-8 text-center"> {/* Adjusted margin-top */}
        <p className="text-sm font-tt-hoves-pro">
          © {currentYear} QuantumHive Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;