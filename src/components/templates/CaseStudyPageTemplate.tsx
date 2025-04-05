import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Tabs can be added here if needed for a specific case study's 'Solution' section
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CaseStudyPageProps {
  title: string;
  subtitle: string; // Client Name / Industry
  heroImageUrl: string;
  challenge: string | React.ReactNode;
  solution: string | React.ReactNode; // Can be simple text, paragraphs, or more complex JSX (e.g., using Tabs or lists)
  results: { metric: string; value: string; description?: string }[];
  resultsDescription: string | React.ReactNode;
  testimonial?: { quote: string; author: string; title?: string };
}

export default function CaseStudyPageTemplate({
  title,
  subtitle,
  heroImageUrl,
  challenge,
  solution,
  results,
  resultsDescription,
  testimonial,
}: CaseStudyPageProps) {
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
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">{subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Challenge Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">The Challenge</h2>
          <div className="prose lg:prose-lg max-w-none">
            {typeof challenge === 'string' ? <p>{challenge}</p> : challenge}
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">Our Solution</h2>
          <div className="prose lg:prose-lg max-w-none">
            {/* Example: Simple paragraph solution */}
            {typeof solution === 'string' ? <p>{solution}</p> : solution}

            {/* Example: Using Tabs (Uncomment and adapt if needed)
            <Tabs defaultValue="approach" className="w-full">
              <TabsList>
                <TabsTrigger value="approach">Our Approach</TabsTrigger>
                <TabsTrigger value="technology">Technology Used</TabsTrigger>
              </TabsList>
              <TabsContent value="approach">
                Detailed description of the approach...
              </TabsContent>
              <TabsContent value="technology">
                Details about the tech stack...
              </TabsContent>
            </Tabs>
            */}
          </div>
        </section>

        {/* Results Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center">Results &amp; Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {results.map((result) => (
              <Card key={result.metric} className="text-center">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary">{result.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.metric}</p>
                  {result.description ? <p className="text-sm mt-1">{result.description}</p> : null}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="prose lg:prose-lg max-w-none text-center">
             {typeof resultsDescription === 'string' ? <p>{resultsDescription}</p> : resultsDescription}
          </div>
        </section>

        {/* Testimonial Section (Optional) */}
        {testimonial ? (
          <section className="mb-12 bg-muted p-6 rounded-lg border">
            <blockquote className="text-lg italic border-l-4 border-primary pl-4 mb-4">
              &quot;{testimonial.quote}&quot;
            </blockquote>
            <footer className="text-right">
              <p className="font-semibold">{testimonial.author}</p>
              {testimonial.title ? <p className="text-sm text-muted-foreground">{testimonial.title}</p> : null}
            </footer>
          </section>
        ) : null}
      </div>
    </div>
  );
}