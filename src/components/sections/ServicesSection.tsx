import { Bath, ChefHat, Home, Building2, Paintbrush, Zap, Droplets } from "lucide-react";

const services = [
  {
    icon: Bath,
    title: "Kupaonica",
    description: "Kompletna renovacija kupaonice, od pločica do instalacija.",
  },
  {
    icon: ChefHat,
    title: "Kuhinja",
    description: "Moderna kuhinja prilagođena vašim potrebama i prostoru.",
  },
  {
    icon: Home,
    title: "Stan",
    description: "Potpuna adaptacija stana — od zidova do podova.",
  },
  {
    icon: Building2,
    title: "Kuća",
    description: "Renovacija kuće, nadogradnje i rekonstrukcije.",
  },
  {
    icon: Paintbrush,
    title: "Fasada",
    description: "Obnova fasade, izolacija i moderni završni radovi.",
  },
  {
    icon: Zap,
    title: "Elektrika",
    description: "Električne instalacije, rasvjeta i pametna rješenja.",
  },
  {
    icon: Droplets,
    title: "Vodovod",
    description: "Vodovodne instalacije, grijanje i sanitarni radovi.",
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Naše usluge
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
            Sve što vam treba za renovaciju
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Od manjih popravaka do potpune transformacije prostora — imamo tim za svaki posao.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-card border border-border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-primary/30 hover:shadow-elevated hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-brick-light flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              {/* Arrow */}
              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
