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
    quoteNote: "Quote based on quantity and packaging requirements",
    moq: "MOQ can be discussed for trial and bulk inquiry",
    packaging: "Retail-ready or simple export packaging can be discussed",
    highlights: [
      "Lightweight daily travel design",
      "Suitable for cross-border shipping",
      "Clean product storytelling layout",
      "Good for gift and lifestyle positioning",
    ],
    sourcingNotes: [
      "Suitable for buyer testing, gift sets, and lightweight travel accessory programs.",
      "Packaging, color selection, and order quantity should be confirmed before quotation.",
    ],
    inquiryTips: [
      "Share target quantity and destination country.",
      "Mention whether you need sample order, trial order, or bulk quotation.",
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
    quoteNote: "Quote based on quantity, packaging, and branding needs",
    moq: "MOQ can be discussed for wholesale or brand testing",
    packaging: "Plain packaging or branded packaging can be reviewed",
    highlights: [
      "Easy to understand for overseas customers",
      "Simple SKU for early store testing",
      "Works well with lifestyle photography",
      "Suitable for brand-led landing pages",
    ],
    sourcingNotes: [
      "Good fit for lifestyle, retail, event, and promotional sourcing discussions.",
      "Branding method, material weight, and carton requirements can affect the final quote.",
    ],
    inquiryTips: [
      "Tell us if you need logo printing or neutral stock.",
      "Include your estimated quantity range and target delivery market.",
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
      "A low-risk sample product for learning independent store structure, product cards, RFQ flow, and inquiry conversion.",
    quoteNote: "Quote based on bundle contents and quantity",
    moq: "MOQ can be discussed for sample kits and bulk orders",
    packaging: "Compact export packaging or small retail kit packaging available for discussion",
    highlights: [
      "Small and lightweight product example",
      "Clear use case for overseas customers",
      "Good for bundle and upsell practice",
      "Simple enough for first MVP testing",
    ],
    sourcingNotes: [
      "Useful for home-office bundles, workplace kits, and small accessory programs.",
      "Final quote should confirm bundle contents, packaging format, and destination.",
    ],
    inquiryTips: [
      "List the kit quantity and any preferred accessory combination.",
      "Share shipping destination and whether you need individual retail packaging.",
    ],
  },
];
