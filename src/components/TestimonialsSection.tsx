import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
const TestimonialsSection = () => {
  return (
    <section className="testimonials-section bg-[#0A0A0A] border-t border-b border-[#18181B]">
      <div className="container mx-auto px-6 lg:px-48 py-16 md:py-24 text-center border-l border-r border-[#18181B]">
        {/* Section Header */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-1 bg-gray-800 text-[#FEC213] text-sm font-medium px-3 py-1 rounded-full mb-4"> {/* Standardized style */}
            &#x1F4AC; Client Testimonials {/* Speech Bubble Icon */}
          </span>
          {/* Optional: Add a title here if needed, like in SolutionsSection */}
          {/* <h2 className="text-4xl md:text-5xl font-semibold mb-4">What Our Clients Say</h2> */}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial Card 1 */}
          <div className="bg-[#1C1C1E] p-8 rounded-[10px] border border-[#3F3F46] text-left flex flex-col relative overflow-hidden">
             {/* Subtle background pattern/glow if needed */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-transparent to-transparent"></div>

            <blockquote className="text-lg md:text-xl text-[#ECEDEE] mb-6 flex-grow relative z-10">
              <FontAwesomeIcon icon={faQuoteLeft} className="text-[#FEC213] mr-2 inline-block h-5 w-5 align-top" />
              Workflow Automation by Quantum Hive is revolutionizing our business process.
            </blockquote>
            <div className="flex items-center mt-auto relative z-10">
              <Image
                src="/images/testimonials/grey-baker.png"
                alt="Grey Baker"
                width={40}
                height={40}
                className="rounded-full mr-4 border-2 border-gray-600"
              />
              <div>
                <p className="font-semibold text-[#F4F4F5]">Grey Baker</p>
                <p className="text-sm text-[#A1A1AA]">Co-Founder of XYZ</p>
              </div>
              {/* Placeholder for logo */}
              <div className="ml-auto">
                 <Image
                    src="/images/testimonials/dependabot-logo.svg"
                    alt="XYZ Logo"
                    width={32}
                    height={32}
                    className="opacity-80"
                 />
              </div>
            </div>
          </div>

          {/* Testimonial Card 2 */}
          <div className="bg-[#1C1C1E] p-8 rounded-[10px] border border-[#3F3F46] text-left flex flex-col relative overflow-hidden">
             {/* Subtle background pattern/glow if needed */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-transparent to-transparent"></div>

            <blockquote className="text-lg md:text-xl text-[#ECEDEE] mb-6 flex-grow relative z-10">
              <FontAwesomeIcon icon={faQuoteLeft} className="text-[#FEC213] mr-2 inline-block h-5 w-5 align-top" />
              The experience of AI agents is crucial in the realm of business tools. Quantum Hive simplified processes.
            </blockquote>
            <div className="flex items-center mt-auto relative z-10">
              <Image
                src="/images/testimonials/paul-copplestone.png"
                alt="Paul Copplestone"
                width={40}
                height={40}
                className="rounded-full mr-4 border-2 border-gray-600"
              />
              <div>
                <p className="font-semibold text-[#F4F4F5]">Paul Copplestone</p>
                <p className="text-sm text-[#A1A1AA]">Co-Founder of ABC</p>
              </div>
               {/* Placeholder for logo */}
              <div className="ml-auto">
                 <Image
                    src="/images/testimonials/supabase-logo.svg"
                    alt="ABC Logo"
                    width={32}
                    height={32}
                    className="opacity-80"
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;