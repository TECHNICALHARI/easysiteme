"use client";

import Script from "next/script";

import Hero from "@/lib/frontend/main/home/Hero";
import SocialProof from "@/lib/frontend/main/home/SocialProof";
import WhySection from "@/lib/frontend/main/home/WhySection";
import UseCasesSection from "@/lib/frontend/main/home/UseCasesSection";
import StepsSection from "@/lib/frontend/main/home/StepsSection";
import UserShowcase from "@/lib/frontend/main/home/UserShowcase";
import ComparisonSection from "@/lib/frontend/main/home/ComparisonSection";
import PricingSection from "@/lib/frontend/main/home/PricingSection";
import TrustSection from "@/lib/frontend/main/home/TrustSection";
import FAQ from "@/lib/frontend/main/home/FAQ";
import ContactSection from "@/lib/frontend/main/home/ContactSection";
import CallToAction from "@/lib/frontend/main/home/CallToAction";
import SeoTextBlock from "@/lib/frontend/main/home/SeoTextBlock";
import SubscribeBand from "@/lib/frontend/main/home/SubscribeBand";

export default function Home() {
  const faqs = [
    { q: "Is myeasypage free?", a: "Yes. Start free with core blocks. Upgrade anytime for richer sections and advanced controls." },
    { q: "What makes it different from link-in-bio tools?", a: "You get a real, customizable page with rich sections (About, Services, Gallery, FAQs, Forms) on your own subdomain." },
    { q: "Do I need to code?", a: "No. Fill a form, hit publish. Your page goes live instantly." },
    { q: "Can I use a custom domain?", a: "Custom domains are available on Pro and Premium. You also get a free subdomain like yourname.myeasypage.com." },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "myeasypage",
    url: "https://myeasypage.com",
    logo: "https://myeasypage.com/og/logo.png",
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "myeasypage",
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    url: "https://myeasypage.com",
    description: "Build a personal or business one-page website with your own subdomain in under a minute. No code.",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "INR", name: "Free" },
      { "@type": "Offer", price: "199", priceCurrency: "INR", name: "Pro", priceValidUntil: "2026-12-31" },
      { "@type": "Offer", price: "499", priceCurrency: "INR", name: "Premium", priceValidUntil: "2026-12-31" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: 128 },
    publisher: { "@type": "Organization", name: "myeasypage" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://myeasypage.com/" },
      { "@type": "ListItem", position: 2, name: "Pricing", item: "https://myeasypage.com/#plans" },
    ],
  };

  return (
    <main id="main">
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Hero />
      <WhySection />
      <SocialProof />
      <UseCasesSection />
      <StepsSection />
      <UserShowcase />
      <ComparisonSection />
      <PricingSection />
      <TrustSection />
      <SeoTextBlock />
      <FAQ faqs={faqs} />
      <ContactSection />
      <CallToAction />
      <SubscribeBand />
    </main>
  );
}
