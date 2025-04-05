import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Keep Card imports

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <main className="flex-grow container mx-auto px-6 py-16 border-l border-r border-[#18181B]"> {/* Added container, padding, borders */}
        <h1 className="text-4xl font-bold mb-10 text-center text-[#FDB813]">About Us</h1> {/* Yellow accent for title */}
        <div className="max-w-4xl mx-auto"> {/* Centered content container */}
          <p className="mb-6 text-lg leading-relaxed"> {/* Adjusted text size and color */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="mb-12 text-lg leading-relaxed"> {/* Adjusted text size and color */}
            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.
          </p>
          <div className="mt-12">
            <h2 className="text-3xl font-semibold mb-8 text-center text-[#FDB813]">Our Values</h2> {/* Yellow accent */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Increased gap */}
              {/* Updated Card Styling */}
              <Card className="bg-[#18181B] border border-[#FDB813]/50 text-[#EDEDED] rounded-lg overflow-hidden shadow-lg shadow-[#FDB813]/10">
                <CardHeader className="border-b border-[#FDB813]/30 p-6">
                  <CardTitle className="text-[#FDB813] text-2xl">Innovation</CardTitle> {/* Yellow accent */}
                </CardHeader>
                <CardContent className="p-6">
                  <p>We constantly seek new and better ways to solve problems and deliver value.</p>
                </CardContent>
              </Card>
              <Card className="bg-[#18181B] border border-[#FDB813]/50 text-[#EDEDED] rounded-lg overflow-hidden shadow-lg shadow-[#FDB813]/10">
                <CardHeader className="border-b border-[#FDB813]/30 p-6">
                  <CardTitle className="text-[#FDB813] text-2xl">Integrity</CardTitle> {/* Yellow accent */}
                </CardHeader>
                <CardContent className="p-6">
                  <p>We operate with honesty and transparency in all our interactions.</p>
                </CardContent>
              </Card>
              <Card className="bg-[#18181B] border border-[#FDB813]/50 text-[#EDEDED] rounded-lg overflow-hidden shadow-lg shadow-[#FDB813]/10">
                <CardHeader className="border-b border-[#FDB813]/30 p-6">
                  <CardTitle className="text-[#FDB813] text-2xl">Collaboration</CardTitle> {/* Yellow accent */}
                </CardHeader>
                <CardContent className="p-6">
                  <p>We believe in the power of teamwork, both internally and with our clients.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}