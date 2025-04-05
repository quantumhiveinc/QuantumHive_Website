import React from 'react';
import ServicePageTemplate from '@/components/templates/ServicePageTemplate';

const serviceData = {
  title: "Cloud Consulting",
  heroImageUrl: "https://via.placeholder.com/1200x400/cccccc/888888?text=Cloud+Consulting+Hero",
  introduction: "Navigate the complexities of the cloud with confidence. Our expert consultants help you design, implement, and manage cloud solutions that align with your business goals, optimize costs, and enhance scalability.",
  features: [
    {
      title: "Cloud Strategy & Roadmap",
      description: "Develop a clear vision for your cloud adoption journey, identifying the right platforms and migration strategies.",
    },
    {
      title: "Infrastructure Design & Deployment",
      description: "Architect secure, scalable, and resilient cloud environments on AWS, Azure, or GCP.",
    },
    {
      title: "Cloud Migration Services",
      description: "Seamlessly migrate your applications, data, and workloads to the cloud with minimal disruption.",
    },
    {
      title: "Cost Optimization",
      description: "Analyze your cloud spending and implement strategies to reduce costs while maintaining performance.",
    },
    {
      title: "Cloud Security & Compliance",
      description: "Ensure your cloud infrastructure meets industry best practices and compliance requirements.",
    },
  ],
  detailedDescription: (
    <>
      <p>
        Leveraging the cloud effectively requires more than just lifting and shifting applications. Our Cloud Consulting services provide end-to-end guidance, from initial assessment and strategy development to implementation, optimization, and ongoing management. We partner with you to understand your specific needs and challenges, ensuring your cloud investment delivers tangible business value.
      </p>
      <p>
        Whether you are new to the cloud, looking to optimize an existing environment, or planning a complex migration, our certified experts bring deep technical knowledge and practical experience across major cloud platforms. We focus on building solutions that are not only technologically sound but also cost-effective, secure, and aligned with your long-term objectives.
      </p>
    </>
  ),
  ctaText: "Ready to Optimize Your Cloud Strategy?",
  ctaButtonText: "Get a Consultation",
  ctaButtonLink: "/contact?service=cloud-consulting", // Example link
};

export default function CloudConsultingPage() {
  return <ServicePageTemplate {...serviceData} />;
}