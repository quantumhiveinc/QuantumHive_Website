// src/app/admin/(unauthenticated)/login/page.tsx
"use client";

import React, { useState, Suspense } from 'react'; // Import Suspense
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';

// Define the inner component that uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook is now inside the Suspense boundary
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      console.log("Sign-in result:", result);

      if (result?.error) {
        console.log("Sign-in failed, error:", result.error);
        setErrorMessage('Invalid username or password.');
        console.error("Sign-in error:", result.error);
      } else if (result?.ok) {
        console.log("Sign-in successful, attempting redirect to:", callbackUrl);
        router.push(callbackUrl);
      } else {
        setErrorMessage('An unexpected error occurred during login.');
      }
    } catch (error) {
      console.error("Login submit error:", error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Return the actual form JSX
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Image
        src="/images/logos/quantumhive-logo.svg"
        alt="QuantumHive Logo"
        width={200}
        height={40}
        className="mb-8"
        priority
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
                name="username"
                type="text"
                placeholder="Enter username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
      <Link href="/" className="mt-6 text-sm text-blue-600 hover:underline">
        Back to QuantumHive website
      </Link>
    </div>
  );
}

// The main page component now just renders the Suspense boundary and the LoginForm
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}