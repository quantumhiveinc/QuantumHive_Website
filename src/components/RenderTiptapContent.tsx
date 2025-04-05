// src/components/RenderTiptapContent.tsx
"use client";

import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';

interface RenderTiptapContentProps {
  content: JSONContent | string; // Accept JSON or potentially HTML string
}

const RenderTiptapContent: React.FC<RenderTiptapContentProps> = ({ content }) => {
  const editor = useEditor({
    editable: false, // Make it read-only
    content: content,
    extensions: [
      StarterKit,
      // Add any other extensions used in the editor (e.g., Link, Image)
      // Ensure extensions match those used in FullPageBlogPostEditor
    ],
    editorProps: {
        attributes: {
            // Apply similar prose styling as the editor for consistency
            class: 'prose dark:prose-invert max-w-none', // max-w-none prevents prose from limiting width
        },
    },
  });

  // Ensure content updates if the prop changes after initial mount
  useEffect(() => {
    if (editor && content) {
        // Check if content is actually different before setting
        // Use a simple string comparison for now, might need deeper comparison for objects
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
             editor.commands.setContent(content, false); // Don't emit update
        }
    }
  }, [content, editor]);


  if (!editor) {
    return null; // Or a loading state
  }

  return <EditorContent editor={editor} />;
};

export default RenderTiptapContent;