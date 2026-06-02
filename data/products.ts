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
    slug: "botanical-herbal-tea-sampler",
    name: "Botanical Herbal Tea Sampler",
    category: "Herbal Tea",
    price: 19,
    currency: "USD",
    image: "/products/botanical-herbal-tea-sampler.jpg",
    shortDescription:
      "A light herbal tea sampler for daily tea moments, gifting, and first-time cross-border orders.",
    description:
      "A simple herbal tea sampler designed for personal buyers who want to explore natural tea flavors before placing a larger order. It is suitable for daily routines, small gifts, and international order requests before online checkout is ready.",
    quoteNote:
      "Final cost may vary by destination country, shipping method, and selected quantity.",
    moq: "Small orders are welcome. Larger quantities can also be discussed.",
    packaging:
      "Standard pouch packaging is available. Gift box packaging can be discussed before payment.",
    highlights: [
      "Friendly starter option for first-time buyers",
      "Suitable for daily tea routines and small gifts",
      "Lightweight for international shipping discussion",
      "Good fit for sample orders before larger purchases",
    ],
    sourcingNotes: [
      "Good for buyers who want to try different herbal tea flavors in one small set.",
      "Share your destination country so we can discuss shipping estimate and final cost.",
    ],
    inquiryTips: [
      "Tell us how many sampler sets you want to order.",
      "Ask about flavor mix, packaging, delivery time, or gift use before payment.",
    ],
  },
  {
    id: "p002",
    slug: "daily-wellness-tea-gift-box",
    name: "Daily Wellness Tea Gift Box",
    category: "Tea Gift Set",
    price: 39,
    currency: "USD",
    image: "/products/daily-wellness-tea-gift-box.jpg",
    shortDescription:
      "A gift-ready herbal tea box for personal wellness routines, seasonal gifts, and small cross-border orders.",
    description:
      "A clean and gift-friendly herbal tea set for personal buyers who want a natural-looking tea gift without complicated ordering. Buyers can request availability, shipping details, and packaging options before payment.",
    quoteNote:
      "Final cost may vary by destination country, gift packaging option, and shipping method.",
    moq: "Single gift box or small orders can be discussed.",
    packaging:
      "Gift-ready box packaging is available. Custom card or multi-box packaging can be discussed.",
    highlights: [
      "Gift-ready presentation for personal buyers",
      "Suitable for holidays, birthdays, and everyday gifting",
      "Clear product story for cross-border shoppers",
      "Packaging options can be confirmed before payment",
    ],
    sourcingNotes: [
      "Good for personal gifts, tea lovers, and buyers looking for a natural-style gift set.",
      "If you need gift packaging, message card, or multiple boxes, include that in your request.",
    ],
    inquiryTips: [
      "Tell us whether this is for yourself or for a gift.",
      "Include your country and expected quantity so we can discuss delivery and final price.",
    ],
  },
  {
    id: "p003",
    slug: "chinese-herbal-flower-tea-pack",
    name: "Chinese Herbal Flower Tea Pack",
    category: "Flower Tea",
    price: 24,
    currency: "USD",
    image: "/products/chinese-herbal-flower-tea-pack.jpg",
    shortDescription:
      "A flower tea pack inspired by Chinese herbal tea culture, suitable for casual drinking and thoughtful gifting.",
    description:
      "A flower tea product for buyers interested in Chinese-style herbal tea, natural ingredients, and calm daily tea moments. It is designed for cross-border product testing, small personal orders, and order requests before checkout is fully available.",
    quoteNote:
      "Final cost may vary by destination country, selected pack size, and shipping method.",
    moq: "Small orders are welcome. Multi-pack orders can also be discussed.",
    packaging:
      "Standard sealed packaging is available. Gift-style packaging can be discussed.",
    highlights: [
      "Inspired by Chinese herbal tea culture",
      "Suitable for personal tea routines and small gifts",
      "Simple lightweight product for international order requests",
      "Pack size and packaging can be confirmed before payment",
    ],
    sourcingNotes: [
      "Good for buyers who want a gentle flower tea option with a clear cultural story.",
      "Final order details should confirm pack size, destination country, and shipping preference.",
    ],
    inquiryTips: [
      "Tell us which pack size or quantity you are interested in.",
      "Ask about ingredients, packaging, delivery options, and final cost before payment.",
    ],
  },
];
