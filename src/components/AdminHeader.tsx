'use client'; // Needed for client-side interactions like DropdownMenu and potentially fetching session

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { handleSignOut } from '@/components/authActions'; // Import the correct sign out action
import { LogOut, User } from 'lucide-react';
// import { useSession } from 'next-auth/react'; // We might need this later for user data

const AdminHeader = () => {
  // const { data: session } = useSession(); // Example of getting session data

  // Placeholder user data - replace with actual data from session later
  const userName = "Admin User"; // session?.user?.name || 'Admin User';
  const userInitials = userName?.split(' ').map(n => n[0]).join('') || 'AU';
  const userImage = undefined; // session?.user?.image || undefined;

  const handleLogout = async () => {
    await handleSignOut(); // Call the correct function
    // Redirect logic is handled within the logout action or middleware
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0">
      {/* Left side - Welcome message */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Welcome, {userName}!
        </h2>
        {/* Maybe add breadcrumbs or page title here later */}
      </div>

      {/* Right side - Profile/Logout */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="text-slate-900">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                {/* <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p> */}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              {/* Link to profile page if needed */}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;