### 🧾 System Requirement for Cursor: Drake-Style Online Store with Shopify Backend

**Project Title:** Custom Shopify-Integrated Online Storefront

**Objective:**
Build a fully custom online store using **Next.js** for the frontend and **Shopify** for the backend. This store should **not use Shopify themes** or Liquid. It should function similarly to **Drake's merch site**, allowing users to explore visual drop-style collections via interactive images and purchase through a custom cart system.

---

### ✅ Functional Requirements

1. **Frontend (Next.js)**

   * Build the UI using **Next.js (App Router or Pages Router)**
   * Use **TailwindCSS** or modern design system for styling
   * Implement **responsive design** for mobile and desktop

2. **Product Display**

   * Fetch products from Shopify's **Storefront API (GraphQL)**
   * Display products in spofiy shop via **clickable image maps**

     * Each image should have absolute-positioned regions linking to specific products outside of custom UI. They should link to the shopify product page
     * On Hover the products title is displayed

3. **Cart Functionality**

   * Build a **custom cart UI**
   * Use Shopify's **Cart API** to:

     * Create a cart session
     * Add/update/remove items
     * Display totals and checkout URL

4. **Checkout Integration**

   * After adding to cart, user should proceed to **Shopify-hosted checkout** (via checkout URL)

5. **Customer Login & Account**

   * Build custom login and register forms
   * Use `customerAccessTokenCreate` and other Storefront API mutations to authenticate
   * Store access tokens securely (localStorage or secure cookies)

6. **Image-Based Product Drops**

   * Create a component to render large marketing images with clickable zones (using x/y positions)
   * Link each zone to a product page or add directly to cart

---

### 🔐 Backend / API

* Use **Shopify Storefront API** for all product, cart, and customer logic
* Optional: abstract all Shopify calls through a centralized API utility (`/lib/shopify.ts`)
* Authentication tokens should be securely stored and reused across sessions

---

### 🧰 Tools & Tech Stack

* **Frontend**: Next.js, React, TailwindCSS
* **Backend/API**: Shopify Storefront API (GraphQL), Cart API
* **Auth**: Shopify Customer API
* **Image Drop Map**: Custom component using absolute positioning
* **Deployment**: Vercel or Netlify
* **Environment Variables**: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` 