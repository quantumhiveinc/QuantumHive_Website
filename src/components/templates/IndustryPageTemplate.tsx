import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IndustryInfo {
  name: string;
  overview: string | React.ReactNode;
  challenges: string[]; // List of challenges
  relevantServices: { title: string; href: string; description: string }[];
  relevantCaseStudies: { title: string; href: string; description: string }[];
}

export default function IndustryPageTemplate({
  industry,
}: {
  industry: IndustryInfo;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{industry.name}</h1>
        <div className="prose lg:prose-lg max-w-3xl mx-auto text-muted-foreground">
          {typeof industry.overview === 'string' ? <p>{industry.overview}</p> : industry.overview}
        </div>
      </section>

      {/* Industry Challenges */}
      <section className="mb-12 bg-muted p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">Industry Challenges</h2>
        <ul className="list-disc list-inside space-y-2">
          {industry.challenges.map((challenge, index) => (
            <li key={index}>{challenge}</li>
          ))}
        </ul>
      </section>

      {/* Our Solutions */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Our Solutions for {industry.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industry.relevantServices.map((service) => (
            <Link href={service.href} key={service.title} passHref>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Relevant Case Studies */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Relevant Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industry.relevantCaseStudies.map((study) => (
            <Link href={study.href} key={study.title} passHref>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle>{study.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{study.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}