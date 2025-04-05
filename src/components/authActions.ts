// src/components/authActions.ts
"use server";

import { signOut } from "@/auth"; // Import signOut from the central auth config for server actions

export async function handleSignOut() {
  // Call the signOut function from your Auth.js config
  // Redirect is handled by middleware or default behavior, but can be specified
  await signOut({ redirect: true, redirectTo: "/admin/login" }); // Use redirectTo instead of callbackUrl
}