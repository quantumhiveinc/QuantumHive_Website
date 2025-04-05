# Refactoring Plan: Dynamic Content Management

**Goal:** Transition Blog posts, Case Studies, and Industries from static arrays to dynamic content managed via a custom admin interface, stored in a PostgreSQL database, with automatic URL-friendly slug generation.

**1. Database Setup & Schema:**

*   **Technology:** PostgreSQL.
*   **Setup:** Provision a PostgreSQL database instance (locally for development, and a hosted solution like Supabase, Neon, or AWS RDS for production).
*   **Tables:** Create three main tables: `BlogPosts`, `CaseStudies`, and `Industries`.
    *   **Initial Schema (Example - `BlogPosts`):**
        *   `id`: SERIAL PRIMARY KEY (or UUID)
        *   `title`: VARCHAR(255) NOT NULL
        *   `slug`: VARCHAR(255) UNIQUE NOT NULL (indexed for fast lookups)
        *   `description`: TEXT
        *   `content`: TEXT (or JSON/JSONB for structured content)
        *   `published_at`: TIMESTAMP WITH TIME ZONE
        *   `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        *   `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        *   *(Other fields like `author_id`, `featured_image_url`, `tags` can be added later)*
    *   Similar tables will be created for `CaseStudies` and `Industries`, adapting fields as necessary.
*   **ORM:** Integrate Prisma ORM to manage database schema migrations and provide type-safe database access.

**2. Backend API Layer (Next.js API Routes):**

*   **Location:** Create API routes under `src/app/api/admin/`.
*   **Endpoints:** Implement RESTful endpoints for each content type (`blog`, `case-studies`, `industries`):
    *   `POST /api/admin/[contentType]`: Create a new item.
    *   `GET /api/admin/[contentType]`: List all items (for admin view).
    *   `GET /api/admin/[contentType]/{id}`: Get a single item by ID (for editing).
    *   `PUT /api/admin/[contentType]/{id}`: Update an existing item.
    *   `DELETE /api/admin/[contentType]/{id}`: Delete an item.
*   **Slug Generation:**
    *   Implement a utility function (e.g., `generateUniqueSlug(title, contentType)`) used within the `POST` and `PUT` handlers.
    *   This function will:
        *   Convert the input `title` to lowercase.
        *   Replace spaces and non-alphanumeric characters (except hyphens) with hyphens.
        *   Remove leading/trailing/duplicate hyphens.
        *   Query the database (using Prisma) to check if the generated slug already exists for that content type.
        *   If it exists, append `-1`, `-2`, etc., checking for uniqueness at each step, until a unique slug is found.
        *   Return the unique slug.
*   **Authentication & Authorization:**
    *   Integrate an authentication solution (e.g., NextAuth.js) to protect the `/api/admin/` routes.
    *   Ensure only authenticated users with appropriate roles (e.g., 'ADMIN') can access these endpoints.

**3. Admin Interface:**

*   **Location:** Create protected routes under `/admin` (e.g., `/admin/blog`, `/admin/case-studies`).
*   **UI Components:** Develop React components using Shadcn UI (already in use) for:
    *   Login form (if using credentials provider with NextAuth.js).
    *   Dashboard/Navigation for admin sections.
    *   Data tables to list existing content items (with edit/delete buttons).
    *   Forms (using `react-hook-form` potentially) for creating and editing content, including fields for title, description, content (perhaps a Markdown editor like `react-markdown` or a WYSIWYG editor), etc.
*   **Functionality:** These components will fetch data from and send data to the backend API endpoints defined in Step 2.

**4. Frontend Integration (Public Pages):**

*   **Data Fetching:**
    *   Modify `src/app/blog/page.tsx`, `src/app/case-studies/page.tsx`, `src/app/industries/page.tsx` to be server components.
    *   Fetch the list of published items directly from the database using Prisma within these server components (no need to call the API routes for public reads).
    *   Map over the fetched data to render the cards/links.
*   **Dynamic Routes:**
    *   Create dynamic route files:
        *   `src/app/blog/[slug]/page.tsx`
        *   `src/app/case-studies/[slug]/page.tsx`
        *   `src/app/industries/[slug]/page.tsx`
    *   These pages will be server components that fetch the specific item's data from the database using Prisma based on the `slug` parameter from the URL.
    *   Implement `generateStaticParams` in these dynamic route files to pre-render pages at build time for better performance and SEO (fetching all published slugs).
*   **Links:** Update all `<Link>` components to use the dynamic `slug` field from the fetched data.

**5. Technology Stack Summary:**

*   **Framework:** Next.js (App Router)
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js (Recommended)
*   **UI:** React, Tailwind CSS, Shadcn UI
*   **State Management (Admin):** React Context or Zustand (if needed for complex admin state)
*   **Forms (Admin):** react-hook-form (Recommended)

**Diagram:**

```mermaid
graph TD
    subgraph User_Interfaces
        A[Admin User] --> B[Admin UI (/admin/*)];
        G[Public User] --> H[Public Pages (/blog, /case-studies/*, etc.)];
    end

    subgraph Next.js_Application
        B -- Fetches/Mutates --> C{API Routes (/api/admin/*)};
        H -- Reads Data --> I[Server Components / Data Fetching];
        C -- Uses --> D[Prisma Client];
        I -- Uses --> D;
        C -- Uses --> F[Slug Generation Util];
        C -- Protected By --> J[Authentication (NextAuth.js)];
    end

    subgraph Database_Layer
        D -- Interacts --> E[(PostgreSQL Database)];
    end

    subgraph Infrastructure
        E
    end

    %% Styling
    classDef db fill:#f9f,stroke:#333,stroke-width:2px;
    classDef api fill:#ccf,stroke:#333,stroke-width:2px;
    classDef ui fill:#cfc,stroke:#333,stroke-width:2px;
    classDef logic fill:#ffc,stroke:#333,stroke-width:2px;

    class A,G ui;
    class B,H ui;
    class C api;
    class I logic;
    class D,F logic;
    class J logic;
    class E db;
```

**Next Steps:**

1.  **Define Fields:** Detail the specific fields required for Blog Posts, Case Studies, and Industries.
2.  **Implementation:** Proceed with setting up the database, ORM, authentication, API routes, admin UI, and frontend integration.