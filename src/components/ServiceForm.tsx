// src/components/ServiceForm.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Define the shape of the service data based on the requested structure
export interface ServiceFormData {
  title: string; // Keep as main service title
  slug: string;
  description: string; // Keep as a short summary/excerpt

  // Hero Section
  heroHeadline: string;
  heroSubheading: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroImageUrl: string;

  // Problem Statement
  problemStatement: string;

  // Service Overview
  serviceOverview: string; // Use textarea for bullet points/icons description

  // Benefits
  benefits: string; // Use textarea for benefits description

  // How It Works (Process)
  process: string; // Use textarea for process steps

  // Social Proof
  socialProof: string; // Use textarea for testimonials, case studies, logos info

  // Detailed Service Descriptions
  detailedServices: string; // Use textarea for detailed descriptions

  // Call-to-Actions (CTAs)
  ctaSection: string; // Use textarea for additional CTAs info

  // FAQ Section
  faq: string; // Use textarea for Q&A pairs

  // Contact Information
  contactInfo: string; // Use textarea for contact details

  // SEO Meta Tags
  metaTitle: string;
  metaDescription: string;
}

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData>; // Optional initial data for editing
  onSave: (data: ServiceFormData) => Promise<void>; // Callback for saving
  onCancel: () => void; // Callback for canceling
}

export default function ServiceForm({ initialData = {}, onSave, onCancel }: ServiceFormProps) {
  // Basic Info State
  const [title, setTitle] = useState(initialData.title || '');
  const [slug, setSlug] = useState(initialData.slug || '');
  const [description, setDescription] = useState(initialData.description || ''); // Short summary

  // Hero Section State
  const [heroHeadline, setHeroHeadline] = useState(initialData.heroHeadline || '');
  const [heroSubheading, setHeroSubheading] = useState(initialData.heroSubheading || '');
  const [heroCtaText, setHeroCtaText] = useState(initialData.heroCtaText || '');
  const [heroCtaLink, setHeroCtaLink] = useState(initialData.heroCtaLink || '');
  const [heroImageUrl, setHeroImageUrl] = useState(initialData.heroImageUrl || '');

  // Other Sections State
  const [problemStatement, setProblemStatement] = useState(initialData.problemStatement || '');
  const [serviceOverview, setServiceOverview] = useState(initialData.serviceOverview || '');
  const [benefits, setBenefits] = useState(initialData.benefits || '');
  const [process, setProcess] = useState(initialData.process || '');
  const [socialProof, setSocialProof] = useState(initialData.socialProof || '');
  const [detailedServices, setDetailedServices] = useState(initialData.detailedServices || '');
  const [ctaSection, setCtaSection] = useState(initialData.ctaSection || '');
  const [faq, setFaq] = useState(initialData.faq || '');
  const [contactInfo, setContactInfo] = useState(initialData.contactInfo || '');

  // SEO State
  const [metaTitle, setMetaTitle] = useState(initialData.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData.metaDescription || '');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update state if initialData changes (useful for edit forms)
  useEffect(() => {
    if (initialData) {
      // Basic
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setDescription(initialData.description || '');

      // Hero
      setHeroHeadline(initialData.heroHeadline || '');
      setHeroSubheading(initialData.heroSubheading || '');
      setHeroCtaText(initialData.heroCtaText || '');
      setHeroCtaLink(initialData.heroCtaLink || '');
      setHeroImageUrl(initialData.heroImageUrl || '');

      // Other Sections
      setProblemStatement(initialData.problemStatement || '');
      setServiceOverview(initialData.serviceOverview || '');
      setBenefits(initialData.benefits || '');
      setProcess(initialData.process || '');
      setSocialProof(initialData.socialProof || '');
      setDetailedServices(initialData.detailedServices || '');
      setCtaSection(initialData.ctaSection || '');
      setFaq(initialData.faq || '');
      setContactInfo(initialData.contactInfo || '');

      // SEO
      setMetaTitle(initialData.metaTitle || '');
      setMetaDescription(initialData.metaDescription || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Pass all form data to the onSave handler
      await onSave({
        title, slug, description,
        heroHeadline, heroSubheading, heroCtaText, heroCtaLink, heroImageUrl,
        problemStatement, serviceOverview, benefits, process, socialProof,
        detailedServices, ctaSection, faq, contactInfo,
        metaTitle, metaDescription
      });
      // Success handling (e.g., redirect) is managed by the parent component via onSave
    } catch (error) {
      console.error("Error during save operation:", error);
      // Error handling (e.g., showing a toast) should ideally be managed by the parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Basic Info */}
      <fieldset className="border p-4 rounded-md space-y-4">
        <legend className="text-lg font-semibold px-2">Basic Information</legend>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Service Title:</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug:</label>
          <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="e.g., ai-development-services" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Short Description (Excerpt):</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* Hero Section Fields */}
      <fieldset className="border p-4 rounded-md space-y-4">
        <legend className="text-lg font-semibold px-2">Hero Section</legend>
        <div>
          <label htmlFor="heroHeadline" className="block text-sm font-medium text-gray-700">Headline:</label>
          <input id="heroHeadline" type="text" value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="heroSubheading" className="block text-sm font-medium text-gray-700">Subheading:</label>
          <textarea id="heroSubheading" value={heroSubheading} onChange={(e) => setHeroSubheading(e.target.value)} rows={2} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="heroCtaText" className="block text-sm font-medium text-gray-700">CTA Button Text:</label>
          <input id="heroCtaText" type="text" value={heroCtaText} onChange={(e) => setHeroCtaText(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
         <div>
          <label htmlFor="heroCtaLink" className="block text-sm font-medium text-gray-700">CTA Button Link:</label>
          <input id="heroCtaLink" type="text" value={heroCtaLink} onChange={(e) => setHeroCtaLink(e.target.value)} required placeholder="e.g., /contact or https://example.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="heroImageUrl" className="block text-sm font-medium text-gray-700">Image URL:</label>
          <input id="heroImageUrl" type="text" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} placeholder="e.g., /images/hero.jpg or https://..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* Problem Statement */}
      <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">Problem Statement</legend>
        <div>
          <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700">Describe the Problem:</label>
          <textarea id="problemStatement" value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* Service Overview */}
       <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">Service Overview</legend>
        <div>
          <label htmlFor="serviceOverview" className="block text-sm font-medium text-gray-700">Overview of Services Offered:</label>
          <textarea id="serviceOverview" value={serviceOverview} onChange={(e) => setServiceOverview(e.target.value)} rows={5} required placeholder="Use bullet points or clear descriptions..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* Benefits */}
      <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">Benefits</legend>
        <div>
          <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Key Benefits:</label>
          <textarea id="benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} rows={5} required placeholder="List key advantages..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* How It Works (Process) */}
      <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">How It Works (Process)</legend>
        <div>
          <label htmlFor="process" className="block text-sm font-medium text-gray-700">Process Steps:</label>
          <textarea id="process" value={process} onChange={(e) => setProcess(e.target.value)} rows={5} required placeholder="Outline your workflow steps..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* Social Proof */}
      <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">Social Proof</legend>
        <div>
          <label htmlFor="socialProof" className="block text-sm font-medium text-gray-700">Testimonials/Case Studies/Logos:</label>
          <textarea id="socialProof" value={socialProof} onChange={(e) => setSocialProof(e.target.value)} rows={5} placeholder="Include testimonials, case study snippets, or client logos info..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* Detailed Service Descriptions */}
      <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">Detailed Service Descriptions</legend>
        <div>
          <label htmlFor="detailedServices" className="block text-sm font-medium text-gray-700">Detailed Descriptions:</label>
          <textarea id="detailedServices" value={detailedServices} onChange={(e) => setDetailedServices(e.target.value)} rows={8} required placeholder="Provide details for each specific service offered..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* Call-to-Actions (CTAs) */}
      <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">Additional CTAs</legend>
        <div>
          <label htmlFor="ctaSection" className="block text-sm font-medium text-gray-700">Other Call-to-Actions:</label>
          <textarea id="ctaSection" value={ctaSection} onChange={(e) => setCtaSection(e.target.value)} rows={4} placeholder="Add details for other CTAs on the page (e.g., 'Schedule a Demo' button text and link)..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* FAQ Section */}
      <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">FAQ Section</legend>
        <div>
          <label htmlFor="faq" className="block text-sm font-medium text-gray-700">Frequently Asked Questions:</label>
          <textarea id="faq" value={faq} onChange={(e) => setFaq(e.target.value)} rows={6} placeholder="Format as Q&A pairs (e.g., Q: Question?\nA: Answer.)..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* Contact Information */}
      <fieldset className="border p-4 rounded-md space-y-4">
         <legend className="text-lg font-semibold px-2">Contact Information</legend>
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">Contact Details:</label>
          <textarea id="contactInfo" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} rows={4} placeholder="Contact form details, phone, email, social media links..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </fieldset>

      {/* SEO Meta Tags Section */}
      <fieldset className="border p-4 rounded-md space-y-4 mt-6">
        <legend className="text-lg font-semibold px-2">SEO Meta Tags</legend>
        <div>
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">Meta Title:</label>
          <input id="metaTitle" type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} required maxLength={70} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters. Current: {metaTitle.length}</p>
        </div>
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">Meta Description:</label>
          <textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} required maxLength={160} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
           <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters. Current: {metaDescription.length}</p>
        </div>
      </fieldset>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (initialData?.title ? 'Update Service' : 'Create Service')}
        </button>
      </div>
    </form>
  );
}