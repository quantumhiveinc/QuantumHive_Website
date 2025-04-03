// website/src/components/PricingSection.tsx

import React from 'react';
// import Image from 'next/image'; // Assuming Next.js for Image component - Removed as unused

// Placeholder icons - replace with actual paths or SVG components if available
const CheckIcon = () => <span className="text-yellow-400 mr-2">✓</span>;
const InfoIcon = () => <span className="text-gray-500 ml-1">ⓘ</span>;
const ArrowRightIcon = () => <span className="ml-2">→</span>;
const StarIcon = () => <span className="mr-1">⭐</span>; // Placeholder
// Removed unused LockIcon

interface Feature {
    text: string;
    info?: boolean;
}

interface PricingCardProps {
    title: string;
    description: string;
    price?: string; // Optional for Enterprise
    features: Feature[];
    buttonText: string;
    buttonLink?: string;
    isEnterprise?: boolean;
    customPricing?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, description, price, features, buttonText, buttonLink = "#", isEnterprise = false, customPricing = false }) => (
    <div className="bg-[#0A0A0A]/40 backdrop-blur-[20px] border border-[#18181B] rounded-xl p-6 md:p-8 flex flex-col h-full transform-gpu">
        <h3 className="text-xl md:text-2xl font-semibold text-yellow-400 mb-2 flex items-center">
            {title}
            {customPricing && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                    <StarIcon /> Custom pricing
                </span>
            )}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        {!isEnterprise && (
            <>
                <p className="text-gray-500 text-xs mb-1">Starts from</p>
                <p className="text-4xl md:text-5xl font-medium text-white mb-6">{price}</p>
            </>
        )}
        {isEnterprise && <div className="mb-6"></div>} {/* Spacer for enterprise card */}
        {/* Feature List - Different layout for Enterprise */}
        {isEnterprise ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-300 text-sm mb-8 flex-grow">
                 {/* Chunk features into columns based on Figma layout */}
                 {chunkArray(features, Math.ceil(features.length / 2)).map((columnFeatures, colIndex) => (
                     <ul key={colIndex} className="space-y-3">
                         {columnFeatures.map((feature: Feature, index: number) => (
                             <li key={`${colIndex}-${index}`} className="flex items-start">
                                 <CheckIcon />
                                 <span>
                                     {feature.text}
                                     {feature.info && <InfoIcon />}
                                 </span>
                             </li>
                         ))}
                     </ul>
                 ))}
             </div>
        ) : (
            <ul className="space-y-3 text-gray-300 text-sm mb-8 flex-grow">
                {features.map((feature: Feature, index: number) => (
                    <li key={index} className="flex items-start">
                        <CheckIcon />
                        <span>
                            {feature.text}
                            {feature.info && <InfoIcon />}
                        </span>
                    </li>
                ))}
            </ul>
        )}
        <a
            href={buttonLink}
            className={`mt-auto inline-flex items-center justify-center px-6 py-3 border border-yellow-400 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors`} /* Removed enterprise-specific gray styles */
        >
            {/* Removed LockIcon for enterprise */}
            {buttonText}
            {!isEnterprise && <ArrowRightIcon />} {/* Keep arrow only for non-enterprise */}
        </a>
        {isEnterprise && (
             <a href="#" className="text-center text-gray-400 text-xs mt-3 hover:text-yellow-400">Get a custom quote</a>
        )}
    </div>
);

// Helper function to chunk features for Enterprise layout
const chunkArray = (array: Feature[], size: number): Feature[][] => {
    const result: Feature[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};


const PricingSection = () => {
    const standardPlans: PricingCardProps[] = [
        {
            title: "Solo Innovator",
            description: "For individual business owners and freelancers with up to 2 users",
            price: "$1499",
            features: [
                { text: "Access to one AI solution of your choice" },
                { text: "Basic dashboard and reporting" },
                { text: "Email support", info: true },
                { text: "5 automation workflows" },
                { text: "1,000 AI interactions monthly", info: true },
                { text: "Self-service onboarding" },
                { text: "Monthly performance review" },
            ],
            buttonText: "Get Started Today",
        },
        {
            title: "Business Accelerator",
            description: "For small businesses with up to 50 employees",
            price: "$2999",
            features: [
                { text: "Access to two AI solution of your choice" },
                { text: "Advanced dashboard and reporting" },
                { text: "Priority Email support", info: true },
                { text: "15 automation workflows", info: true },
                { text: "5,000 AI interactions monthly", info: true },
                { text: "Guided onboarding session" },
                { text: "API access" },
                { text: "Bi-weekly performance review" },
                { text: "Integration with 2 external systems" },
            ],
            buttonText: "Accelerate Your Business",
        },
        {
            title: "Growth Catalyst",
            description: "For mid-size businesses with 51-200 employees",
            price: "$4999",
            features: [
                { text: "Access to four AI Solution of your choice" },
                { text: "Custom Dashboard and Advanced Analytics" },
                { text: "Priority Phone and Email Support", info: true },
                { text: "30 automation workflows", info: true },
                { text: "20,000 AI interactions monthly", info: true },
                { text: "White-glove implementation" },
                { text: "Full API access with premium support" },
                { text: "Weekly performance review" },
                { text: "Integration with 5 external systems" },
                { text: "Dedicated customer success manager" },
                { text: "Custom training sessions" },
            ],
            buttonText: "Fuel Your Growth",
        },
    ];

    const enterprisePlan: PricingCardProps = {
        title: "Enterprise Transformer",
        description: "For organizations with 200+ employees requiring enterprise-grade solutions support.",
        isEnterprise: true,
        customPricing: true,
        features: [
            // Note: Figma shows "Everything on Growth Catalyst plan" twice, consolidating here.
            { text: "Everything on Growth Catalyst plan" },
            { text: "Unlimited automation workflows" },
            { text: "Unlimited AI interactions" },
            { text: "Full API access with enterprise SLA" },
            { text: "Custom integration development" },
            { text: "Dedicated solution architect" },
            { text: "Monthly executive briefings" },
        ],
        buttonText: "Contact sales",
    };

    return (
        // Section has no padding Y, container has padding Y and borders
        <section className="pricing-section relative text-white bg-[#0A0A0A] border-t border-[#18181B]" style={{ backgroundImage: "url('/images/PriceSectionBG.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}> {/* Added border-t */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]"></div> {/* Gradient fades to/from background color */}
             <div className="relative container mx-auto px-4 py-16 md:py-24 border-l border-r border-[#18181B]"> {/* Removed border, border-t-0, border-b-0. Kept border-l, border-r */}
                <div className="text-center mb-12 md:mb-16">
                    <span className="inline-block bg-gray-800 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        Pricing
                    </span>
                    <h2 className="text-3xl md:text-5xl font-semibold mb-4">
                        $2,000 worth Gen AI Consultation <span className="text-yellow-400">Free</span>
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto">
                        Get a free consultation for a limited time! Scale your business and expand globally.
                    </p>
                </div>

                {/* Standard Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
                    {standardPlans.map((plan, index) => (
                        <PricingCard key={`standard-${index}`} {...plan} />
                    ))}
                </div>

                {/* Enterprise Plan Section */}
                <div className="max-w-5xl mx-auto"> {/* Center and constrain width */}
                     <PricingCard {...enterprisePlan} />
                </div>
            </div>
        </section>
    );
};

export default PricingSection;