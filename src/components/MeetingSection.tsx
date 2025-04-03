import React from 'react';

const MeetingSection = () => {
  return (
    <section
      className="meeting-section bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/MeetingSection_BG.png')" }}
    >
      {/* Removed the absolute div for background image */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center border-l border-r border-[#18181B]">
        <span className="inline-block px-4 py-1 bg-gray-800 text-sm rounded-full mb-4 border border-gray-700">
          Transform your business in just 30 minutes ✨
        </span>
        <h2 className="text-3xl md:text-5xl font-semibold mb-6">
          Schedule Your AI Solution Discovery Call
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          See how our AI solutions can address your specific challenges and deliver measurable results. Our experts will analyze your needs and recommend the perfect solution path.
        </p>
        <button className="bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-medium py-3 px-6 rounded-lg transition duration-300 mb-12 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
          </svg>
          Book Your Free Consultation
        </button>

        {/* Calendly inline widget placeholder */}
        <div className="calendly-inline-widget max-w-4xl mx-auto bg-[#0A0A0A]/60 rounded-lg p-4 md:p-8 border border-gray-700 shadow-xl backdrop-blur-[20px]" style={{ minHeight: '700px' }}>
          {/* Placeholder content - Replace with actual Calendly embed code */}
          <div className="flex items-center justify-center h-full text-gray-500">
            Calendly Widget Placeholder - Add embed code here
          </div>
          {/* Example structure from image (not functional) */}
          {/* <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 text-left">
              <p className="text-sm text-green-400 mb-1">QuantumHive.dev</p>
              <h3 className="text-xl font-semibold mb-2">Demo</h3>
              <p className="text-sm text-gray-400 mb-1">Requires confirmation</p>
              <p className="text-sm text-gray-400 mb-4">25m</p>
              <div className="relative">
                <select className="bg-gray-700 border border-gray-600 rounded p-2 w-full appearance-none text-sm">
                  <option>Select...</option>
                </select>
                <svg className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              Calendar placeholder
            </div>
          </div> */}
        </div>
        {/* End Calendly placeholder */}

      </div>
    </section>
  );
};

export default MeetingSection;