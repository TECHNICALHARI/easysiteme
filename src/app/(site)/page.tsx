// app/page.tsx  (Home)

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
import SubscribeBand from "@/lib/frontend/main/home/SubscribeBand";

import SeoSchemas from "@/lib/frontend/common/SeoSchemas";

export default function Home() {
  const faqs = [
    { q: "Is myeasypage free?", a: "Yes. Start free with core blocks. Upgrade anytime for richer sections and advanced controls." },
    { q: "What makes it different from link-in-bio tools?", a: "You get a real, customizable page with rich sections (About, Services, Gallery, FAQs, Forms) on your own subdomain." },
    { q: "Do I need to code?", a: "No. Fill a form, hit publish. Your page goes live instantly." },
    { q: "Can I use a custom domain?", a: "Custom domains are available on Pro and Premium. You also get a free subdomain like yourname.myeasypage.com." },
    { q: "Can I switch between bio link and website layouts?", a: "Yes. You can start with a simple bio link and switch to a full website layout anytime without losing content." },
    { q: "Does myeasypage support blogs?", a: "Yes. You can write blog posts with titles, cover images, and SEO fields built-in." },
    { q: "Will my site be SEO friendly?", a: "Absolutely. Pages include clean URLs, meta tags, and fast loading for better search ranking." },
    { q: "Do I need hosting?", a: "No. Hosting is included. Your site is served globally from edge servers for speed and reliability." }
  ];

  const plans = [
    { name: "Free", priceValue: 0, price: "₹0" },
    { name: "Pro", priceValue: 199, price: "₹199/year" },
    { name: "Premium", priceValue: 499, price: "₹499/year" },
  ];

  return (
    <main id="main">
      <SeoSchemas page="home" faqs={faqs} plans={plans} />

      <Hero />
      <WhySection />
      <SocialProof />
      <UseCasesSection />
      <StepsSection />
      <UserShowcase />
      <ComparisonSection />
      <PricingSection />
      <TrustSection />
      <FAQ faqs={faqs} />
      <ContactSection />
      <CallToAction />
      <SubscribeBand />
    </main>
  );
}
