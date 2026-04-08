# Project Architecture & Technology Manifest
**K-Mart Online Clothes Store**

This document serves as a high-level architecture overview and technological manifest for the K-Mart Online eCommerce Store. It details the precise stack choices, design decisions, and infrastructure used to build a highly scalable headless ecommerce experience.

---

## 1. The Frontend Application
The storefront is built to be a lightning-fast, highly interactive Single Page Application (SPA).

*   **Core Framework**: **React.js** heavily utilizing Functional Components and Hooks.
*   **Build Tool**: **Vite.js** - Chosen over Create-React-App for its significantly faster hot-module replacement (HMR), lightweight build outputs, and native ES modules support.
*   **Routing**: **React Router DOM v6** for seamless client-side SPA navigation.
*   **Global State Management**: Built-in **React Context API** (`CartContext`) to natively provide high-performance reactive updates to the Navbar badge and Cart states without the overhead of heavy third-party libraries like Redux.
*   **Iconography**: **Lucide React** - An open-source, highly customizable icon library used uniformly across the Navbar, product grids, and Cart.

## 2. Design System & Aesthetics
Instead of heavily opinionated frameworks like Tailwind, this project uses a custom design syntax for extreme control and distinctiveness.

*   **Vanilla CSS**: Global styling using root variables (`index.css`) establishing a cohesive design token system.
*   **Aesthetic Pattern**: **Modern Glassmorphism** (frosted glass) layouts across semantic components (`Navbar`, `ProductCard`, `Cart`).
*   **Typography**: Clean, beautiful **Inter** Google Font natively imported for modern readability.
*   **Micro-interactions**: Subtle hover state transforms, staggered CSS fade-in animations on active scroll, and smooth loading spinners (`lucide-react`) for a premium user feel.

## 3. The Backend Infrastructure
The backend logic acts totally independently from the frontend, adhering strictly to **Headless Commerce architecture**.

*   **Commerce Engine**: **MedusaJS (v2)** - An open-source, highly extensible Node.js headless commerce framework. This serves as the definitive source of truth for all products, carts, pricing, and checkouts, replacing closed-ecosystem platforms like Shopify.
*   **API Pattern**: Native **built-in REST API endpoints** exposed by Medusa and securely requested securely from the client-side via a minimal custom `src/lib/medusa.js` fetch wrapper, passing session IDs globally via `localStorage`.
*   **Database**: **PostgreSQL** - Running natively on the backend server environment to securely maintain product schemas.
*   **Query Performance Accelerator**: **Medusa Native In-Memory Cache** - A native Node.js memory caching module directly utilized by Medusa to simulate high-bandwidth memory pooling (similar to Redis setup). This allows massive amounts of Product Search queries (`?q=`) to be served directly from server RAM without triggering database hits, radically increasing frontend search speeds.

## 4. Deployment Strategy
*   **Version Control**: Fully tracked and preserved on **Git** / **GitHub**.
*   **Hosting**: **Netlify** / Static Platforms.
*   **SPA Configurations**: Utilizes a raw `_redirects` file configuring `/* /index.html 200` wildcard rewrite rules to securely permit Netlify routers to yield internal processing control back to React Router on direct page refreshes.

---
*Built flawlessly through modern full-stack development patterns.*
