// src/app/industries/page.tsx
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

// Define specific metadata for the industries page
export const metadata: Metadata = {
  title: "Industries We Serve | Quantum Hive",
  description: "Quantum Hive provides tailored AI and software solutions for Healthcare, E-commerce, Manufacturing, Finance, and Education sectors.",
  alternates: {
    canonical: 'https://www.quantumhive.us/industries', // Canonical URL
  },
  openGraph: {
      title: "Quantum Hive: Industry-Specific AI &amp; Software Solutions",
      description: "Expertise in Healthcare, E-commerce, Manufacturing, Finance, and Education. Discover tailored tech solutions.",
      url: 'https://www.quantumhive.us/industries',
      siteName: 'Quantum Hive',
      images: [
        {
          url: 'https://www.quantumhive.us/images/og-image-industries.png', // Replace with your actual industries OG image path
          width: 1200,
          height: 630,
          alt: 'Quantum Hive Industry Expertise',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Quantum Hive: Industry-Specific AI &amp; Software Solutions",
      description: "Tailored tech solutions for Healthcare, E-commerce, Manufacturing, Finance, and Education.",
      creator: '@QuantumHiveInc',
      images: ['https://www.quantumhive.us/images/twitter-image-industries.png'], // Replace with your actual industries Twitter image path
    },
};


const industries = [
  {
    title: "Healthcare",
    description: "Innovative solutions for patient care, data management, and operational efficiency.",
    href: "/industries/healthcare",
  },
  {
    title: "E-commerce",
    description: "Building scalable and engaging online retail experiences.",
    href: "/industries/ecommerce",
  },
  {
    title: "Manufacturing",
    description: "Optimizing production lines and supply chains with smart technology.",
    href: "/industries/manufacturing",
  },
  {
    title: "Finance",
    description: "Secure and compliant technology solutions for the financial sector.",
    href: "/industries/finance",
  },
   {
    title: "Education",
    description: "Enhancing learning experiences and administrative processes with EdTech.",
    href: "/industries/education",
  },
  // Add more industries as needed
];

const breadcrumbItems = [{ label: 'Industries' }]; // Define breadcrumb items

export default function IndustriesIndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb */}
      <main className="flex-grow container mx-auto px-4 py-16"> {/* Added flex-grow and adjusted padding */}
        <h1 className="text-4xl font-bold mb-8 text-center text-[#EDEDED]">Industries We Serve</h1> {/* Adjusted margin and color */}
        <p className="text-lg text-[#A1A1AA] mb-12 text-center max-w-2xl mx-auto"> {/* Adjusted margin and color */}
          We possess deep expertise across a diverse range of industries, enabling us to provide tailored solutions that address specific sector challenges and opportunities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {industries.map((industry) => (
            <Link href={industry.href} key={industry.title} passHref className="block h-full"> {/* Added block and h-full to Link */}
              {/* Applied dark theme styles and border */}
              <Card className="h-full flex flex-col bg-[#1A1A1A] border border-[#27272A] hover:border-[#FDE047] transition-colors duration-300 cursor-pointer text-[#EDEDED]">
                <CardHeader>
                  <CardTitle className="text-[#EDEDED]">{industry.title}</CardTitle> {/* Ensure title color */}
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-[#A1A1AA]">{industry.description}</CardDescription> {/* Ensure description color */}
                </CardContent>
                 {/* Optional: Add a CardFooter if needed */}
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}