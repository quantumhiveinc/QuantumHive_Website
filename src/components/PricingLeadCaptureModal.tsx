"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogClose, // Removed unused import
} from "@/components/ui/dialog";
import { LeadCaptureForm } from "./LeadCaptureForm"; // Assuming LeadCaptureForm is adapted
// import { Button } from "./ui/button"; // Removed unused import

interface PricingLeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string | null;
}

export function PricingLeadCaptureModal({
  isOpen,
  onClose,
  planName,
}: PricingLeadCaptureModalProps) {
  if (!isOpen || !planName) {
    return null;
  }

  const isEnterprise = planName === "Enterprise Transformer";
  const title = isEnterprise ? "Enterprise Inquiry" : `Get Started with ${planName}`;
  const description = isEnterprise
    ? "Please provide your details, and our sales team will contact you shortly."
    : `You've selected the ${planName} plan. Fill out the form below to proceed.`;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-700 text-neutral-50">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">{title}</DialogTitle>
          <DialogDescription className="text-neutral-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        {/* Pass planName to the form */}
        <LeadCaptureForm planName={planName} onClose={onClose} />
         {/* Explicit Close Button in Footer if needed, or rely on X icon */}
         {/*
         <DialogFooter>
           <DialogClose asChild>
             <Button type="button" variant="secondary" onClick={onClose}>
               Close
             </Button>
           </DialogClose>
         </DialogFooter>
         */}
      </DialogContent>
    </Dialog>
  );
}