import type { Metadata } from "next"; // Import Metadata type
import HeroSection from "@/components/HeroSection";
import ClientLogos from "@/components/ClientLogos";
import SolutionsSection from "@/components/SolutionsSection";
import TechStackSection from "@/components/TechStackSection"; // Added import
import TestimonialsSection from "@/components/TestimonialsSection"; // Added import
import BusinessTweetsSection from "@/components/BusinessTweetsSection"; // Added import
import SuccessMetricsSection from "@/components/SuccessMetricsSection"; // Added import
import PricingSection from "@/components/PricingSection"; // Added Pricing section import
import CaseStudiesSection from "@/components/CaseStudiesSection"; // Added Case Studies section import
import FAQSection from "@/components/FAQSection"; // Added FAQ section import
import MeetingSection from "@/components/MeetingSection"; // Added Meeting section import
import PartnersSection from "@/components/PartnersSection"; // Added Partners section import

// Define specific metadata for the homepage
export const metadata: Metadata = {
  title: "Quantum Hive: Enterprise AI Solutions for Mid-Market Growth", // Specific title for home
  description: "Quantum Hive delivers productized AI solutions & AI agents for mid-market companies seeking growth. Accessible, ROI-driven AI development without enterprise complexity.", // Specific description
  alternates: {
    canonical: 'https://www.quantumhive.us/', // Canonical URL for the homepage
  },
  openGraph: {
    title: "Quantum Hive: Enterprise AI Solutions for Mid-Market Growth",
    description: "Productized AI solutions & AI agents for mid-market growth.",
    url: 'https://www.quantumhive.us/',
    siteName: 'Quantum Hive',
    images: [
      {
        url: 'https://www.quantumhive.us/images/og-image.png', // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: 'Quantum Hive Logo and tagline',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Quantum Hive: Enterprise AI Solutions for Mid-Market Growth",
    description: "Productized AI solutions & AI agents for mid-market growth.",
    // siteId: 'YourTwitterSiteID', // Optional: Your Twitter user ID
    creator: '@QuantumHiveInc', // Your Twitter handle
    // creatorId: 'YourTwitterCreatorID', // Optional: Your Twitter user ID
    images: ['https://www.quantumhive.us/images/twitter-image.png'], // Replace with your actual Twitter image path
  },
  // Optional: Add icons, manifest etc. if not handled in layout
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/shortcut-icon.png',
  //   apple: '/apple-icon.png',
  //   other: {
  //     rel: 'apple-touch-icon-precomposed',
  //     url: '/apple-touch-icon-precomposed.png',
  //   },
  // },
  // manifest: '/site.webmanifest',
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <main>
        <HeroSection />
        <ClientLogos />
        <SolutionsSection />
        <TechStackSection /> {/* Added TechStack section */}
        <TestimonialsSection /> {/* Added Testimonials section */}
        <BusinessTweetsSection /> {/* Added Business Tweets section */}
        <SuccessMetricsSection /> {/* Added Success Metrics section */}
        <PricingSection /> {/* Added Pricing section */}
        <CaseStudiesSection /> {/* Added Case Studies section */}
        <MeetingSection /> {/* Added Meeting section */}
        <FAQSection /> {/* Added FAQ section */}
        <PartnersSection /> {/* Added Partners section */}
      </main>
    </div>
  );
}
