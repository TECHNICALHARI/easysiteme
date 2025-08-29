import Script from "next/script";
import { faqs } from "@/lib/frontend/utils/faqs";
import { plans } from "@/lib/frontend/utils/plans";

type Props = {
  page: "home" | "about" | "terms" | "privacy";
};

export default function SeoSchemas({ page }: Props) {
  const hasFaqs = Array.isArray(faqs) && faqs.length > 0;
  const nowIso = new Date().toISOString();
  const lang = "en";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "myeasypage",
    url: "https://myeasypage.com",
    logo: { "@type": "ImageObject", url: "https://myeasypage.com/og/logo.png" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: "https://myeasypage.com/#contact",
        availableLanguage: ["en", "hi"]
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "myeasypage",
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    url: "https://myeasypage.com",
    description: "Build a personal or business one-page website with your own subdomain in under a minute. No code.",
    offers: plans.map((p) => ({
      "@type": "Offer",
      price: String(p.priceValue),
      priceCurrency: "INR",
      name: `${p.name} Plan`,
      url: "https://myeasypage.com/#plans"
    })),
    publisher: { "@type": "Organization", name: "myeasypage" }
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "myeasypage Plans",
    url: "https://myeasypage.com/#plans",
    itemListElement: plans.map((p, i) => ({
      "@type": "Offer",
      position: i + 1,
      price: String(p.priceValue),
      priceCurrency: "INR",
      itemOffered: {
        "@type": "Service",
        name: `myeasypage ${p.name} Plan`,
        url: "https://myeasypage.com/#plans",
        provider: { "@type": "Organization", name: "myeasypage" }
      },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.priceValue,
        priceCurrency: "INR",
        unitText: "YEAR"
      },
      availability: "https://schema.org/InStock",
      eligibleCustomerType: "https://schema.org/IndividualCustomer"
    }))
  };

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": "https://myeasypage.com/#sitenav",
    name: [
      "Why",
      "Use cases",
      "Steps",
      "Examples",
      "Compare",
      "Plans",
      "Trust",
      "FAQ",
      "About",
      "Contact",
      "Get Started"
    ],
    url: [
      "https://myeasypage.com/#why",
      "https://myeasypage.com/#usecases",
      "https://myeasypage.com/#how-it-works",
      "https://myeasypage.com/#examples",
      "https://myeasypage.com/#comparison",
      "https://myeasypage.com/#plans",
      "https://myeasypage.com/#trust",
      "https://myeasypage.com/#faq",
      "https://myeasypage.com/about",
      "https://myeasypage.com/#contact",
      "https://myeasypage.com/create"
    ]
  };

  const homeSchemas = [
    hasFaqs
      ? {
        id: "faq-schema",
        data: {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          })),
          inLanguage: lang
        }
      }
      : null,
    {
      id: "home-breadcrumb",
      data: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://myeasypage.com/" },
          { "@type": "ListItem", position: 2, name: "Pricing", item: "https://myeasypage.com/#plans" }
        ]
      }
    },
    {
      id: "home-webpage",
      data: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://myeasypage.com/#webpage",
        url: "https://myeasypage.com/",
        name: "myeasypage — website, blog & bio link builder",
        isPartOf: { "@type": "WebSite", url: "https://myeasypage.com", name: "myeasypage" },
        description: "Create a fast website, blog and link-in-bio on your own subdomain. Start free, upgrade for custom domains and premium layouts.",
        breadcrumb: { "@id": "https://myeasypage.com/#breadcrumb" },
        primaryImageOfPage: { "@type": "ImageObject", url: "https://myeasypage.com/og/cover.png" },
        inLanguage: lang,
        dateModified: nowIso
      }
    }
  ].filter(Boolean) as { id: string; data: any }[];

  const aboutSchemas = [
    {
      id: "about-breadcrumb",
      data: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://myeasypage.com/" },
          { "@type": "ListItem", position: 2, name: "About", item: "https://myeasypage.com/about" }
        ]
      }
    },
    {
      id: "aboutpage-schema",
      data: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "https://myeasypage.com/about#aboutpage",
        name: "About myeasypage",
        url: "https://myeasypage.com/about",
        description: "myeasypage helps creators, freelancers and small businesses build fast sites, blogs and bio links without code.",
        isPartOf: { "@type": "WebSite", name: "myeasypage", url: "https://myeasypage.com" },
        inLanguage: lang,
        dateModified: nowIso
      }
    }
  ];

  const termsSchemas = [
    {
      id: "terms-breadcrumb",
      data: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://myeasypage.com/" },
          { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://myeasypage.com/terms" }
        ]
      }
    },
    {
      id: "terms-webpage",
      data: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://myeasypage.com/terms#webpage",
        url: "https://myeasypage.com/terms",
        name: "Terms of Service — myeasypage",
        description: "Terms of Service for using myeasypage: eligibility, acceptable use, payments, termination and changes.",
        isPartOf: { "@type": "WebSite", url: "https://myeasypage.com", name: "myeasypage" },
        inLanguage: lang,
        dateModified: nowIso
      }
    },
    {
      id: "terms-doc",
      data: {
        "@context": "https://schema.org",
        "@type": "TermsOfService",
        "@id": "https://myeasypage.com/terms#doc",
        name: "myeasypage Terms of Service",
        url: "https://myeasypage.com/terms",
        publisher: { "@type": "Organization", name: "myeasypage", url: "https://myeasypage.com" },
        inLanguage: lang,
        dateModified: nowIso
      }
    }
  ];

  const privacySchemas = [
    {
      id: "privacy-breadcrumb",
      data: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://myeasypage.com/" },
          { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://myeasypage.com/privacy" }
        ]
      }
    },
    {
      id: "privacy-webpage",
      data: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://myeasypage.com/privacy#webpage",
        url: "https://myeasypage.com/privacy",
        name: "Privacy Policy — myeasypage",
        description: "Privacy Policy describing how myeasypage collects, uses and protects your information.",
        isPartOf: { "@type": "WebSite", url: "https://myeasypage.com", name: "myeasypage" },
        inLanguage: lang,
        dateModified: nowIso
      }
    },
    {
      id: "privacy-doc",
      data: {
        "@context": "https://schema.org",
        "@type": "PrivacyPolicy",
        "@id": "https://myeasypage.com/privacy#doc",
        name: "myeasypage Privacy Policy",
        url: "https://myeasypage.com/privacy",
        publisher: { "@type": "Organization", name: "myeasypage", url: "https://myeasypage.com" },
        inLanguage: lang,
        dateModified: nowIso
      }
    }
  ];

  const commonSchemas = [
    { id: "org-schema", data: orgSchema },
    { id: "product-schema", data: productSchema },
    { id: "offer-catalog-schema", data: offerCatalogSchema },
    { id: "sitenav-schema", data: siteNavigationSchema }
  ];

  let pageSchemas: { id: string; data: any }[] = [];
  switch (page) {
    case "home":
      pageSchemas = homeSchemas;
      break;
    case "about":
      pageSchemas = aboutSchemas;
      break;
    case "terms":
      pageSchemas = termsSchemas;
      break;
    case "privacy":
      pageSchemas = privacySchemas;
      break;
  }

  const toRender = [...commonSchemas, ...pageSchemas];

  return (
    <>
      {toRender.map((s) => (
        <Script
          key={s.id}
          id={s.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s.data) }}
        />
      ))}
    </>
  );
}
