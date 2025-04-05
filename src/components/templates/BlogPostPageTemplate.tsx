import React from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

interface BlogPostData {
  title: string;
  author: string;
  publicationDate: string; // Consider using Date type and formatting
  featuredImageUrl: string;
  content: string | React.ReactNode; // Allow for complex JSX content (paragraphs, headings, lists, code blocks)
  tags: string[];
}

export default function BlogPostPageTemplate({
  post,
}: {
  post: BlogPostData;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{post.title}</h1>
        <p className="text-muted-foreground text-sm">
          By {post.author} on {post.publicationDate}
        </p>
      </header>

      {/* Featured Image */}
      <div className="relative h-64 md:h-80 lg:h-96 mb-8 overflow-hidden rounded-lg">
        <Image
          src={post.featuredImageUrl}
          alt={`${post.title} Featured Image`}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
      </div>

      {/* Main Content Area */}
      <article className="prose lg:prose-xl max-w-none mb-12">
        {/* Render content - assumes content might be pre-formatted HTML or complex JSX */}
        {typeof post.content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} /> // Be cautious with dangerouslySetInnerHTML if content isn't sanitized
        ) : (
          post.content
        )}
      </article>

      {/* Tags/Categories */}
      <footer className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </footer>
    </div>
  );
}