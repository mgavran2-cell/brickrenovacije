import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-brick-dark p-12 lg:p-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight">
              Spremni za svoju renovaciju iz snova?
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Zatražite besplatnu procjenu danas i započnite transformaciju svog doma 
              bez stresa, skrivenih troškova i briga.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-background text-foreground hover:bg-background/90 shadow-floating"
              >
                Zatraži besplatnu procjenu
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Razgovarajmo
              </Button>
            </div>

            {/* Trust Note */}
            <p className="mt-8 text-sm text-primary-foreground/60">
              Bez obaveza • Odgovaramo u roku 24 sata • 100% besplatno
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
