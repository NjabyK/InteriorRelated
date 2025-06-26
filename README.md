# Interior Related - Drake-Style Online Store

A custom Shopify-integrated online storefront built with Next.js, featuring an interactive image-based product discovery experience inspired by Drake's merch site.

## Features

- **Interactive Product Discovery**: Clickable hotspots on hero images that link to specific products
- **Custom Cart System**: Full Shopify cart integration with custom UI
- **Customer Authentication**: Secure login system using Shopify's Customer API
- **Responsive Design**: Optimized for both mobile and desktop experiences
- **Drag-to-Scroll**: Interactive scrolling experience on hero images
- **Modern UI**: Built with TailwindCSS and modern design patterns

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS v4, tw-animate-css
- **Backend**: Shopify Storefront API (GraphQL)
- **Authentication**: Shopify Customer API
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- Shopify store with Storefront API access
- Environment variables configured

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interiorrelated
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes for Shopify integration
│   ├── components/    # React components
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page with interactive hero
├── components/
│   └── ui/           # Reusable UI components
└── lib/
    ├── shopify.ts    # Shopify API utilities
    ├── utils.ts      # Utility functions
    └── useDragScroll.ts # Custom drag scroll hook
```

## Key Components

- **Hero Image with Hotspots**: Interactive product discovery on the main page
- **Cart System**: Full cart management with Shopify integration
- **Login Modal**: Customer authentication system
- **Product Modal**: Quick product preview and add-to-cart functionality

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The project is configured for easy deployment on Vercel. Simply connect your repository and configure the environment variables.

## License

This project is private and proprietary.
