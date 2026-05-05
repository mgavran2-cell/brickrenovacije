import { useState } from "react";
import { MessageSquareQuote, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import QuoteRequestDialog from "@/components/QuoteRequestDialog";

const TestimonialsSection = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section id="recenzije" className="section-padding bg-warm-grey">
      <div className="container-narrow">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <MessageSquareQuote className="w-8 h-8 text-primary" />
            </div>

            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Uskoro
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
              Recenzije klijenata
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stranica uskoro objavljuje stvarne recenzije naših klijenata.
            </p>

            <p className="mt-6 text-muted-foreground leading-relaxed">
              Trenutno prikupljamo pisane recenzije od naših klijenata iz proteklih projekata.
              Ako ste radili s nama, javite nam se na{" "}
              <a
                href="mailto:info@brickrenovacije.hr"
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
              >
                <Mail className="w-4 h-4" />
                info@brickrenovacije.hr
              </a>{" "}
              i podijelite svoje iskustvo.
            </p>

            <div className="mt-8">
              <Button
                size="lg"
                onClick={() => setQuoteOpen(true)}
                className="text-base px-8 py-6 shadow-lg shadow-primary/30"
              >
                Zatražite ponudu
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <QuoteRequestDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </section>
  );
};

export default TestimonialsSection;
