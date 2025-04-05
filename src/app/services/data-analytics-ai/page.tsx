import React from 'react';
import ServicePageTemplate from '@/components/templates/ServicePageTemplate';

const serviceData = {
  title: "Data Analytics & AI",
  heroImageUrl: "https://via.placeholder.com/1200x400/ddeeff/333333?text=Data+&+AI+Hero",
  introduction: "Transform your raw data into actionable insights and leverage the power of Artificial Intelligence to drive innovation, efficiency, and competitive advantage.",
  features: [
    {
      title: "Data Warehousing & ETL",
      description: "Build robust data pipelines and warehouses to consolidate and prepare your data for analysis.",
    },
    {
      title: "Business Intelligence & Reporting",
      description: "Develop interactive dashboards and reports to visualize key metrics and track performance.",
    },
    {
      title: "Predictive Analytics",
      description: "Utilize statistical models and machine learning to forecast trends and predict future outcomes.",
    },
    {
      title: "Machine Learning & AI Solutions",
      description: "Implement custom AI models for tasks like automation, personalization, and anomaly detection.",
    },
    {
      title: "Data Governance & Strategy",
      description: "Establish frameworks and policies for managing data quality, security, and compliance.",
    },
  ],
  detailedDescription: (
    <>
      <p>
        In today&apos;s data-driven world, the ability to extract meaningful insights from vast amounts of information is crucial. Our Data Analytics & AI services help you harness the full potential of your data assets. We work with you to understand your business objectives and apply the right analytical techniques and AI technologies to achieve them.
      </p>
      <p>
        Our team comprises data scientists, engineers, and analysts skilled in various tools and platforms. From setting up foundational data infrastructure to building sophisticated machine learning models, we provide comprehensive solutions that empower you to make smarter, data-informed decisions and automate complex processes.
      </p>
    </>
  ),
  ctaText: "Unlock the Power of Your Data?",
  ctaButtonText: "Explore AI Solutions",
  ctaButtonLink: "/contact?service=data-ai", // Example link
};

export default function DataAnalyticsAIPage() {
  return <ServicePageTemplate {...serviceData} />;
}