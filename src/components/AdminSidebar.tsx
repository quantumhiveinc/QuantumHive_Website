import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn/ui setup
// Button import removed as it was unused
import { ScrollArea } from "@/components/ui/scroll-area"; // For potentially long menus
import { Home, FileText, Briefcase, Building } from 'lucide-react'; // Example icons

const AdminSidebar = () => {
  // TODO: Add logic to determine the active link based on the current route
  const pathname = ''; // Placeholder

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/case-studies', label: 'Case Studies', icon: Briefcase },
    { href: '/admin/industries', label: 'Industries', icon: Building },
    // Add more links as needed
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        {/* Placeholder for Logo or Site Title */}
        <Link href="/admin" className="flex items-center"> {/* Wrap logo in link to dashboard */}
          <Image
            src="/images/logos/quantumhive-logo.svg"
            alt="QuantumHive Logo"
            width={144} // Adjusted width
            height={24} // Adjusted height
          />
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-4 py-2">
          <ul>
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <a
                    className={cn(
                      "flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700",
                      pathname === item.href ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
      {/* Optional: Footer section in sidebar */}
      {/* <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" className="w-full">Settings</Button>
      </div> */}
    </aside>
  );
};

export default AdminSidebar;