import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Luka Novak",
    location: "Zagreb",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Kompletna renovacija našeg stana prošla je besprijekorno. Profesionalni tim, odlična komunikacija i rezultat koji je premašio sva naša očekivanja. Toplo preporučujem!",
    project: "Renovacija stana"
  },
  {
    id: 2,
    name: "Ana Kovačević",
    location: "Velika Gorica",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Adaptacija kupaonice završena je u zadanom roku i unutar budžeta. Kvaliteta materijala i izvedbe je na najvišoj razini. Hvala na prekrasnom novom prostoru!",
    project: "Adaptacija kupaonice"
  },
  {
    id: 3,
    name: "Ivan Jurić",
    location: "Samobor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Renovirali smo cijelu kuću i iznimno smo zadovoljni. Tim je bio pouzdan, precizan i uvijek dostupan za sva pitanja. Rezultat je točno onakav kakav smo zamislili.",
    project: "Renovacija kuće"
  },
  {
    id: 4,
    name: "Petra Babić",
    location: "Zaprešić",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Od prvog kontakta do završetka projekta sve je bilo organizirano i profesionalno. Posebno cijenim transparentnost u cijenama i redovite izvještaje o napretku radova.",
    project: "Uređenje kuhinje"
  },
  {
    id: 5,
    name: "Tomislav Matić",
    location: "Sesvete",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Izvrsna suradnja! Renovacija poslovnog prostora obavljena je brzo i kvalitetno. Tim je bio fleksibilan i prilagodio se našim potrebama. Definitivno ćemo opet surađivati.",
    project: "Poslovni prostor"
  },
  {
    id: 6,
    name: "Maja Perić",
    location: "Dugo Selo",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Preuredba našeg apartmana za iznajmljivanje ispala je fantastično. Moderni dizajn, kvalitetni materijali i pažnja na svaki detalj. Gosti su oduševljeni!",
    project: "Uređenje apartmana"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="recenzije" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Recenzije klijenata
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Što kažu naši <span className="text-primary">zadovoljni klijenti</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Povjerenje naših klijenata naša je najveća nagrada. Pročitajte iskustva onih koji su nam povjerili svoje domove.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="group bg-card hover:bg-card/80 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-primary/30" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Project Tag */}
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {testimonial.project}
                  </span>
                </div>

                {/* Client Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border/50">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((t) => (
                <img
                  key={t.id}
                  src={t.image}
                  alt={t.name}
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span className="text-muted-foreground ml-2">
              <span className="font-semibold text-foreground">100+</span> zadovoljnih klijenata
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
