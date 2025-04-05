import React from 'react';
import IndustryPageTemplate from '@/components/templates/IndustryPageTemplate';

const educationIndustryData = {
  name: "Education",
  overview: "Technology is reshaping education, enabling personalized learning experiences, improving administrative efficiency, and expanding access to knowledge. We work with educational institutions and EdTech companies to develop innovative solutions for modern learning environments.",
  challenges: [
    "Integrating technology effectively into the curriculum.",
    "Providing equitable access to digital learning tools.",
    "Managing student data securely and ensuring privacy (e.g., FERPA).",
    "Developing engaging online learning platforms and content.",
    "Streamlining administrative processes (admissions, grading, communication).",
    "Training educators to utilize new technologies effectively.",
  ],
  relevantServices: [
    {
      title: "Custom Software Development",
      href: "/services/custom-software-development",
      description: "Building Learning Management Systems (LMS), student information systems (SIS), and educational apps."
    },
    {
      title: "Cloud Consulting",
      href: "/services/cloud-consulting",
      description: "Deploying scalable cloud infrastructure for online learning platforms and resource sharing."
    },
    {
      title: "Data Analytics & AI",
      href: "/services/data-analytics-ai",
      description: "Analyzing student performance data for personalized learning paths and identifying at-risk students."
    },
     {
      title: "Cybersecurity Solutions",
      href: "/services/cybersecurity-solutions",
      description: "Protecting student data and securing online learning environments."
    },
  ],
  relevantCaseStudies: [
    // Add relevant case studies here if available (e.g., LMS implementation, student portal development)
    {
      title: "Developing an Online Learning Platform", // Placeholder
      href: "#", // Placeholder
      description: "Created a scalable and interactive platform for remote learning." // Placeholder
    }
  ],
};

export default function EducationIndustryPage() {
  return <IndustryPageTemplate industry={educationIndustryData} />;
}