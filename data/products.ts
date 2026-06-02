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
  quoteNote: string;
  moq: string;
  packaging: string;
  highlights: string[];
  sourcingNotes: string[];
  inquiryTips: string[];
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
    quoteNote:
      "Final cost may vary by destination country and shipping method.",
    moq: "Small order can be discussed.",
    packaging:
      "Standard packaging is available. Gift or multi-item packaging can be discussed.",
    highlights: [
      "Lightweight daily travel design",
      "Suitable for cross-border shipping",
      "Clean product storytelling layout",
      "Good for gift and lifestyle positioning",
    ],
    sourcingNotes: [
      "Suitable for everyday use, travel packing, and simple gift orders.",
      "Share your destination country so we can discuss delivery and final cost.",
    ],
    inquiryTips: [
      "Tell us how many pieces you want to order.",
      "Ask about shipping, packaging, or gift use before payment.",
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
    quoteNote:
      "Final cost may vary by destination country and shipping method.",
    moq: "Small order can be discussed.",
    packaging:
      "Standard packaging is available. Gift or multi-item packaging can be discussed.",
    highlights: [
      "Easy to understand for overseas customers",
      "Simple SKU for early store testing",
      "Works well with lifestyle photography",
      "Suitable for brand-led landing pages",
    ],
    sourcingNotes: [
      "Good for daily shopping, work, weekend use, and casual gifting.",
      "If you need logo printing or special packaging, include that in your request.",
    ],
    inquiryTips: [
      "Tell us if you want a single item, a small batch, or a larger order.",
      "Include your country so we can discuss shipping before payment.",
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
      "A practical product example for a cross-border independent store where buyers can ask questions before checkout is ready.",
    quoteNote:
      "Final cost may vary by destination country and shipping method.",
    moq: "Small order can be discussed.",
    packaging:
      "Standard packaging is available. Gift or multi-item packaging can be discussed.",
    highlights: [
      "Small and lightweight product example",
      "Clear use case for overseas customers",
      "Good for bundle and upsell practice",
      "Simple enough for first MVP testing",
    ],
    sourcingNotes: [
      "Useful for home-office desks, small gifts, and simple accessory sets.",
      "Final order details should confirm kit contents, delivery country, and shipping preference.",
    ],
    inquiryTips: [
      "Tell us which kit contents you are interested in.",
      "Ask about delivery options and packaging before payment.",
    ],
  },
];
