// src/components/admin/TiptapEditor.tsx
"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './TiptapEditor.css'; // We'll create this for basic styling

interface TiptapEditorProps {
  initialContent: string;
  onChange: (htmlContent: string) => void;
  disabled?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ initialContent, onChange, disabled = false }) => {
  console.log('[TiptapEditor] Rendering. Disabled prop:', disabled); // Log component render and disabled prop
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit options here if needed
        // e.g., heading levels, disabling certain marks/nodes
      }),
      // Add other extensions like Link, Image, etc. if required later
    ],
    content: initialContent,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Re-added prose for content styling. Added prose-sm and prose-invert for potential dark mode compatibility.
        // Ensure @tailwindcss/typography plugin is installed and configured.
        class: 'tiptap-editor prose prose-sm dark:prose-invert focus:outline-none p-4 min-h-[200px] max-w-full',
      },
    },
    immediatelyRender: false, // Add this line to prevent SSR hydration issues
  });

  if (!editor) {
    return null; // Or a loading state
  }

  return (
    <div className={`tiptap-wrapper border rounded-md ${disabled ? 'bg-muted opacity-50 cursor-not-allowed' : 'bg-background'}`}>
      {/* Basic Toolbar Example (can be expanded) */}
      {/* You might want to create a separate Toolbar component */}
      <div className="tiptap-toolbar p-2 border-b flex flex-wrap gap-1">
        {/* Toolbar buttons... */}
         <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={disabled || !editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
         <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={disabled || !editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
         <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={disabled || !editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>Strike</button>
         <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} disabled={disabled || !editor.can().chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}>Code</button>
         <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} disabled={disabled} className={editor.isActive('paragraph') ? 'is-active' : ''}>Paragraph</button>
         <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} disabled={disabled || !editor.can().chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
         <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} disabled={disabled || !editor.can().chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
         <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={disabled || !editor.can().chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullet List</button>
         <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={disabled || !editor.can().chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Ordered List</button>
         <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} disabled={disabled || !editor.can().chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>Code Block</button>
         <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={disabled || !editor.can().chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>Blockquote</button>
         <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={disabled}>HR</button>
         {/* Add more buttons for other StarterKit features or custom extensions */}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;