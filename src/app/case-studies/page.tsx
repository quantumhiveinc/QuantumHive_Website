// src/app/case-studies/page.tsx
import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Breadcrumb from '@/components/Breadcrumb'; // Import Breadcrumb
import type { Metadata } from "next"; // Import Metadata

// Define specific metadata for the case studies page
export const metadata: Metadata = {
  title: "Case Studies | Quantum Hive",
  description: "Discover how Quantum Hive partnered with clients across various industries to deliver impactful AI and software solutions.",
  alternates: {
    canonical: 'https://www.quantumhive.us/case-studies', // Canonical URL
  },
  openGraph: {
      title: "Quantum Hive Case Studies: Real-World Success Stories",
      description: "Explore detailed case studies showcasing how Quantum Hive solves complex challenges with AI and custom software.",
      url: 'https://www.quantumhive.us/case-studies',
      siteName: 'Quantum Hive',
      images: [
        {
          url: 'https://www.quantumhive.us/images/og-image-casestudies.png', // Replace with your actual case studies OG image path
          width: 1200,
          height: 630,
          alt: 'Quantum Hive Case Studies Showcase',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Quantum Hive Case Studies: Real-World Success Stories",
      description: "See how Quantum Hive delivers results with AI and custom software solutions.",
      creator: '@QuantumHiveInc',
      images: ['https://www.quantumhive.us/images/twitter-image-casestudies.png'], // Replace with your actual case studies Twitter image path
    },
};

const caseStudies = [
  {
    title: "Boosting Retail Efficiency",
    description: "How we helped a major retailer streamline operations and improve customer experience.",
    href: "/case-studies/boosting-retail-efficiency",
  },
  {
    title: "Securing Financial Data",
    description: "Implementing robust cybersecurity measures for a leading financial institution.",
    href: "/case-studies/securing-financial-data",
  },
  {
    title: "Scaling E-commerce Platform",
    description: "Architecting a scalable cloud infrastructure for a rapidly growing online store.",
    href: "/case-studies/scaling-ecommerce-platform",
  },
  {
    title: "Optimizing Manufacturing Processes",
    description: "Leveraging data analytics to enhance production efficiency in the manufacturing sector.",
    href: "/case-studies/optimizing-manufacturing",
  },
   {
    title: "Enhancing Healthcare Delivery",
    description: "Developing a custom patient management system for a regional hospital network.",
    href: "/case-studies/enhancing-healthcare-delivery",
  },
  // Add more case studies as needed
];

const breadcrumbItems = [{ label: 'Case Studies' }]; // Define breadcrumb items

export default function CaseStudiesIndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb */}
      <main className="flex-grow container mx-auto px-4 py-16"> {/* Added flex-grow and adjusted padding */}
        <h1 className="text-4xl font-bold mb-8 text-center text-[#EDEDED]">Case Studies</h1> {/* Adjusted margin and color */}
        <p className="text-lg text-[#A1A1AA] mb-12 text-center max-w-2xl mx-auto"> {/* Adjusted margin and color */}
          Discover how we&amp;apos;ve partnered with clients across various industries to deliver impactful results and solve complex challenges.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {caseStudies.map((study) => (
            <Link href={study.href} key={study.title} passHref className="block h-full"> {/* Added block and h-full to Link */}
              {/* Applied dark theme styles and border */}
              <Card className="h-full flex flex-col bg-[#1A1A1A] border border-[#27272A] hover:border-[#FDE047] transition-colors duration-300 cursor-pointer text-[#EDEDED]">
                <CardHeader>
                  <CardTitle className="text-[#EDEDED]">{study.title}</CardTitle> {/* Ensure title color */}
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-[#A1A1AA]">{study.description}</CardDescription> {/* Ensure description color */}
                </CardContent>
                {/* Optional: Add a CardFooter if needed for tags or CTAs */}
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}