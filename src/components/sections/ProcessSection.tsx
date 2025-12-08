import { ClipboardList, Users, Hammer, KeyRound } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Opišite projekt",
    description: "Ispunite jednostavan upitnik i recite nam što želite renovirati. Bez obaveza.",
  },
  {
    icon: Users,
    number: "02",
    title: "Dobijte ponude",
    description: "Povežemo vas s provjerenim izvođačima koji šalju transparentne ponude.",
  },
  {
    icon: Hammer,
    number: "03",
    title: "Pratite napredak",
    description: "Naš tim koordinira radove dok vi pratite sve kroz aplikaciju.",
  },
  {
    icon: KeyRound,
    number: "04",
    title: "Uživajte u novom prostoru",
    description: "Preuzimate ključeve renoviranog doma — bez stresa i iznenađenja.",
  },
];

const ProcessSection = () => {
  return (
    <section className="section-padding bg-warm-grey">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Kako funkcionira
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
            Jednostavan proces od A do Ž
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Renovacija ne mora biti komplicirana. Mi smo tu da vam olakšamo svaki korak.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-border" />
              )}

              <div className="relative bg-background rounded-2xl p-8 shadow-soft transition-all duration-300 group-hover:shadow-elevated group-hover:-translate-y-1">
                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-brick-light flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
