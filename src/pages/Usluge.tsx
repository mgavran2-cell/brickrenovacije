import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Home, Bath, ChefHat, Paintbrush, Building2, Wrench } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  {
    icon: Home,
    title: "Kompletna renovacija stana",
    description: "Potpuna transformacija vašeg životnog prostora od planiranja do realizacije.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    icon: Bath,
    title: "Renovacija kupaonice",
    description: "Moderna kupaonica s kvalitetnim materijalima i preciznom izvedbom.",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
  },
  {
    icon: ChefHat,
    title: "Renovacija kuhinje",
    description: "Funkcionalna i elegantna kuhinja po vašoj mjeri.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
];

const detailedServices = [
  {
    title: "Pronađite provjerene majstore",
    subtitle: "Kvaliteta na koju se možete osloniti",
    description: "Započnite s povjerenjem. Brick Renovacije vas povezuje s provjerenim majstorima koji dolaze na vašu lokaciju, procjenjuju radove i daju jasne ponude.",
    features: [
      "Do tri posjeta provjerenih izvođača",
      "Jasne, detaljne ponude za usporedbu",
      "Standardni ugovor i sigurna plaćanja",
      "Garancija na izvedene radove",
    ],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    testimonial: {
      text: "Preporučujem Brick Renovacije za pronalazak izvođača. Rade brzo, kvalitetno i s puno znanja.",
      author: "Ivan M., Zagreb",
    },
  },
  {
    title: "Dizajnirajte svoj prostor",
    subtitle: "Vizualizirajte prije nego što počnete",
    description: "Započnite s besplatnim konzultacijama za istraživanje ideja i opcija rasporeda. Kada budete spremni, dodajte stručnu podršku — od brzih savjeta do 3D vizualizacija.",
    features: [
      "Besplatne konzultacije — provjerite svoje ideje",
      "Savjetovanje o dizajnu — stil, raspored, materijali",
      "2D planiranje — nacrti za izvođače",
      "3D vizualizacija — realistične slike vašeg budućeg prostora",
    ],
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    testimonial: null,
  },
  {
    title: "Nabavite kvalitetne materijale",
    subtitle: "Sve na jednom mjestu",
    description: "Brick Renovacije olakšava nabavu. Pregledajte naš katalog, naručite izravno i uskladite dostave s rasporedom izvođača. Bez jurnjave za narudžbama.",
    features: [
      "Pristup provjerenim dobavljačima",
      "Širok izbor materijala i opreme",
      "Kurirana ponuda testiranih proizvoda",
      "Koordinirane dostave na gradilište",
    ],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    testimonial: null,
  },
];

const allServices = [
  {
    icon: Home,
    title: "Kompletna renovacija",
    description: "Potpuna transformacija stana ili kuće",
  },
  {
    icon: Bath,
    title: "Kupaonice",
    description: "Moderne kupaonice s kvalitetnim materijalima",
  },
  {
    icon: ChefHat,
    title: "Kuhinje",
    description: "Funkcionalne kuhinje po mjeri",
  },
  {
    icon: Paintbrush,
    title: "Soboslikarski radovi",
    description: "Profesionalno bojanje i dekoracija",
  },
  {
    icon: Building2,
    title: "Poslovni prostori",
    description: "Uređenje ureda i trgovačkih prostora",
  },
  {
    icon: Wrench,
    title: "Instalacije",
    description: "Vodovodne, električne i strojarske instalacije",
  },
];

const faqs = [
  {
    question: "Moram li koristiti sve vaše usluge?",
    answer: "Ne, možete odabrati samo usluge koje vam trebaju. Bilo da vam treba samo pronalazak majstora, dizajn ili nabava materijala — tu smo za vas.",
  },
  {
    question: "Je li dizajn obavezan prije početka radova?",
    answer: "Dizajn nije obavezan, ali ga preporučujemo. Dobar dizajn pomaže u donošenju odluka, ubrzava radove i smanjuje neočekivane troškove.",
  },
  {
    question: "Kako funkcioniraju ponude izvođača?",
    answer: "Nakon što opišete svoj projekt, šaljemo provjerene izvođače na vašu lokaciju. Svaki izvođač daje detaljnu ponudu koju možete usporediti s drugima.",
  },
  {
    question: "Mogu li dovesti svog izvođača?",
    answer: "Da, možete koristiti vlastite izvođače i dalje koristiti naše usluge dizajna i nabave materijala.",
  },
  {
    question: "Što ako nešto pođe po zlu tijekom radova?",
    answer: "Svi radovi su pokriveni garancijom. Naš tim je tu da pomogne riješiti bilo kakve probleme koji se mogu pojaviti tijekom ili nakon renovacije.",
  },
];

const Usluge = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brick-light/30 to-background" />
        <div className="container-narrow relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Naše usluge
              </span>
              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Renovirajte s povjerenjem
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                Planirajte sigurno, angažirajte prave majstore i pratite svoj projekt — sve na jednom mjestu. Vi ostajete u kontroli. Mi rješavamo kompleksnost.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group">
                  Zatražite procjenu
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline">
                  Pogledajte projekte
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Prosječno vrijeme: 2 minute
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Renovacija doma"
                className="rounded-3xl shadow-elevated"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-card">
        <div className="container-narrow">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Sve što trebate za uspješnu renovaciju
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Brick Renovacije vam pomaže pronaći prave majstore, dizajnirati prostor i nabaviti kvalitetne materijale — sve na jednom mjestu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group relative rounded-2xl overflow-hidden opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-white/80 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Sections */}
      {detailedServices.map((service, index) => (
        <section
          key={service.title}
          className={`section-padding ${index % 2 === 1 ? "bg-card" : ""}`}
        >
          <div className="container-narrow">
            <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <h2 className="text-3xl sm:text-4xl font-bold">{service.title}</h2>
                <p className="mt-2 text-lg text-primary font-medium">{service.subtitle}</p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Što dobivate</h4>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.testimonial && (
                  <div className="mt-8 p-6 rounded-2xl bg-brick-light/50 border-l-4 border-primary">
                    <p className="italic text-foreground">"{service.testimonial.text}"</p>
                    <p className="mt-2 text-sm text-muted-foreground">— {service.testimonial.author}</p>
                  </div>
                )}

                <Button className="mt-8 group">
                  Zatražite procjenu
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-3xl shadow-elevated"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* All Services Grid */}
      <section className="section-padding bg-card">
        <div className="container-narrow">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Sve naše usluge</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Od malih popravaka do kompletnih renovacija — pokrivamo sve.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service, index) => (
              <div
                key={service.title}
                className="p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="w-12 h-12 rounded-xl bg-brick-light flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Često postavljana pitanja</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Sve što trebate znati o našim uslugama.
              </p>
              <div className="mt-8">
                <p className="text-muted-foreground mb-4">Imate dodatna pitanja?</p>
                <Button variant="outline">Kontaktirajte nas</Button>
              </div>
            </div>
            <div>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary">
        <div className="container-narrow text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
            Započnite renovaciju na jednostavan način
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Povežite se s provjerenim majstorima, istražite opcije dizajna ili nabavite materijale — sve na jednom mjestu.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="group">
              Zatražite besplatnu procjenu
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Usluge;
