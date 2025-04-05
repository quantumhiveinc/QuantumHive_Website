import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <main className="flex-grow container mx-auto px-6 py-16 border-l border-r border-[#18181B]"> {/* Added container, padding, borders */}
        <h1 className="text-4xl font-bold mb-12 text-center text-[#FDB813]">Contact Us</h1> {/* Yellow accent */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto"> {/* Increased gap, max-width */}
          {/* Contact Form */}
          <div className="border border-[#FDB813]/30 p-8 rounded-lg bg-[#18181B]/50 shadow-lg shadow-[#FDB813]/10"> {/* Added border and bg */}
            <h2 className="text-2xl font-semibold mb-6 text-[#FDB813]">Send us a Message</h2> {/* Yellow accent */}
            <form className="space-y-6"> {/* Increased spacing */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-300">Name</Label> {/* Adjusted label style */}
                <Input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="mt-2 bg-[#0A0A0A] border border-[#FDB813]/50 focus:border-[#FDB813] focus:ring-[#FDB813]/50 rounded-md px-4 py-2 text-[#EDEDED] w-full" // Dark theme input styles
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email</Label> {/* Adjusted label style */}
                <Input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  className="mt-2 bg-[#0A0A0A] border border-[#FDB813]/50 focus:border-[#FDB813] focus:ring-[#FDB813]/50 rounded-md px-4 py-2 text-[#EDEDED] w-full" // Dark theme input styles
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-gray-300">Subject</Label> {/* Adjusted label style */}
                <Input
                  type="text"
                  id="subject"
                  placeholder="Subject of your message"
                  className="mt-2 bg-[#0A0A0A] border border-[#FDB813]/50 focus:border-[#FDB813] focus:ring-[#FDB813]/50 rounded-md px-4 py-2 text-[#EDEDED] w-full" // Dark theme input styles
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-300">Message</Label> {/* Adjusted label style */}
                <Textarea
                  id="message"
                  placeholder="Type your message here."
                  rows={5}
                  className="mt-2 bg-[#0A0A0A] border border-[#FDB813]/50 focus:border-[#FDB813] focus:ring-[#FDB813]/50 rounded-md px-4 py-2 text-[#EDEDED] w-full" // Dark theme textarea styles
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FDB813] text-[#0A0A0A] px-6 py-3 rounded-full text-base font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center" // Yellow accent button
              >
                Send Message <span className="ml-2">&#8594;</span> {/* Right arrow */}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="border border-[#FDB813]/30 p-8 rounded-lg bg-[#18181B]/50 shadow-lg shadow-[#FDB813]/10"> {/* Added border and bg */}
            <h2 className="text-2xl font-semibold mb-6 text-[#FDB813]">Our Contact Details</h2> {/* Yellow accent */}
            <div className="space-y-6 text-gray-300"> {/* Increased spacing, adjusted text color */}
              <div>
                <h3 className="font-semibold text-lg text-[#EDEDED] mb-1">Address:</h3> {/* Adjusted heading style */}
                <p className="leading-relaxed">
                  1111b South Governors Avenue<br /> {/* Updated Address */}
                  Dover, Delaware,<br />
                  19904 US
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#EDEDED] mb-1">Phone:</h3> {/* Adjusted heading style */}
                <p className="leading-relaxed hover:text-[#FDB813] transition-colors">
                  <a href="tel:+17077222212">+1 707-722-2212</a> {/* Updated Phone */}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#EDEDED] mb-1">Email:</h3> {/* Adjusted heading style */}
                <p className="leading-relaxed hover:text-[#FDB813] transition-colors">
                  <a href="mailto:hello@quantumhive.us">hello@quantumhive.us</a> {/* Updated Email */}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#EDEDED] mb-1">Business Hours:</h3> {/* Adjusted heading style */}
                <p className="leading-relaxed">Monday - Friday: 9:00 AM - 5:00 PM EST<br />Saturday - Sunday: Closed</p> {/* Added Timezone */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}