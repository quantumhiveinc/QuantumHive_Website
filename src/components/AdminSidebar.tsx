import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn/ui setup
// Button import removed as it was unused
import { ScrollArea } from "@/components/ui/scroll-area"; // For potentially long menus
import { Home, FileText, Briefcase, Building, List, PlusSquare, FolderPlus, Settings, ClipboardList } from 'lucide-react'; // Added icons for submenus, Settings, and Leads

const AdminSidebar = () => {
  // TODO: Add logic to determine the active link based on the current route
  const pathname = ''; // Placeholder

  // Define menu structure with potential children
  interface MenuItem {
    href?: string; // Optional href for parent items that are just containers
    label: string;
    icon: React.ElementType;
    children?: (Omit<MenuItem, 'children' | 'href'> & { href: string })[]; // Ensure children have a required href
  }

  const menuItems: MenuItem[] = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    {
      label: 'Blog', // Parent item
      icon: FileText,
      children: [
        { href: '/admin/blog', label: 'All Posts', icon: List },
        { href: '/admin/blog/new', label: 'New Blog Post', icon: PlusSquare },
        { href: '/admin/categories', label: 'Categories', icon: List },
        { href: '/admin/categories/new', label: 'Add New Category', icon: FolderPlus },
      ]
    },
    { href: '/admin/case-studies', label: 'Case Studies', icon: Briefcase },
    { href: '/admin/industries', label: 'Industries', icon: Building },
    { href: '/admin/leads', label: 'Leads', icon: ClipboardList }, // Added Leads link
    { href: '/admin/settings', label: 'Settings', icon: Settings }, // Updated Settings link to correct path
    // Add more top-level links as needed
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
              <li key={item.label}> {/* Use label as key for items that might not have href */}
                {item.children ? (
                  // Render parent item and its children
                  <div>
                    {/* Parent Item Display (not a link itself) */}
                    <span className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md font-medium">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                      {/* TODO: Add dropdown indicator and toggle functionality */}
                    </span>
                    {/* Sub-menu */}
                    <ul className="ml-5 mt-1 border-l border-gray-200 dark:border-gray-600 pl-3 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} legacyBehavior passHref>
                            <a
                              className={cn(
                                "flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700",
                                pathname === child.href ? "bg-gray-100 dark:bg-gray-700 font-medium" : ""
                              )}
                            >
                              {/* Optional: Add child icon if needed: <child.icon className="mr-2 h-4 w-4" /> */}
                              {child.label}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  // Render regular top-level link for items without children
                  <Link
                    href={item.href!} // Assert href exists for non-children items
                    className={cn(
                      "flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700",
                      pathname === item.href ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                )}
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