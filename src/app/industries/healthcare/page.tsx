import React from 'react';
import IndustryPageTemplate from '@/components/templates/IndustryPageTemplate';

const healthcareIndustryData = {
  name: "Healthcare",
  overview: "The healthcare industry is undergoing rapid transformation driven by technological advancements, changing patient expectations, and evolving regulatory landscapes. We help healthcare organizations navigate these complexities to improve patient outcomes, enhance operational efficiency, and ensure compliance.",
  challenges: [
    "Integrating disparate legacy systems (EHR, Billing, Scheduling).",
    "Ensuring data security and HIPAA compliance.",
    "Improving patient engagement and experience.",
    "Leveraging data analytics for clinical insights and operational improvements.",
    "Adopting telehealth and remote patient monitoring solutions.",
    "Managing complex regulatory requirements.",
  ],
  relevantServices: [
    {
      title: "Custom Software Development",
      href: "/services/custom-software-development",
      description: "Building HIPAA-compliant EHR/EMR systems, patient portals, and telehealth platforms."
    },
    {
      title: "Data Analytics & AI",
      href: "/services/data-analytics-ai",
      description: "Analyzing clinical and operational data for predictive insights and improved decision-making."
    },
    {
      title: "Cloud Consulting",
      href: "/services/cloud-consulting",
      description: "Migrating healthcare systems to secure cloud environments (AWS, Azure, GCP)."
    },
    {
      title: "Cybersecurity Solutions",
      href: "/services/cybersecurity-solutions",
      description: "Implementing robust security measures to protect sensitive patient health information (PHI)."
    },
  ],
  relevantCaseStudies: [
     {
      title: "Enhancing Healthcare Delivery",
      href: "/case-studies/enhancing-healthcare-delivery",
      description: "Developing a custom patient management system for a regional hospital network."
    },
    // Add more relevant case studies here if available
  ],
};

export default function HealthcareIndustryPage() {
  return <IndustryPageTemplate industry={healthcareIndustryData} />;
}