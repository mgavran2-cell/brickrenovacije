import { Clock, Handshake, Award, Heart, Building2 } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const stats = [
  { value: "15+", label: "godina iskustva" },
  { value: "500+", label: "završenih projekata" },
  { value: "50+", label: "provjerenih partnera" },
  { value: "98%", label: "zadovoljnih klijenata" },
];

const values = [
  { icon: Heart, title: "Obiteljski pristup", description: "Svaki projekt tretiramo kao da je za našu obitelj. Osobna posvećenost i briga o detaljima su temelj našeg rada." },
  { icon: Clock, title: "Dugogodišnje iskustvo", description: "Više od 15 godina gradimo povjerenje kroz kvalitetu. Znamo što funkcionira i kako izbjeći uobičajene greške." },
  { icon: Handshake, title: "Provjereni partneri", description: "Surađujemo samo s majstorima i dobavljačima koje poznajemo godinama. Vaš projekt je u sigurnim rukama." },
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
                    <p className="text-2xl font-bold">2009.</p>
                    <p className="text-sm text-muted-foreground">osnovani</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Od malih radova do kompletnih renovacija — rastemo zajedno s vama.</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">O nama</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Obiteljska tvrtka s vizijom moderne renovacije</h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Brick Renovacije nastale su iz jednostavne ideje: renovacija ne mora biti stresna. Kao obiteljska tvrtka s više od 15 godina iskustva u građevini, razumijemo što znači urediti dom u kojem ćete živjeti.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Kroz godine smo izgradili mrežu provjerenih partnera — majstora, arhitekata i dobavljača — koji dijele našu posvećenost kvaliteti. Svaki član našeg tima prolazi rigoroznu provjeru jer znamo da vam u dom ulaze ljudi kojima morate vjerovati.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Danas spajamo tradicionalne vrijednosti s modernom tehnologijom kako bismo vam omogućili renovaciju bez briga — s jasnim cijenama, transparentnom komunikacijom i rezultatima na koje možete biti ponosni.
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
