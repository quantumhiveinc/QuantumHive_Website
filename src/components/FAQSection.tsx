"use client"; // Add this directive for client-side hooks

import React from 'react';

// FAQ data with dummy answers
const faqData = [
  { question: 'What makes Quantum Hive different from other AI development companies?', answer: 'Quantum Hive focuses on bespoke AI solutions tailored to specific business needs, combining cutting-edge research with practical implementation and dedicated support.' },
  { question: 'Do I need technical expertise to implement your AI solutions?', answer: 'Not necessarily. We work closely with your team, regardless of their technical background, providing guidance and support throughout the integration process.' },
  { question: 'How quickly can I see results from implementing your AI solutions?', answer: 'Timelines vary based on complexity, but we prioritize rapid prototyping and iterative deployment to deliver measurable results as quickly as possible.' },
  { question: 'Can your solutions integrate with our existing systems?', answer: 'Yes, our solutions are designed for flexibility and can integrate with various existing IT infrastructures and software systems via APIs and custom connectors.' },
  { question: 'How do you ensure the security of our data?', answer: 'Data security is paramount. We employ robust security measures, including encryption, access controls, and compliance with industry standards, to protect your data.' },
  { question: 'What ongoing support do you provide after implementation?', answer: 'We offer comprehensive post-implementation support packages, including maintenance, monitoring, performance optimization, and user training.' },
  { question: 'Can your solutions be customized to our specific industry requirements?', answer: 'Absolutely. Customization is key to our approach. We tailor solutions to meet the unique challenges and requirements of your specific industry.' },
  { question: 'What is your pricing model and are there any hidden costs?', answer: 'We offer transparent pricing models, typically based on project scope or retainer agreements. All costs are clearly outlined upfront, with no hidden fees.' },
];

// Accordion Item Component
const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-[#18181B] py-6"> {/* Matched border color */}
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white text-lg font-medium">{question}</span> {/* Added font-medium */}
        {/* Chevron Icon */}
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Answer Section with Transition */}
      <div
        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
          isOpen ? 'max-h-96 mt-4' : 'max-h-0' // Adjust max-h if answers are longer
        }`}
      >
        <p className="text-gray-400">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  return (
    <section className="bg-[#0A0A0A] text-white"> {/* Removed all padding */}
      <div className="container mx-auto px-4 py-16 md:py-24 border-l border-r border-[#18181B] grid grid-cols-1 lg:grid-cols-3 gap-12"> {/* Added py, borders */}
        {/* Left Column */}
        <div className="lg:col-span-1 px-6 md:px-8"> {/* Added internal horizontal padding */}
          <div className="inline-flex items-center bg-gray-800/50 border border-gray-700 rounded-full px-4 py-1.5 mb-4"> {/* Adjusted padding */}
            {/* Placeholder Question Mark Icon */}
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
            <span className="ml-2 text-sm text-gray-300 font-medium">Common questions</span> {/* Added font-medium */}
          </div>
          <h2 className="text-5xl font-medium mb-4">FAQs</h2>
          <p className="text-gray-400 mb-8">Questions from global businesses</p>
          <div className="flex space-x-4">
            <button className="border border-gray-600 rounded-full px-6 py-2 text-white hover:bg-gray-800 transition duration-300 flex items-center">
              Get started
              {/* Placeholder Down Arrow Icon */}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </button>
            <button className="bg-yellow-500 rounded-full px-6 py-2 text-black font-medium hover:bg-yellow-400 transition duration-300 flex items-center">
              Create an account
              {/* Placeholder Right Arrow Icon */}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>

        {/* Right Column (Accordion) */}
        <div className="lg:col-span-2 px-6 md:px-8"> {/* Added internal horizontal padding */}
          {faqData.map((item, index) => (
            <AccordionItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;