import React from 'react';
import CaseStudyPageTemplate from '@/components/templates/CaseStudyPageTemplate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs

const caseStudyData = {
  title: "Scaling E-commerce Platform",
  subtitle: "Fast-Growing Online Retailer / E-commerce",
  heroImageUrl: "https://via.placeholder.com/1200x400/e0f0e0/558855?text=E-commerce+Scaling+Hero",
  challenge: "A rapidly growing e-commerce business was experiencing performance issues and downtime during peak traffic periods (e.g., holiday sales) due to limitations in their monolithic server infrastructure.",
  solution: (
    <Tabs defaultValue="architecture" className="w-full mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="architecture">Architecture Overhaul</TabsTrigger>
        <TabsTrigger value="technology">Technology Stack</TabsTrigger>
      </TabsList>
      <TabsContent value="architecture">
        <p className="mt-2">
          We designed and implemented a scalable, microservices-based architecture hosted on AWS. This involved decoupling core functionalities (product catalog, order management, user accounts) into independent services. We utilized AWS services like EC2 Auto Scaling, RDS for databases, S3 for media storage, and CloudFront CDN for faster content delivery. Load balancing was implemented to distribute traffic effectively.
        </p>
      </TabsContent>
      <TabsContent value="technology">
        <p className="mt-2">
          The new architecture leveraged Node.js for backend microservices, React for the frontend, PostgreSQL via AWS RDS, and Docker for containerization managed via Kubernetes (EKS). A CI/CD pipeline using Jenkins and GitHub Actions was established for automated testing and deployment.
        </p>
      </TabsContent>
    </Tabs>
  ),
  results: [
    { metric: "Platform Uptime", value: "99.99%", description: "During peak sales events" },
    { metric: "Page Load Time", value: "-60%", description: "Average reduction across site" },
    { metric: "Scalability", value: "5x Capacity", description: "Handled 5x traffic increase without issues" },
  ],
  resultsDescription: "The migration to a scalable cloud architecture eliminated downtime, significantly improved performance, and provided the capacity for continued growth. The microservices approach also allowed for faster feature development and deployment.",
  // Optional: Add a relevant testimonial if desired
};

export default function ScalingEcommercePage() {
  return <CaseStudyPageTemplate {...caseStudyData} />;
}