export type PlanDataType = {
  id: string;
  name: string;
  price: string;
  official?: string;
  offer?: string;
  amount?: number;
  cta: string;
  features: string[];
  highlight?: boolean;
  tag?: string;
};

export const PlanData: PlanDataType[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    cta: "Start Free",
    features: [
      "Website + Bio link",
      "Basic blog (up to 5 posts)",
      "2 links & 1 header",
      "Fixed theme",
      "myeasypage subdomain",
      "Branding visible",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹199/year",
    official: "₹299",
    offer: "₹199",
    amount: 19900,
    cta: "Go Pro",
    features: [
      "Custom domain support",
      "Rich About & Gallery",
      "Contact form & Google Map",
      "3 premium services",
      "Embeds (YouTube, Calendly)",
      "Remove branding",
      "Up to 20 blog posts",
      "Priority email support",
    ],
    highlight: true,
    tag: "Most popular",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹499/year",
    official: "₹599",
    offer: "₹499",
    amount: 49900,
    cta: "Upgrade",
    features: [
      "Everything in Pro plan",
      "Advanced premium themes",
      "Testimonials & FAQs",
      "Featured media section",
      "Up to 10 services",
      "Email subscriber section",
      "Up to 50 posts",
      "Top-tier priority support",
    ],
    highlight: false,
  },
];
