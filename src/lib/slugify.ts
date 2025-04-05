// src/lib/slugify.ts

/**
 * Converts a string into a URL-friendly slug.
 * Example: "My Awesome Post!" -> "my-awesome-post"
 * Note: This function does NOT guarantee uniqueness. Uniqueness must be checked
 * against the database where the slug will be used.
 * @param text The string to slugify.
 * @returns The generated slug.
 */
export function slugify(text: string): string {
  if (!text) {
    return ""; // Return empty string if input is empty or null
  }

  return text
    .toString() // Ensure input is a string
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word characters except hyphens and underscores
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Trim hyphens from the start
    .replace(/-+$/, ''); // Trim hyphens from the end
}