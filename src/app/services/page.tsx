// src/app/services/page.tsx
import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next"; // Import Metadata

// Define specific metadata for the services page
export const metadata: Metadata = {
  title: "Our Services | Quantum Hive",
  description: "Explore Quantum Hive's comprehensive technology and consulting services, including cloud solutions, custom software, AI, data analytics, and cybersecurity.",
  alternates: {
    canonical: 'https://www.quantumhive.us/services', // Canonical URL
  },
  openGraph: {
      title: "Quantum Hive Services: Driving Business Growth with Technology",
      description: "Discover our range of services designed to optimize your operations, from cloud consulting to bespoke AI solutions.",
      url: 'https://www.quantumhive.us/services',
      siteName: 'Quantum Hive',
      images: [
        {
          url: 'https://www.quantumhive.us/images/og-image-services.png', // Replace with your actual services OG image path
          width: 1200,
          height: 630,
          alt: 'Quantum Hive Service Offerings',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Quantum Hive Services: Driving Business Growth with Technology",
      description: "Explore cloud, software, AI, and cybersecurity solutions from Quantum Hive.",
      creator: '@QuantumHiveInc',
      images: ['https://www.quantumhive.us/images/twitter-image-services.png'], // Replace with your actual services Twitter image path
    },
};


const services = [
  {
    title: "Cloud Consulting",
    description: "Optimize your cloud strategy and infrastructure for maximum efficiency and scalability.",
    href: "/services/cloud-consulting",
  },
  {
    title: "Custom Software Development",
    description: "Bespoke software solutions tailored precisely to your unique business requirements.",
    href: "/services/custom-software-development",
  },
  {
    title: "Data Analytics & AI",
    description: "Unlock valuable insights from your data and leverage AI for smarter decision-making.",
    href: "/services/data-analytics-ai",
  },
  {
    title: "Cybersecurity Solutions",
    description: "Protect your digital assets with robust security measures and proactive threat mitigation.",
    href: "/services/cybersecurity-solutions",
  },
  // Add more services as needed
];

export default function ServicesIndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      {/* Breadcrumb is intentionally excluded */}
      <main className="flex-grow container mx-auto px-4 py-16"> {/* Added flex-grow and adjusted padding */}
        <h1 className="text-4xl font-bold mb-8 text-center text-[#EDEDED]">Our Services</h1> {/* Adjusted margin and color */}
        <p className="text-lg text-[#A1A1AA] mb-12 text-center max-w-2xl mx-auto"> {/* Adjusted margin and color */}
          We offer a comprehensive range of technology and consulting services designed to help your business thrive in the digital age. Explore our key offerings below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {services.map((service) => (
            <Link href={service.href} key={service.title} passHref className="block h-full"> {/* Added block and h-full to Link */}
              {/* Applied dark theme styles and border */}
              <Card className="h-full flex flex-col bg-[#1A1A1A] border border-[#27272A] hover:border-[#FDE047] transition-colors duration-300 cursor-pointer text-[#EDEDED]">
                <CardHeader>
                  <CardTitle className="text-[#EDEDED]">{service.title}</CardTitle> {/* Ensure title color */}
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-[#A1A1AA]">{service.description}</CardDescription> {/* Ensure description color */}
                </CardContent>
                {/* No CardFooter needed for services like in blog */}
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}