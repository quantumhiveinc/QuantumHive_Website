"use client";

import React, { useState } from "react"; // Import useState
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogClose, // Optional: Import if you want an explicit close button (keep commented if not used)
} from "@/components/ui/dialog";
import { LeadCaptureForm } from "./LeadCaptureForm"; // Import the form

// No longer re-exporting Dialog/DialogTrigger

interface LeadCaptureModalProps {
  children: React.ReactNode; // To wrap the trigger element (e.g., a button)
}

export function LeadCaptureModal({ children }: LeadCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false); // Add state for dialog open/closed

  const handleClose = () => setIsOpen(false); // Function to close the dialog
  // The component now directly renders the Dialog structure
  // around the trigger element passed via the 'children' prop.
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* Control the dialog state */}
      <DialogTrigger asChild>{children}</DialogTrigger> {/* Trigger is the passed child */}
      {/* Overlay and Content are rendered conditionally by the Dialog component */}
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-800 bg-[#0A0A0A] p-6 shadow-lg duration-200 sm:rounded-lg text-neutral-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-yellow-500">Request a Free Consultation</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Fill out the form below, and one of our AI specialists will get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <LeadCaptureForm onClose={handleClose} /> {/* Pass the close handler */}
        {/* Optional: Add an explicit close button if needed */}
      </DialogContent>
    </Dialog>
  );
}