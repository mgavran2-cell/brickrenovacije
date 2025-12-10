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
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-brick-light to-warm-grey p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">20+ godina iskustva</h3>
                <p className="text-muted-foreground">Kvaliteta na koju se možete osloniti</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
