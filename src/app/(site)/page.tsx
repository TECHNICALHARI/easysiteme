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
  return (
    <main id="main">
      <SeoSchemas page="home" />
      <Hero />
      <WhySection />
      <SocialProof />
      <UseCasesSection />
      <StepsSection />
      <UserShowcase />
      <ComparisonSection />
      <PricingSection />
      <TrustSection />
      <FAQ />
      <ContactSection />
      <CallToAction />
      <SubscribeBand />
    </main>
  );
}
