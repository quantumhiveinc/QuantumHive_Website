import React from 'react';
import CaseStudyPageTemplate from '@/components/templates/CaseStudyPageTemplate';

const caseStudyData = {
  title: "Boosting Retail Efficiency",
  subtitle: "Major Retail Chain / Retail Sector",
  heroImageUrl: "https://via.placeholder.com/1200x400/eeeeee/777777?text=Retail+Efficiency+Hero",
  challenge: "A leading retail chain faced significant operational inefficiencies due to outdated inventory management systems and disconnected point-of-sale (POS) data. This resulted in stockouts, overstocking, and a fragmented customer view.",
  solution: (
    <>
      <p>
        We implemented a modern, cloud-based inventory management system integrated seamlessly with their existing POS infrastructure. Key steps included:
      </p>
      <ul className="list-disc list-inside my-4">
        <li>Developing custom middleware for real-time data synchronization between POS terminals and the central inventory database.</li>
        <li>Migrating historical sales and inventory data to the new platform.</li>
        <li>Building custom reporting dashboards for store managers and corporate headquarters to monitor stock levels, sales trends, and identify slow-moving items.</li>
        <li>Training staff on the new system and processes.</li>
      </ul>
      <p>
        The solution provided a unified view of inventory across all locations and enabled automated reordering processes.
      </p>
    </>
  ),
  results: [
    { metric: "Inventory Accuracy", value: "+35%", description: "Improved accuracy across all stores" },
    { metric: "Stockouts Reduced", value: "-25%", description: "Fewer instances of popular items being unavailable" },
    { metric: "Reporting Time", value: "-50%", description: "Faster generation of sales and inventory reports" },
  ],
  resultsDescription: "The new system significantly enhanced operational efficiency, reduced manual effort, and provided valuable insights for better stock management and purchasing decisions, ultimately improving the customer experience.",
  testimonial: {
    quote: "The integrated system transformed our inventory management. We now have real-time visibility, which has drastically reduced stock issues and improved our planning.",
    author: "Jane Doe",
    title: "VP of Operations, Retail Chain Inc.",
  },
};

export default function BoostingRetailEfficiencyPage() {
  return <CaseStudyPageTemplate {...caseStudyData} />;
}