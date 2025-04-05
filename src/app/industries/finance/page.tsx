import React from 'react';
import IndustryPageTemplate from '@/components/templates/IndustryPageTemplate';

const financeIndustryData = {
  name: "Finance",
  overview: "The financial services industry faces constant pressure to innovate, enhance security, and comply with stringent regulations. We partner with banks, investment firms, and fintech companies to develop secure, compliant, and customer-centric technology solutions.",
  challenges: [
    "Meeting complex regulatory requirements (e.g., KYC, AML, Basel III).",
    "Protecting against sophisticated cybersecurity threats and fraud.",
    "Modernizing legacy core banking systems.",
    "Leveraging data analytics for risk management and customer insights.",
    "Developing digital banking and mobile payment solutions.",
    "Integrating with third-party fintech services via APIs.",
  ],
  relevantServices: [
    {
      title: "Cybersecurity Solutions",
      href: "/services/cybersecurity-solutions",
      description: "Providing robust security assessments, threat detection, and compliance support for financial institutions."
    },
    {
      title: "Custom Software Development",
      href: "/services/custom-software-development",
      description: "Building secure trading platforms, loan origination systems, and regulatory reporting tools."
    },
    {
      title: "Data Analytics & AI",
      href: "/services/data-analytics-ai",
      description: "Implementing fraud detection models, credit risk scoring, and algorithmic trading strategies."
    },
    {
      title: "Cloud Consulting",
      href: "/services/cloud-consulting",
      description: "Migrating financial applications to secure and compliant cloud environments."
    },
  ],
  relevantCaseStudies: [
    {
      title: "Securing Financial Data",
      href: "/case-studies/securing-financial-data",
      description: "Implementing robust cybersecurity measures for a leading financial institution."
    },
    // Add more relevant case studies here if available
  ],
};

export default function FinanceIndustryPage() {
  return <IndustryPageTemplate industry={financeIndustryData} />;
}