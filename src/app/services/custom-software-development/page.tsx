import React from 'react';
import ServicePageTemplate from '@/components/templates/ServicePageTemplate';

const serviceData = {
  title: "Custom Software Development",
  heroImageUrl: "https://via.placeholder.com/1200x400/aabbcc/ffffff?text=Software+Development+Hero",
  introduction: "Build tailor-made software solutions designed specifically to meet your unique business processes and challenges. We turn your vision into high-quality, scalable, and maintainable software.",
  features: [
    {
      title: "Web Application Development",
      description: "Creating responsive, feature-rich web applications using modern frameworks and technologies.",
    },
    {
      title: "Mobile Application Development",
      description: "Developing native and cross-platform mobile apps for iOS and Android.",
    },
    {
      title: "API Development & Integration",
      description: "Building robust APIs and integrating disparate systems for seamless data flow.",
    },
    {
      title: "Legacy System Modernization",
      description: "Updating and migrating outdated systems to modern, efficient architectures.",
    },
    {
      title: "Ongoing Support & Maintenance",
      description: "Providing continuous support to ensure your software remains performant and secure.",
    },
  ],
  detailedDescription: (
    <>
      <p>
        Off-the-shelf software often falls short of addressing specific business needs. Our Custom Software Development services focus on understanding your requirements deeply and translating them into functional, user-friendly applications. We follow agile methodologies to ensure flexibility and collaboration throughout the development lifecycle.
      </p>
      <p>
        From initial concept and UI/UX design to development, testing, deployment, and maintenance, our experienced team manages the entire process. We prioritize clean code, scalability, and security, delivering solutions that not only solve today&apos;s problems but are also prepared for future growth.
      </p>
    </>
  ),
  ctaText: "Have a Software Idea?",
  ctaButtonText: "Discuss Your Project",
  ctaButtonLink: "/contact?service=custom-software", // Example link
};

export default function CustomSoftwareDevelopmentPage() {
  return <ServicePageTemplate {...serviceData} />;
}