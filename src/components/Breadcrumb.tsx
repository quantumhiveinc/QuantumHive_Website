// src/components/Breadcrumb.tsx
import Link from 'next/link';
import React from 'react';

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="bg-[#0A0A0A] py-3 px-4 md:px-8 lg:px-16 border-b border-[#27272A]">
      <ol className="flex items-center space-x-2 text-sm text-[#A1A1AA]">
        <li>
          <Link href="/" className="hover:text-[#EDEDED]">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-[#404040]">/</span>
            {/* Corrected conditional rendering and added non-null assertion for href */}
            {item.href && index < items.length - 1 ? (
              <Link href={item.href!} className="hover:text-[#EDEDED]">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[#EDEDED]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;