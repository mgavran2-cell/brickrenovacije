import { Clock, Handshake, Award, Heart, Building2 } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const stats = [
  { value: "15+", label: "godina iskustva u struci" },
  { value: "280+", label: "završenih projekata" },
  { value: "2015.", label: "osnovanja tvrtke" },
  { value: "100%", label: "osobna posvećenost" },
];

const values = [
  { icon: Heart, title: "Obiteljski pristup", description: "Svaki projekt tretiramo kao da je za našu obitelj. Osobna posvećenost i briga o detaljima su temelj našeg rada." },
  { icon: Clock, title: "Dugogodišnje iskustvo", description: "Više od 15 godina gradimo povjerenje kroz kvalitetu. Znamo što funkcionira i kako izbjeći uobičajene greške." },
  { icon: Handshake, title: "Pouzdani kooperanti", description: "Surađujemo s mrežom provjerenih majstora za specijalizirane radove — elektrika, vodoinstalacije, stolarija. Svi su provjereni godinama suradnje." },
  { icon: Award, title: "Garancija kvalitete", description: "Stojimo iza svakog rada. Nudimo punu garanciju i ostajemo dostupni i nakon završetka projekta." },
];

const AboutSection = () => {
  return (
    <section id="o-nama" className="section-padding bg-card scroll-mt-24">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80" alt="Tim Brick Renovacije" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background rounded-2xl p-6 shadow-elevated border border-border/50 max-w-[240px] hidden sm:block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2015.</p>
                    <p className="text-sm text-muted-foreground">tvrtka osnovana</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Iskustvo u struci još od 2009. — gradimo zajedno s vama.</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">O nama</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Obiteljska tvrtka s vizijom moderne renovacije</h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Brick Renovacije poslovni je brand obiteljske tvrtke CORAX-STIL j.d.o.o., osnovane 2015. godine. Iza nas stoji više od 15 godina iskustva u građevini — glavni izvođač vodi svaki projekt osobno, od prve procjene do predaje ključeva.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Kroz godine smo izgradili pouzdanu mrežu kooperanata — majstora za specijalizirane radove, dizajnera interijera i dobavljača materijala. Svaki od njih je provjeren i surađuje s nama godinama, pa znate da u vaš dom ulaze ljudi kojima vjerujemo.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Brick Renovacije spaja obiteljski pristup s modernim načinom rada — jasne cijene, transparentna komunikacija, jedan kontakt od početka do kraja. Bez komplikacija, bez skrivenih troškova, bez stresa.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <div className="text-center p-6 rounded-2xl bg-background border border-border/50">
                <p className="text-4xl lg:text-5xl font-bold text-primary">{stat.value}</p>
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold">Naše vrijednosti</h3>
              <p className="mt-4 text-muted-foreground">Ono u što vjerujemo i po čemu nas klijenti pamte.</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full">
                  <div className="w-14 h-14 rounded-2xl bg-brick-light flex items-center justify-center mb-5">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
