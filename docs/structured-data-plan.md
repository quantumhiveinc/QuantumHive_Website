# Structured Data Implementation Plan

## Investigation Summary

An analysis of the website codebase revealed the following status regarding structured data implementation:

*   **Implemented:**
    *   `Organization` (in `src/app/layout.tsx`)
    *   `WebSite` (in `src/app/layout.tsx`)
*   **Not Implemented:**
    *   `FAQPage` (in `src/components/FAQSection.tsx`)
    *   `Service` / `Product` (in `src/components/SolutionsSection.tsx`)
    *   `Offer` / `Product` (in `src/components/PricingSection.tsx`)
    *   `Review` (in `src/components/TestimonialsSection.tsx`)
    *   `Article` / `Quotation` (in `src/components/CaseStudiesSection.tsx`)

## Proposed Plan

The goal is to add relevant structured data schemas to the components where they are currently missing, enhancing SEO and providing richer context to search engines.

1.  **Strategy:** Implement JSON-LD structured data within `<script type="application/ld+json">` tags inside each relevant React component. This keeps the data definition close to the content it describes.
2.  **Schemas to Add:**
    *   **`FAQPage`:** In `FAQSection.tsx`, map the `faqData` array to the required `Question` and `acceptedAnswer` structure within the JSON-LD script.
    *   **`Service`:** In `SolutionsSection.tsx`, define multiple `Service` items (one for each solution like NexusAI, InsightIQ, etc.) with properties like `name`, `description`, and `provider` (linking back to the main `Organization`).
    *   **`Offer`:** In `PricingSection.tsx`, define multiple `Offer` items corresponding to the pricing plans. Include `name`, `description`, `price`, `priceCurrency`, and link them to the relevant `Service` using `itemOffered`. Handle the custom pricing for the Enterprise plan appropriately.
    *   **`Review`:** In `TestimonialsSection.tsx`, define multiple `Review` items. Extract the `reviewBody` (quote), `author` (as a `Person` object), and potentially `itemReviewed` (pointing to the `Organization`).
    *   **`Quotation`:** In `CaseStudiesSection.tsx`, define multiple `Quotation` items. Use the quote text for `text` and the author details for `spokenByCharacter` (as a `Person` object with `name` and `jobTitle`).
3.  **Integration:** Ensure the generated JSON-LD is valid and correctly embedded within the component's render output.

## Visualization

```mermaid
graph TD
    A[layout.tsx] --> B(Organization Schema);
    A --> C(WebSite Schema);

    D[page.tsx] --> E(FAQSection.tsx);
    D --> F(SolutionsSection.tsx);
    D --> G(PricingSection.tsx);
    D --> H(TestimonialsSection.tsx);
    D --> I(CaseStudiesSection.tsx);

    subgraph Proposed Additions
        E -- Add --> J(FAQPage Schema);
        F -- Add --> K(Service Schema);
        G -- Add --> L(Offer Schema);
        H -- Add --> M(Review Schema);
        I -- Add --> N(Quotation Schema);
    end

    style J fill:#f9f,stroke:#333,stroke-width:2px
    style K fill:#f9f,stroke:#333,stroke-width:2px
    style L fill:#f9f,stroke:#333,stroke-width:2px
    style M fill:#f9f,stroke:#333,stroke-width:2px
    style N fill:#f9f,stroke:#333,stroke-width:2px