import { FileText, FileCheck, Settings } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Unesi projekt",
    description: "Odgovori na nekoliko pitanja i dobij okvirnu procjenu",
  },
  {
    icon: FileCheck,
    number: "02",
    title: "Dobij plan i ponudu",
    description: "Spajamo te s provjerenim izvođačima i definiramo trošak i rok",
  },
  {
    icon: Settings,
    number: "03",
    title: "Mi vodimo projekt",
    description: "Koordiniramo radove i brinemo da sve ide po planu",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-warm-grey overflow-hidden">
      <div className="container-narrow">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Kako funkcionira
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
              Tri jednostavna koraka
            </h2>
          </div>
        </ScrollReveal>

        {/* Steps - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.15}>
              <div className="relative flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Step Number */}
                <span className="text-sm font-bold text-primary/60 uppercase tracking-wider mb-3">
                  Korak {step.number}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  {step.description}
                </p>

                {/* Connector Line (hidden on mobile, visible on desktop between items) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-40%)] h-[2px] bg-gradient-to-r from-border to-transparent" />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
