# Plan: Implement Lead Capture Modal

**Objective:** Implement a lead capture modal triggered by "Get Free Consultation" buttons on the homepage, using `shadcn/ui` components with a dark theme and specific overlay styling.

**Steps:**

1.  **Create the Lead Capture Form Component (`LeadCaptureForm.tsx`):**
    *   **Location:** `src/components/LeadCaptureForm.tsx`.
    *   **UI Components:** Utilize `shadcn/ui` components:
        *   `Input` for Name, Company Name, Email, Phone.
        *   `Textarea` for Message.
        *   `Label` for associating text with inputs.
        *   `Button` for submission.
    *   **State Management:** Use React's `useState` hook.
    *   **Submission Logic (Initial):** `onSubmit` logs data to console.
    *   **Styling:** Dark theme using Tailwind CSS.

2.  **Create the Modal Component (`LeadCaptureModal.tsx`):**
    *   **Location:** `src/components/LeadCaptureModal.tsx`.
    *   **UI Components:** Use `shadcn/ui` `Dialog` components (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogOverlay`, etc.).
    *   **Content:** Embed `LeadCaptureForm`.
    *   **Trigger:** Export `Dialog` and `DialogTrigger`.
    *   **Styling:**
        *   Dark theme for `DialogContent`.
        *   Style `DialogOverlay` with Tailwind: `bg-black/20 backdrop-blur-[10px]`.
        *   Confirm dismiss-on-overlay-click (default behavior).

3.  **Integrate Modal Trigger in `HeroSection.tsx`:**
    *   **Location:** `src/components/HeroSection.tsx`.
    *   **Modification:** Wrap "Get Free Consultation" button with `DialogTrigger`. Place `Dialog` component nearby.

4.  **Refinement & Testing:**
    *   Test trigger functionality.
    *   Verify form fields (including Company Name).
    *   Confirm dark theme application.
    *   Check overlay styling (opacity, blur) and dismiss-on-click behavior.
    *   Verify console logging on submission.

5.  **Future Steps (Out of Scope for Initial Implementation):**
    *   Develop an API endpoint for form submissions.
    *   Integrate form submission logic with the API.
    *   Add client-side and server-side validation.
    *   Implement user feedback (success/error messages).
    *   Plan for reusing the `LeadCaptureModal` component on other pages.

**Visual Flow:**

```mermaid
graph TD
    subgraph Homepage (src/app/page.tsx)
        A[HeroSection Component]
    end

    subgraph HeroSection (src/components/HeroSection.tsx)
        B(Original CTA Button) -- Becomes --> C(DialogTrigger wrapping Button)
        C -- Contains --> B
        C -- Triggers --> D(Dialog Component)
    end

    subgraph LeadCaptureModal (src/components/LeadCaptureModal.tsx)
        D -- Contains --> D_Overlay[DialogOverlay (Opacity: 20%, Blur: 10px)]
        D -- Contains --> E(DialogContent - Dark Theme)
        E -- Contains --> F(LeadCaptureForm Component)
    end

    subgraph LeadCaptureForm (src/components/LeadCaptureForm.tsx)
        F --> G[Inputs: Name, Company Name, Email, Phone]
        F --> H[Textarea: Message]
        F --> I[Submit Button]
    end

    I -- onClick --> J{Handle Submit (Log to Console)}
    D_Overlay -- onClick --> K{Dismiss Modal}

    style E fill:#333,stroke:#fff,stroke-width:2px,color:#fff
    style F fill:#444,stroke:#fff,stroke-width:1px,color:#fff
    style D_Overlay fill:rgba(0,0,0,0.2),stroke:none