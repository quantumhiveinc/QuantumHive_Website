"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react"; // Added specific event types
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Removed Alert import as component might be missing
import { Loader2 } from "lucide-react"; // Import Loader icon
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components

interface LeadCaptureFormProps {
  planName?: string; // Make planName optional
  onClose?: () => void; // Add callback to close the modal
}

export function LeadCaptureForm({ planName, onClose }: LeadCaptureFormProps) { // Add props destructuring, include onClose
  // Determine default source form name
  const defaultSourceFormName = "Free Consulting";
  const sourceFormName = planName || defaultSourceFormName;

  const initialFormData = {
    // planName is now just a prop, not part of the core form data state
    contactPersonName: "",
    companyName: "",
    companySize: "", // Keep for potential Enterprise use
    email: "",
    phone: "",
    requirements: "", // Keep for potential Enterprise use
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialFormData, string>>>({}); // State for validation errors
  const [isFormValid, setIsFormValid] = useState(false); // State for overall form validity

  // Reset form data if planName changes (e.g., switching between modal types)
  // Also reset errors and status
  useEffect(() => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitStatus("idle");
    setSubmitMessage("");
    setIsFormValid(false); // Reset validity on plan change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planName]); // Rerun only when planName prop itself changes

  // Determine if the form is for the Enterprise plan specifically
  const isEnterprise = planName === "Enterprise Transformer";
  // Determine if the form is part of a pricing plan context (vs. free consulting)
  const isPricingPlanContext = !!planName;

  const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // Use specific event type
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
            [id]: value,
          }));
          // Clear error for the field being changed
          if (errors[id as keyof typeof initialFormData]) {
            setErrors(prevErrors => ({ ...prevErrors, [id]: undefined }));
          }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
            companySize: value,
          }));
          // Clear error for companySize when changed
          if (errors.companySize) {
            setErrors(prevErrors => ({ ...prevErrors, companySize: undefined }));
          }
  };

  // Validation function - now returns validity and sets errors
  const validateForm = (data: typeof initialFormData): boolean => {
    const newErrors: Partial<Record<keyof typeof initialFormData, string>> = {};
    let isValid = true;
    const phoneRegex = /^[\d\s()+-]{7,}$/; // Allows digits, spaces, (), +, - and min 7 chars

    if (!data.contactPersonName.trim()) {
      newErrors.contactPersonName = "Contact Person Name is required.";
      isValid = false;
    }
    if (!data.companyName.trim()) {
      newErrors.companyName = "Company Name is required.";
      isValid = false;
    }
    if (!data.email.trim()) {
      newErrors.email = "Business Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) { // Basic email format check
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }
    if (!data.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
      isValid = false;
    } else if (!phoneRegex.test(data.phone)) {
      newErrors.phone = "Please enter a valid phone number format.";
      isValid = false;
    }
    // Validate companySize only if it's the Enterprise plan context
    if (isEnterprise && !data.companySize) {
      newErrors.companySize = "Company Size is required for the Enterprise plan.";
      isValid = false;
    }

    setErrors(newErrors); // Update errors state
    return isValid; // Return overall validity
  };

  // Effect to validate form whenever formData changes
  useEffect(() => {
    setIsFormValid(validateForm(formData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, isEnterprise]); // Rerun validation when form data or enterprise status changes
  
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { // Use specific event type
    e.preventDefault();
    setSubmitStatus("idle");
    setSubmitMessage("");
    // Re-validate on submit press, although button state should prevent invalid submission
    if (!validateForm(formData)) {
      setSubmitStatus("error");
      // Use a generic message here as specific errors are inline
      setSubmitMessage("Please correct the errors above.");
      setIsFormValid(false); // Ensure form validity state is correct
      return; // Stop submission if validation fails
    }
  
      // Check for submission URL before proceeding
      if (!window.location.href) {
        setSubmitStatus("error");
        setSubmitMessage("Configuration error: Cannot determine submission URL.");
        return;
      }
  
      setIsLoading(true);

    // Construct payload based on whether it's a pricing plan or free consulting
    const basePayload = {
      fullName: formData.contactPersonName,
      email: formData.email,
      phone: formData.phone,
      company: formData.companyName,
      sourceFormName: sourceFormName, // Use determined source name
      submissionUrl: window.location.href,
      // Include message if requirements field has content (relevant for Enterprise or potentially free form)
      message: formData.requirements ? formData.requirements : undefined,
    };

    // Add plan-specific fields only if in pricing plan context
    const planSpecificPayload = isPricingPlanContext
      ? {
          // Include companySize only if it's Enterprise and a size is selected
          companySize: isEnterprise && formData.companySize ? formData.companySize : undefined,
          // Potentially add planName itself to payload if API needs it separately?
          // Assuming API only needs sourceFormName for now.
        }
      : {};

    const payload = {
        ...basePayload,
        ...planSpecificPayload,
    };

    // Filter out undefined values before sending
    const filteredPayload = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined) // Fixed ESLint warning
    );


    try {
      const response = await fetch("/api/admin/leads", { // Corrected API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredPayload),
      });

      if (response.ok) { // Check for 2xx status codes, typically 201 Created for this API
        setSubmitStatus("success");
        setSubmitMessage("Your request has been submitted successfully."); // Update success message text
        // Reset form using the initial state derived from the current planName context
        setFormData({
            contactPersonName: "",
            companyName: "",
            companySize: "",
            email: "",
            phone: "",
            requirements: "",
        });
        // Close the modal after a short delay if onClose is provided
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 300); // 0.3 second delay
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: "An unexpected error occurred." })); // Graceful error parsing
        setSubmitStatus("error");
        setSubmitMessage(`Submission failed: ${errorData.message || response.statusText}`);
        console.error("API Error:", errorData);
      }
    } catch (error) {
      console.error("Form Submission Error:", error);
      setSubmitStatus("error");
      setSubmitMessage("An error occurred while submitting the form. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
       {/* Removed hidden input for planName */}

      <div className="grid grid-cols-1 gap-4">
        {/* Contact Person Name */}
        <div className="grid gap-2">
          <Label htmlFor="contactPersonName" className="text-neutral-400">Contact Person Name <span className="text-red-500">*</span></Label>
          <Input
            id="contactPersonName"
            value={formData.contactPersonName}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500 focus:border-primary focus:ring-primary"
                    />
                    {errors.contactPersonName && <p className="text-sm text-red-500">{errors.contactPersonName}</p>}
        </div>

        {/* Company Name */}
        <div className="grid gap-2">
          <Label htmlFor="companyName" className="text-neutral-400">Company Name <span className="text-red-500">*</span></Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your Company"
            required // Make Company Name required
            className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500 focus:border-primary focus:ring-primary"
                    />
                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
        </div>

        {/* Company Size - Conditional on Enterprise Plan */}
        {isEnterprise && (
          <div className="grid gap-2">
            <Label htmlFor="companySize" className="text-neutral-400">Company Size <span className="text-red-500">*</span></Label>
            <Select
              value={formData.companySize}
              onValueChange={handleSelectChange}
              required={isEnterprise} // Required only for Enterprise plan
            >
              <SelectTrigger id="companySize" className="bg-neutral-800 border-neutral-700 text-neutral-50 focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-50">
                <SelectItem value="1-50">1-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-1000">201-1000 employees</SelectItem>
                <SelectItem value="1001+">1001+ employees</SelectItem>
              </SelectContent>
            </Select>
            {errors.companySize && <p className="text-sm text-red-500">{errors.companySize}</p>}
          </div>
        )}
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-neutral-400">Business Email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@company.com"
            required
            className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500 focus:border-primary focus:ring-primary"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-neutral-400">Phone Number <span className="text-red-500">*</span></Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Phone Number"
            required // Make Phone required
            className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500 focus:border-primary focus:ring-primary"
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        {/* Message/Requirements Field - Label changes based on context */}
        <div className="grid gap-2">
          <Label htmlFor="requirements" className="text-neutral-400">
            {isEnterprise ? "Specific Requirements or Use Case (Optional)" : "Message (Optional)"}
          </Label>
          <Textarea
            id="requirements" // Keep ID consistent for state management
            value={formData.requirements}
            onChange={handleChange}
            placeholder={isEnterprise ? "Tell us about your specific needs..." : "How can we help you?"}
            className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500 focus:border-primary focus:ring-primary"
            rows={4}
          />
          {/* No validation error needed for optional field */}
        </div>
      </div>
      {/* Submission Status Feedback */}
      {/* Simple Submission Status Feedback */}
      {submitStatus === "success" && (
        <p className="text-sm text-green-600 py-2">{submitMessage}</p>
      )}
      {submitStatus === "error" && (
        <p className="text-sm text-red-600 py-2">{submitMessage}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black disabled:opacity-50"
        disabled={isLoading || !isFormValid} // Disable if loading or form is invalid
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  );
}