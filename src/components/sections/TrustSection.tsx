import { ShieldCheck, Receipt, UserCheck, Clock } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const trustPoints = [
  { icon: ShieldCheck, title: "Provjereni izvođači", text: "Radimo samo s pouzdanim i provjerenim majstorima" },
  { icon: Receipt, title: "Transparentna cijena", text: "Dobivaš jasnu procjenu bez skrivenih troškova" },
  { icon: UserCheck, title: "Vođenje projekta", text: "Jedna osoba koordinira cijeli proces" },
  { icon: Clock, title: "Ušteda vremena i živaca", text: "Bez traženja majstora i neizvjesnosti" },
];

const TrustSection = () => {
  return (
    <section className="section-padding bg-brick-light">
      <div className="container-narrow">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Povjerenje</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">Zašto Brick</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {trustPoints.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.1}>
              <div className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
