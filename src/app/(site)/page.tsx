import CallToAction from '@/lib/frontend/main/home/CallToAction';
import ContactSection from '@/lib/frontend/main/home/ContactSection';
import FAQ from '@/lib/frontend/main/home/FAQ';
import Hero from '@/lib/frontend/main/home/Hero';
import PricingSection from '@/lib/frontend/main/home/PricingSection';
import TrustSection from '@/lib/frontend/main/home/TrustSection';
import UseCasesSection from '@/lib/frontend/main/home/UseCasesSection';
import UserShowcase from '@/lib/frontend/main/home/UserShowcase';
import WhySection from '@/lib/frontend/main/home/WhySection';

export default function Home() {
  return (
    <main>
      <Hero />
      <WhySection />
      <UseCasesSection />
      <UserShowcase />
      <PricingSection />
      <TrustSection />
      <FAQ />
      <ContactSection />
      <CallToAction />
    </main>
  );
}
