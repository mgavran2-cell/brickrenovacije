import { ClipboardList, Users, Hammer, KeyRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Opišite projekt",
    description: "Ispunite jednostavan upitnik i recite nam što želite renovirati. Bez obaveza, bez skrivenih troškova.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
  },
  {
    icon: Users,
    number: "02",
    title: "Dobijte ponude",
    description: "Povežemo vas s provjerenim izvođačima koji šalju transparentne i detaljne ponude za usporedbu.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
  },
  {
    icon: Hammer,
    number: "03",
    title: "Pratite napredak",
    description: "Naš tim koordinira radove dok vi pratite sve kroz aplikaciju u realnom vremenu.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
  },
  {
    icon: KeyRound,
    number: "04",
    title: "Uživajte u novom prostoru",
    description: "Preuzimate ključeve renoviranog doma — bez stresa, bez iznenađenja, s punom garancijom.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
];

const ProcessSection = () => {
  return (
    <section id="kako-funkcionira" className="section-padding bg-background overflow-hidden scroll-mt-24">
      <div className="container-narrow">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Kako funkcionira
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
              Od ideje do ključeva u 4 koraka
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-md">
            Renovacija ne mora biti komplicirana. Mi smo tu da vam olakšamo svaki korak puta.
          </p>
        </div>

        {/* Steps - Large Cards */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative grid lg:grid-cols-2 gap-0 bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-elevated opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "forwards" }}
            >
              {/* Content Side */}
              <div className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-6xl font-bold text-primary/20">{step.number}</span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {step.description}
                </p>

                {index === steps.length - 1 && (
                  <Button className="w-fit group/btn">
                    Započnite sada
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>

              {/* Image Side */}
              <div className={`relative aspect-[4/3] lg:aspect-auto min-h-[300px] ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <img
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent lg:hidden" />
              </div>

              {/* Step Indicator Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-[2px] h-12 bg-gradient-to-b from-primary/50 to-transparent z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Prosječno vrijeme do prve ponude: 48 sati</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Bez skrivenih troškova</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Provjereni izvođači</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Garancija na radove</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
