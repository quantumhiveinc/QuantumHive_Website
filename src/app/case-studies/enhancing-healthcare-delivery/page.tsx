import React from 'react';
import CaseStudyPageTemplate from '@/components/templates/CaseStudyPageTemplate';

const caseStudyData = {
  title: "Enhancing Healthcare Delivery",
  subtitle: "Regional Hospital Network / Healthcare",
  heroImageUrl: "https://via.placeholder.com/1200x400/e8f8f8/448888?text=Healthcare+Delivery+Hero",
  challenge: "A hospital network struggled with fragmented patient records stored across disparate legacy systems, hindering efficient patient care coordination and reporting.",
  solution: (
    <>
      <p>
        We developed a custom, HIPAA-compliant Electronic Health Record (EHR) system consolidation platform. The project involved:
      </p>
      <ul className="list-disc list-inside my-4">
        <li>Designing a unified data model to accommodate records from various legacy systems.</li>
        <li>Developing secure data migration tools to transfer patient history accurately.</li>
        <li>Building a web-based interface for clinicians with role-based access control.</li>
        <li>Integrating the platform with existing scheduling and billing systems via HL7 interfaces.</li>
        <li>Implementing robust auditing and security measures to ensure HIPAA compliance.</li>
      </ul>
      <p>
        The platform provided a single source of truth for patient information, accessible securely across the network.
      </p>
    </>
  ),
  results: [
    { metric: "Record Access Time", value: "-80%", description: "Faster access to complete patient history" },
    { metric: "Data Entry Errors", value: "-60%", description: "Reduced errors from manual consolidation" },
    { metric: "HIPAA Compliance", value: "100%", description: "Met all required security standards" },
  ],
  resultsDescription: "The consolidated platform streamlined clinical workflows, improved data accuracy, enhanced patient safety through better information access, and ensured full compliance with healthcare regulations.",
  testimonial: {
    quote: "Having a unified view of patient records has significantly improved our care coordination and efficiency. The system is secure, compliant, and user-friendly for our staff.",
    author: "Dr. Emily Carter",
    title: "Chief Medical Officer",
  },
};

export default function EnhancingHealthcarePage() {
  return <CaseStudyPageTemplate {...caseStudyData} />;
}