'use client';

import React from 'react';
import CountUp from 'react-countup';

const metrics = [
  { value: 85, suffix: '%', label: 'Reduction in manual processing time' },
  { value: 67, suffix: '%', label: 'Decrease in customer response times' },
  { value: 43, suffix: '%', label: 'Improvement in data-driven decision accuracy' },
  { value: 3.7, suffix: 'x', label: 'Average return on AI investment', decimals: 1 },
];

const SuccessMetricsSection = () => {
  return (
    <section className="success-metrics-section bg-[#0A0A0A] text-white border-b border-[#18181B]"> {/* Added border-b here */}
      <div className="container mx-auto px-6 py-16 md:py-24 border-l border-r border-[#18181B]"> {/* Set padding to px-6 py-16 md:py-24 */}
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-12 md:mb-16">
          Our <span className="text-yellow-400">Success</span> Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="text-5xl md:text-6xl font-semibold text-yellow-400 mb-3">
                <CountUp
                  end={metric.value}
                  duration={2.75}
                  decimals={metric.decimals || 0}
                  suffix={metric.suffix}
                  enableScrollSpy // Starts animation when element scrolls into view
                  scrollSpyOnce // Only animates once
                />
              </div>
              <p className="text-lg text-gray-300">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessMetricsSection;