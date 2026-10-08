import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const faqs = [
  { question: "Koliko traje prosječna renovacija?", answer: "Trajanje ovisi o opsegu projekta. Renovacija kupaonice obično traje 2-3 tjedna, dok kompletna renovacija nekretnine može trajati 6-12 tjedana. Nakon prvih konzultacija, dat ćemo vam precizan vremenski okvir." },
  { question: "Kako funkcionira procjena cijena?", answer: "Nakon što ispunite upitnik, naš tim organizira besplatan izlazak na teren. Na temelju toga dobivate detaljnu ponudu s jasno razdvojenim stavkama za materijal i rad. Bez skrivenih troškova." },
  { question: "Tko izvodi radove?", answer: "Brick Renovacije dio je obiteljske tvrtke CORAX-STIL j.d.o.o. Glavni izvođač vodi svaki projekt osobno, a surađujemo s pouzdanom mrežom kooperanata za specijalizirane radove (elektrika, vodoinstalacije, stolarija). Svaki kooperant provjeren je kroz godine suradnje." },
  { question: "Što ako nisam zadovoljan radovima?", answer: "Vaše zadovoljstvo nam je prioritet. Glavni izvođač je stalno dostupan tijekom radova, pa se problemi rješavaju na licu mjesta bez odgađanja. Ako nešto ipak nije kako ste očekivali, popravljamo bez dodatnih troškova za vas." },
  { question: "Mogu li ostati u nekretnini tijekom renovacije?", answer: "Ovisi o opsegu radova. Za manje projekte poput kupaonice ili kuhinje, to je moguće uz određena prilagođavanja. Za veće adaptacije preporučujemo privremeni smještaj — možemo vam pomoći s organizacijom." },
  { question: "Što je uključeno u cijenu?", answer: "Ponuda uvijek jasno razdvaja cijenu rada i cijenu materijala. Materijale možete nabaviti sami ili preko naših partnerstava s dobavljačima — tada koordiniramo nabavu i dostavu na gradilište. Odluku donosite vi." },
  { question: "Radite li 3D vizualizacije ili dizajn interijera?", answer: "Za potrebe projektiranja i dizajna surađujemo s partnerskim dizajnerima interijera. Ako želite 3D vizualizaciju ili detaljno uređenje prostora, povežemo vas s njima i koordiniramo njihov rad s izvođenjem." },
  { question: "Dajete li jamstvo na radove?", answer: "Da. Na sve izvedene radove dajemo pisano jamstvo sukladno Zakonu o obveznim odnosima. Rok jamstva ovisi o vrsti radova i definira se u ugovoru." },
];

const FAQSection = () => {
  return (
    <section className="section-padding bg-warm-grey">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-16">
          <ScrollReveal direction="left">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <span className="eyebrow">FAQ</span>
              <h2 className="mt-3 text-3xl sm:text-4xl">Često postavljana pitanja</h2>
              <p className="mt-4 text-lg text-muted-foreground">Imate dodatnih pitanja? Slobodno nas kontaktirajte — tu smo da pomognemo.</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pišite nam na</div>
                  <a href="mailto:info@brickrenovacije.hr" className="font-semibold text-foreground hover:text-primary transition-colors">info@brickrenovacije.hr</a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-2xl px-6 border-none shadow-soft">
                  <AccordionTrigger className="text-left font-semibold py-6 hover:no-underline hover:text-primary">{faq.question}</AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
