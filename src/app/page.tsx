import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ClientLogos from "@/components/ClientLogos";
import SolutionsSection from "@/components/SolutionsSection";
import TechStackSection from "@/components/TechStackSection"; // Added import
import TestimonialsSection from "@/components/TestimonialsSection"; // Added import
import Footer from "@/components/Footer";
import BusinessTweetsSection from "@/components/BusinessTweetsSection"; // Added import
import SuccessMetricsSection from "@/components/SuccessMetricsSection"; // Added import
import PricingSection from "@/components/PricingSection"; // Added Pricing section import
import CaseStudiesSection from "@/components/CaseStudiesSection"; // Added Case Studies section import
import FAQSection from "@/components/FAQSection"; // Added FAQ section import
import MeetingSection from "@/components/MeetingSection"; // Added Meeting section import
import PartnersSection from "@/components/PartnersSection"; // Added Partners section import
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <Header />
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
      <Footer />
    </div>
  );
}
