import React from 'react';
import CaseStudyPageTemplate from '@/components/templates/CaseStudyPageTemplate';

const caseStudyData = {
  title: "Securing Financial Data",
  subtitle: "Leading Investment Bank / Finance Sector",
  heroImageUrl: "https://via.placeholder.com/1200x400/d5e5f5/444444?text=Financial+Security+Hero",
  challenge: "A major investment bank needed to enhance its cybersecurity posture to meet evolving regulatory requirements (e.g., GDPR, CCPA) and protect sensitive client data from increasingly sophisticated cyber threats.",
  solution: (
    <>
      <p>
        We conducted a comprehensive security audit, identifying critical vulnerabilities in their network infrastructure, applications, and data handling processes. Based on the findings, we implemented a multi-layered security strategy.
      </p>
      <p>
        This involved deploying advanced endpoint detection and response (EDR) solutions, implementing stricter access controls based on the principle of least privilege, enhancing data encryption both at rest and in transit, and establishing a security operations center (SOC) for 24/7 monitoring and threat intelligence. We also provided extensive security awareness training for all employees.
      </p>
    </>
  ),
  results: [
    { metric: "Compliance Score", value: "98%", description: "Achieved target compliance levels" },
    { metric: "Security Incidents", value: "-70%", description: "Significant reduction in detected security breaches" },
    { metric: "Threat Detection Time", value: "<15 Min", description: "Faster identification of potential threats" },
  ],
  resultsDescription: "The enhanced security measures significantly reduced the bank's risk exposure, ensured compliance with key regulations, and strengthened client trust by demonstrating a commitment to data protection.",
  testimonial: {
    quote: "Their team provided invaluable expertise in navigating the complex landscape of financial cybersecurity. We feel much more confident in our ability to protect client data.",
    author: "John Smith",
    title: "Chief Information Security Officer (CISO)",
  },
};

export default function SecuringFinancialDataPage() {
  return <CaseStudyPageTemplate {...caseStudyData} />;
}