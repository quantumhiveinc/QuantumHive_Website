// src/app/api/auth/[...nextauth]/route.ts
// Re-export the handlers from the central auth config file
export { GET, POST } from '@/auth';

// You might also need this if you're using Edge runtime, but based on your setup, it's likely not needed.
// export const runtime = "edge" // Optional: see https://authjs.dev/guides/upgrade-to-v5#edge-compatibility