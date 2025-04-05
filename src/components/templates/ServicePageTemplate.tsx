import React from 'react';
import Image from 'next/image'; // Using next/image for potential optimization
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ServicePageProps {
  title: string;
  heroImageUrl: string;
  introduction: string;
  features: { title: string; description: string }[];
  detailedDescription: string | React.ReactNode; // Allow for JSX in description
  ctaText: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export default function ServicePageTemplate({
  title,
  heroImageUrl,
  introduction,
  features,
  detailedDescription,
  ctaText,
  ctaButtonText,
  ctaButtonLink,
}: ServicePageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 mb-8 overflow-hidden rounded-lg">
        <Image
          src={heroImageUrl}
          alt={`${title} Hero Image`}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4">
            {title}
          </h1>
        </div>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center">
          {introduction}
        </p>
      </section>

      {/* Key Features/Benefits */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Key Features &amp; Benefits</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <AccordionItem value={`item-${index}`} key={feature.title}>
              <AccordionTrigger className="text-xl">{feature.title}</AccordionTrigger>
              <AccordionContent className="text-base">
                {feature.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Detailed Description */}
      <section className="mb-12 prose lg:prose-xl max-w-none mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Detailed Overview</h2>
        {typeof detailedDescription === 'string' ? <p>{detailedDescription}</p> : detailedDescription}
      </section>

      {/* Call to Action */}
      <section className="text-center bg-secondary text-secondary-foreground p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">{ctaText}</h2>
        <Button asChild size="lg">
          <a href={ctaButtonLink}>{ctaButtonText}</a>
        </Button>
      </section>
    </div>
  );
}