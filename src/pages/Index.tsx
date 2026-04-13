import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import EstimatorSection from "@/components/sections/EstimatorSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ServicesSection from "@/components/sections/ServicesSection";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import TrustSection from "@/components/sections/TrustSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <EstimatorSection />
        <HowItWorksSection />
        <ServicesSection />
        <BeforeAfterSection />
        <TrustSection />
        <AboutSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
