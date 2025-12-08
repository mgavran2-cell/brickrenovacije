import { Shield, FileText, Headphones } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Provjereni izvođači",
    description:
      "Svaki izvođač prolazi rigoroznu provjeru kvalitete, iskustva i referenci prije nego uđe u našu mrežu.",
  },
  {
    icon: FileText,
    title: "Transparentne cijene",
    description:
      "Bez skrivenih troškova. Dobivate detaljnu ponudu prije početka radova, a plaćate samo ono što je dogovoreno.",
  },
  {
    icon: Headphones,
    title: "Vođenje projekta uključeno",
    description:
      "Naš stručni tim koordinira sve — od nabave materijala do nadzora izvođača. Vi samo uživate u rezultatu.",
  },
];

const TrustSection = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Zašto mi
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
              Renovacija u koju možete imati povjerenja
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Znamo da je renovacija veliki korak. Zato smo stvorili platformu 
              koja stavlja vas na prvo mjesto — s jasnim cijenama, provjerenim 
              majstorima i podrškom na svakom koraku.
            </p>

            {/* Trust Items */}
            <div className="mt-10 space-y-8">
              {trustItems.map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-5 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "forwards" }}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brick-light flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-brick-light to-warm-grey p-8 lg:p-12">
              {/* Quote Card */}
              <div className="absolute top-8 right-8 left-8 lg:left-auto lg:w-80 bg-background rounded-2xl p-6 shadow-elevated">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Najbolja odluka koju smo donijeli za renovaciju stana. Profesionalno, 
                  na vrijeme i bez ikakvih neugodnih iznenađenja."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brick-light flex items-center justify-center text-sm font-bold text-primary">
                    MK
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Marija K.</div>
                    <div className="text-xs text-muted-foreground">Zagreb</div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="absolute bottom-8 left-8 bg-foreground text-background rounded-2xl p-6 shadow-elevated">
                <div className="text-3xl font-extrabold text-primary mb-1">4.9/5</div>
                <div className="text-sm text-background/70">Prosječna ocjena klijenata</div>
                <div className="text-xs text-background/50 mt-1">Bazirano na 500+ recenzija</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
