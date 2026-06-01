export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  shortDescription: string;
  description: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    id: "p001",
    slug: "minimal-travel-organizer",
    name: "Minimal Travel Organizer",
    category: "Travel Accessories",
    price: 29,
    currency: "USD",
    image: "/products/travel-organizer.jpg",
    shortDescription:
      "A compact organizer designed for daily carry, travel, and lightweight packing.",
    description:
      "Built for cross-border shoppers who want practical, simple, and reliable travel accessories. This product card is sample data for our independent store MVP.",
    highlights: [
      "Lightweight daily travel design",
      "Suitable for cross-border shipping",
      "Clean product storytelling layout",
      "Good for gift and lifestyle positioning",
    ],
  },
  {
    id: "p002",
    slug: "everyday-canvas-tote",
    name: "Everyday Canvas Tote",
    category: "Lifestyle Bags",
    price: 39,
    currency: "USD",
    image: "/products/canvas-tote.jpg",
    shortDescription:
      "A simple canvas tote for work, shopping, weekend use, and casual lifestyle scenes.",
    description:
      "A flexible lifestyle product for testing product detail pages, product benefits, and brand storytelling in a cross-border DTC storefront.",
    highlights: [
      "Easy to understand for overseas customers",
      "Simple SKU for early store testing",
      "Works well with lifestyle photography",
      "Suitable for brand-led landing pages",
    ],
  },
  {
    id: "p003",
    slug: "desk-cable-kit",
    name: "Desk Cable Kit",
    category: "Home Office",
    price: 19,
    currency: "USD",
    image: "/products/desk-cable-kit.jpg",
    shortDescription:
      "A small home-office accessory kit for cleaner desks and better cable management.",
    description:
      "A low-risk sample product for learning independent store structure, product cards, checkout flow, and inquiry conversion.",
    highlights: [
      "Small and lightweight product example",
      "Clear use case for overseas customers",
      "Good for bundle and upsell practice",
      "Simple enough for first MVP testing",
    ],
  },
];