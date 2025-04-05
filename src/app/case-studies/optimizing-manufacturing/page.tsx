import React from 'react';
import CaseStudyPageTemplate from '@/components/templates/CaseStudyPageTemplate';

const caseStudyData = {
  title: "Optimizing Manufacturing Processes",
  subtitle: "Industrial Equipment Manufacturer / Manufacturing",
  heroImageUrl: "https://via.placeholder.com/1200x400/f5f0e5/665544?text=Manufacturing+Optimization",
  challenge: "A manufacturer faced challenges with production line bottlenecks, inconsistent quality control, and difficulty in predicting maintenance needs for their machinery, leading to costly downtime.",
  solution: (
    <>
      <p>
        We implemented an Industrial Internet of Things (IIoT) solution combined with data analytics. Sensors were installed on key machinery to collect real-time operational data (temperature, vibration, output rates).
      </p>
      <p>
        This data was streamed to a central platform where we applied machine learning algorithms to:
      </p>
      <ul className="list-disc list-inside my-4">
        <li>Identify patterns preceding equipment failure for predictive maintenance scheduling.</li>
        <li>Analyze production flow to pinpoint and address bottlenecks.</li>
        <li>Monitor quality control parameters in real-time to detect deviations early.</li>
      </ul>
      <p>
        Dashboards provided operators and managers with actionable insights into line performance and equipment health.
      </p>
    </>
  ),
  results: [
    { metric: "Unplanned Downtime", value: "-40%", description: "Reduced costly production stops" },
    { metric: "Production Throughput", value: "+15%", description: "Increased overall output" },
    { metric: "Quality Rejects", value: "-20%", description: "Improved product consistency" },
  ],
  resultsDescription: "The IIoT and analytics solution provided unprecedented visibility into the manufacturing process, enabling proactive maintenance, optimized workflows, and improved product quality.",
  testimonial: {
    quote: "The real-time data and predictive insights have been a game-changer for our production efficiency and maintenance planning.",
    author: "David Lee",
    title: "Plant Manager",
  },
};

export default function OptimizingManufacturingPage() {
  return <CaseStudyPageTemplate {...caseStudyData} />;
}