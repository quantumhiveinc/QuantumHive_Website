"use client"; // Add this directive for client-side hooks

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'; // Import a suitable icon

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
      <div className="container mx-auto px-6 py-16 md:py-24 border-l border-r border-[#18181B] grid grid-cols-1 lg:grid-cols-3 gap-12"> {/* Set padding to px-6 py-16 md:py-24 */}
        {/* Left Column */}
        <div className="lg:col-span-1 px-6 md:px-8"> {/* Added internal horizontal padding */}
          {/* Standardized Section Header Span */}
          <span className="inline-flex items-center gap-1 bg-gray-800 text-[#FEC213] text-sm font-medium px-3 py-1 rounded-full mb-4">
             <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4" /> {/* Use FontAwesome icon */}
             Common questions
          </span>
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