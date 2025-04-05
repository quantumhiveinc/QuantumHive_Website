import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from 'next/headers'; // Import headers
import "./globals.css";
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer
import Script from 'next/script'; // Import Script component
import AuthProvider from '@/components/AuthProvider'; // Import AuthProvider
import { Toaster } from "sonner"; // Import Toaster directly
const ttHovesPro = localFont({
  src: [
    {
      path: "../../public/fonts/TT-Hoves-Pro/TT-Hoves-Pro-normal-400-100.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TT-Hoves-Pro/TT-Hoves-Pro-normal-500-100.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/TT-Hoves-Pro/TT-Hoves-Pro-normal-600-100.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-tt-hoves-pro",
});

export const metadata: Metadata = {
  title: "Quantum Hive: Enterprise AI Solutions for Mid-Market Growth",
  description: "Quantum Hive delivers productized AI solutions for mid-market companies. Get accessible, ROI-driven AI development without enterprise complexity. Explore AI agents.",
};

export default async function RootLayout({ // Keep async
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers(); // Add await
  // Read the custom header set by the middleware
  const pathname = headerList.get('x-pathname') || '';
  // Check if the path starts with /admin (this includes /admin/login)
  const isAdminRoute = pathname.startsWith('/admin');
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${ttHovesPro.variable} font-sans antialiased flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED]`}
      >
        <AuthProvider> {/* Wrap content with AuthProvider */}
          {!isAdminRoute && <Header />} {/* Conditionally render Header */}
          <main className="flex-grow">{children}</main> {/* Wrap children in main for semantic structure and flex-grow */}
          {!isAdminRoute && <Footer />} {/* Conditionally render Footer */}
          <Toaster richColors position="top-right" /> {/* Add Toaster here */}
        </AuthProvider>
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "Quantum Hive",
                  "url": "https://www.quantumhive.us/", // Replace with your actual domain
                  "logo": "https://www.quantumhive.us/images/logos/quantumhive-logo.svg", // Replace with your actual domain and logo path
                  "sameAs": [ // Add your social media profile URLs here
                    "https://x.com/QuantumHiveInc",
                    "https://github.com/quantumhiveinc",
                    "https://www.instagram.com/quantumhiveinc/"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-707-722-2212",
                    "contactType": "Customer Service",
                    "email": "hello@quantumhive.us"
                  }
                },
                {
                  "@type": "WebSite",
                  "url": "https://www.quantumhive.us/", // Replace with your actual domain
                  "name": "Quantum Hive",
                  "publisher": {
                    "@type": "Organization",
                    "name": "Quantum Hive",
                    "url": "https://www.quantumhive.us/", // Replace with your actual domain
                     "logo": {
                       "@type": "ImageObject",
                       "url": "https://www.quantumhive.us/images/logos/quantumhive-logo.svg" // Replace with your actual domain and logo path
                     }
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.quantumhive.us/search?q={search_term_string}", // Optional: Replace if you have site search
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}

