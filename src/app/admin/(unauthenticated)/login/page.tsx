// src/app/admin/(unauthenticated)/login/page.tsx
"use client";

import React, { useState } from 'react'; // Import useState
import { signIn } from 'next-auth/react'; // Import client-side signIn
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter for redirection and useSearchParams for callbackUrl
import Image from 'next/image'; // Import Image component
import Link from 'next/link'; // Import Link component for internal navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Keep standard Input for username
import { PasswordInput } from "@/components/ui/PasswordInput"; // Import the new PasswordInput
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react'; // Optional: Icon for error message

// Separate component for the button to use useFormStatus
// function LoginButton() { // No longer needed with useState
//   const { pending } = useFormStatus(); // Get pending state

//   return (
//     <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
//       {pending ? 'Signing In...' : 'Sign In'}
//     </Button>
//   );
// }

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'; // Default redirect to /admin
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false, // Handle redirect manually based on result
        // callbackUrl: callbackUrl // Let signIn handle callbackUrl internally if redirect: true, otherwise handle manually
      });

      console.log("Sign-in result:", result); // <-- ADDED LOG

      if (result?.error) {
        // Handle specific errors if needed, otherwise show a generic message
        // Example: result.error === 'CredentialsSignin'
        console.log("Sign-in failed, error:", result.error); // <-- ADDED LOG
        setErrorMessage('Invalid username or password.'); // Set error message from result
        console.error("Sign-in error:", result.error);
      } else if (result?.ok) {
        // Sign-in successful, redirect to the originally intended page or default
        console.log("Sign-in successful, attempting redirect to:", callbackUrl); // <-- ADDED LOG
        router.push(callbackUrl);
      } else {
        // Handle unexpected cases where result is null or lacks ok/error
        setErrorMessage('An unexpected error occurred during login.');
      }
    } catch (error) {
      console.error("Login submit error:", error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"> {/* Changed to flex-col */}
      {/* Add QuantumHive Logo */}
      <Image
        src="/images/logos/quantumhive-logo.svg"
        alt="QuantumHive Logo"
        width={200} // Adjust width as needed
        height={40} // Adjust height as needed
        className="mb-8" // Add bottom margin
        priority // Prioritize loading the logo
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        {/* The form now uses the handleSubmit function */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Display error message from the server action state */}
            {errorMessage && (
                 <div className="flex items-center space-x-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">{errorMessage}</p>
                </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username" // Add name attribute for FormData
                type="text"
                placeholder="Enter username"
                required
                value={username} // Controlled component
                onChange={(e) => setUsername(e.target.value)} // Update state
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput // Use the new PasswordInput component
                id="password"
                name="password"
                placeholder="Enter password" // Add placeholder for consistency
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" // Add autocomplete attribute
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {/* Link back to the main website */}
      <Link href="/" className="mt-6 text-sm text-blue-600 hover:underline">
        Back to QuantumHive website
      </Link>
    </div>
  );
}