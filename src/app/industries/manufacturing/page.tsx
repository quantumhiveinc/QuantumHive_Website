import React from 'react';
import IndustryPageTemplate from '@/components/templates/IndustryPageTemplate';

const manufacturingIndustryData = {
  name: "Manufacturing",
  overview: "The manufacturing sector is embracing Industry 4.0, leveraging automation, IoT, and data analytics to create smarter factories, optimize supply chains, and improve product quality. We provide technology solutions to help manufacturers enhance productivity, reduce costs, and stay competitive.",
  challenges: [
    "Integrating Operational Technology (OT) with Information Technology (IT).",
    "Implementing Industrial IoT (IIoT) for real-time monitoring and control.",
    "Optimizing supply chain visibility and logistics.",
    "Predictive maintenance for machinery to minimize downtime.",
    "Ensuring cybersecurity for connected factory environments.",
    "Analyzing production data to improve efficiency and quality.",
  ],
  relevantServices: [
    {
      title: "Data Analytics & AI",
      href: "/services/data-analytics-ai",
      description: "Implementing predictive maintenance, quality control analysis, and process optimization using production data."
    },
    {
      title: "Custom Software Development",
      href: "/services/custom-software-development",
      description: "Developing MES (Manufacturing Execution Systems), SCADA interfaces, and custom IIoT platforms."
    },
    {
      title: "Cloud Consulting",
      href: "/services/cloud-consulting",
      description: "Building cloud infrastructure for data collection, storage, and analysis from manufacturing operations."
    },
    {
      title: "Cybersecurity Solutions",
      href: "/services/cybersecurity-solutions",
      description: "Securing OT and IT networks, protecting industrial control systems (ICS)."
    },
  ],
  relevantCaseStudies: [
    {
      title: "Optimizing Manufacturing Processes",
      href: "/case-studies/optimizing-manufacturing",
      description: "Leveraging data analytics to enhance production efficiency in the manufacturing sector."
    },
    // Add more relevant case studies here if available
  ],
};

export default function ManufacturingIndustryPage() {
  return <IndustryPageTemplate industry={manufacturingIndustryData} />;
}