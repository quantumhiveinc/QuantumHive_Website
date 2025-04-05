"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  // Check if the path starts with /admin (this includes /admin/login)
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      {children} {/* Render the main page content */}
      {!isAdminRoute && <Footer />}
    </>
  );
}