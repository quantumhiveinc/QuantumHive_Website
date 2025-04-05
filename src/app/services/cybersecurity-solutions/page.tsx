import React from 'react';
import ServicePageTemplate from '@/components/templates/ServicePageTemplate';

const serviceData = {
  title: "Cybersecurity Solutions",
  heroImageUrl: "https://via.placeholder.com/1200x400/ffdddd/555555?text=Cybersecurity+Hero",
  introduction: "Protect your critical digital assets from evolving threats with our comprehensive cybersecurity services. We help you build a resilient security posture to safeguard your data, reputation, and operations.",
  features: [
    {
      title: "Security Assessment & Audit",
      description: "Identify vulnerabilities and compliance gaps in your infrastructure and applications.",
    },
    {
      title: "Managed Security Services (MSSP)",
      description: "24/7 monitoring, threat detection, and incident response to protect your environment.",
    },
    {
      title: "Penetration Testing",
      description: "Simulate real-world attacks to uncover weaknesses before malicious actors do.",
    },
    {
      title: "Compliance & Governance",
      description: "Achieve and maintain compliance with industry standards like GDPR, HIPAA, SOC 2.",
    },
    {
      title: "Security Awareness Training",
      description: "Educate your employees to recognize and avoid common cyber threats like phishing.",
    },
  ],
  detailedDescription: (
    <>
      <p>
        In an era of increasing cyber threats, a proactive and robust security strategy is non-negotiable. Our Cybersecurity Solutions provide multi-layered protection tailored to your specific risk profile and business context. We go beyond simply installing tools; we partner with you to develop and implement a holistic security program.</p>
      <p>
        Our team of certified security professionals utilizes industry-leading technologies and methodologies to defend against threats, ensure regulatory compliance, and minimize the impact of potential breaches. From initial risk assessments to ongoing monitoring and incident response, we provide the expertise you need to operate securely and confidently.</p>
    </>
  ),
  ctaText: "Concerned About Your Security Posture?",
  ctaButtonText: "Request a Security Audit",
  ctaButtonLink: "/contact?service=cybersecurity", // Example link
};

export default function CybersecuritySolutionsPage() {
  return <ServicePageTemplate {...serviceData} />;
}