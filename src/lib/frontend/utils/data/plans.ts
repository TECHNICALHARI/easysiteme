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
      "Website + Bio link layout",
      "Up to 3 links & 2 headers",
      "1 embed (YouTube, Calendly, etc.)",
      "Basic About section",
      "myeasypage subdomain",
      "Branding visible",
      "Social icons enabled",
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
      "Up to 15 links & 5 headers",
      "5 embeds (YouTube, Calendly, etc.)",
      "3 services & 5 FAQs",
      "5 testimonials & 5 featured items",
      "Contact form + Google Map",
      "Upload resume & banner image",
      "Custom themes & layout switch",
      "Remove branding",
      "Show email subscribers",
      "Full SEO settings",
      "Basic stats dashboard",
      "Up to 5 blog posts",
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
      "Up to 50 links & 10 headers",
      "10 embeds & 10 services",
      "10 FAQs & 10 testimonials",
      "20 featured items",
      "Advanced premium themes",
      "Show email subscribers",
      "Full branding control",
      "Advanced stats dashboard",
      "Up to 20 blog posts",
      "Top-tier priority support",
    ],
    highlight: false,
  },
];
