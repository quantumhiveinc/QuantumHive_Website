import React from 'react';
import IndustryPageTemplate from '@/components/templates/IndustryPageTemplate';

const ecommerceIndustryData = {
  name: "E-commerce",
  overview: "The e-commerce landscape is highly competitive and constantly evolving. We help online retailers build engaging customer experiences, optimize conversion rates, streamline operations, and leverage data to drive growth in the digital marketplace.",
  challenges: [
    "Providing seamless omnichannel experiences.",
    "Personalizing customer journeys and product recommendations.",
    "Optimizing website performance and scalability for peak traffic.",
    "Integrating various platforms (Payment gateways, CRM, Marketing Automation, Shipping).",
    "Managing inventory across multiple channels.",
    "Ensuring secure online transactions and protecting customer data.",
  ],
  relevantServices: [
    {
      title: "Custom Software Development",
      href: "/services/custom-software-development",
      description: "Building custom e-commerce platforms, mobile apps, and marketplace integrations."
    },
    {
      title: "Cloud Consulting",
      href: "/services/cloud-consulting",
      description: "Architecting scalable and resilient cloud infrastructure for high-traffic online stores."
    },
     {
      title: "Data Analytics & AI",
      href: "/services/data-analytics-ai",
      description: "Analyzing customer behavior, optimizing pricing, and personalizing marketing campaigns."
    },
    {
      title: "Cybersecurity Solutions",
      href: "/services/cybersecurity-solutions",
      description: "Protecting online stores and customer data from fraud and cyber threats."
    },
  ],
  relevantCaseStudies: [
    {
      title: "Scaling E-commerce Platform",
      href: "/case-studies/scaling-ecommerce-platform",
      description: "Architecting a scalable cloud infrastructure for a rapidly growing online store."
    },
    // Add more relevant case studies here if available
  ],
};

export default function EcommerceIndustryPage() {
  return <IndustryPageTemplate industry={ecommerceIndustryData} />;
}