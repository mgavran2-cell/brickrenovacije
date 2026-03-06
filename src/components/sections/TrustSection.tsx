import { Shield, FileText, Headphones } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const trustItems = [
  { icon: Shield, title: "Provjereni izvođači", description: "Svaki izvođač prolazi rigoroznu provjeru kvalitete, iskustva i referenci prije nego uđe u našu mrežu." },
  { icon: FileText, title: "Transparentne cijene", description: "Bez skrivenih troškova. Dobivate detaljnu ponudu prije početka radova, a plaćate samo ono što je dogovoreno." },
  { icon: Headphones, title: "Vođenje projekta uključeno", description: "Naš stručni tim koordinira sve — od nabave materijala do nadzora izvođača. Vi samo uživate u rezultatu." },
];

const TrustSection = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <ScrollReveal direction="left">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Zašto mi</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold">Renovacija u koju možete imati povjerenja</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Znamo da je renovacija veliki korak. Zato smo stvorili platformu koja stavlja vas na prvo mjesto — s jasnim cijenama, provjerenim majstorima i podrškom na svakom koraku.
              </p>
            </ScrollReveal>

            <div className="mt-10 space-y-8">
              {trustItems.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.15} direction="left">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brick-light flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <ScrollReveal direction="right">
              <h3 className="text-2xl font-bold mb-2">Kako funkcionira</h3>
            </ScrollReveal>
            {[
              { step: 1, title: "Opišite projekt", description: "Ispunite jednostavan upitnik: vrsta nekretnine, lokacija, kvadratura i opseg radova koje želite." },
              { step: 2, title: "Prilagodite ponudu", description: "Odaberite standard materijala i priložite fotografije prostora za precizniju procjenu." },
              { step: 3, title: "Dobijte ponudu", description: "U roku od 48 sati kontaktiramo vas s detaljnom ponudom prilagođenom vašim potrebama." },
            ].map((item, index) => (
              <ScrollReveal key={item.step} delay={index * 0.15} direction="right">
                <div className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">{item.step}</div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
