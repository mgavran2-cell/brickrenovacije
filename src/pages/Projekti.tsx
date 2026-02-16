import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Kompletna renovacija stana",
    location: "Zagreb, Trešnjevka",
    category: "Stan",
    description: "Potpuna transformacija stana od 75m² uključujući kupaonicu, kuhinju i dnevni boravak.",
    duration: "6 tjedana",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  },
  {
    id: 2,
    title: "Moderna kupaonica",
    location: "Velika Gorica",
    category: "Kupaonica",
    description: "Renovacija kupaonice s modernim dizajnom, tuš kabinom i podnim grijanjem.",
    duration: "2 tjedna",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80",
  },
  {
    id: 3,
    title: "Obiteljska kuća - adaptacija",
    location: "Samobor",
    category: "Kuća",
    description: "Adaptacija prizemlja obiteljske kuće s novom kuhinjom i otvorenim konceptom.",
    duration: "8 tjedana",
    image: "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=800&q=80",
  },
  {
    id: 4,
    title: "Poslovni prostor",
    location: "Zagreb, Centar",
    category: "Poslovni prostor",
    description: "Kompletno uređenje uredskog prostora od 120m² za IT tvrtku.",
    duration: "4 tjedna",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: 5,
    title: "Luksuzna kuhinja",
    location: "Zaprešić",
    category: "Kuhinja",
    description: "Dizajn i izvedba kuhinje po mjeri s premium uređajima i kamenom radnom pločom.",
    duration: "3 tjedna",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
  {
    id: 6,
    title: "Renovacija apartmana",
    location: "Sesvete",
    category: "Stan",
    description: "Kompletna obnova stana s modernim interijerom i funkcionalnim rasporedom.",
    duration: "5 tjedana",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
];

const Projekti = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 section-padding">
        <div className="container-narrow">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Naši projekti
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold">
              Pogledajte naše realizirane projekte
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Svaki projekt je priča za sebe. Pregledajte našu galeriju završenih 
              renovacija i uvjerite se u kvalitetu naših radova.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding pb-24">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elevated opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {project.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {project.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {project.location}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Želite sličnu renovaciju? Javite nam se za besplatnu procjenu.
            </p>
            <Button size="lg" className="group">
              Zatraži ponudu
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projekti;
