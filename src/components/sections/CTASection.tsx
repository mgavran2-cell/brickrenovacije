import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import QuoteRequestDialog from "@/components/QuoteRequestDialog";
import ScrollReveal from "@/components/animations/ScrollReveal";

const CTASection = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Molimo ispunite sva obavezna polja.");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("renovation_requests").insert({
        name: form.name, email: form.email, phone: form.phone || "",
        message: form.message, property_type: "Upit", location: "N/A",
        scope: "Kontakt forma", condition: "N/A", material: "N/A",
      });
      if (error) throw error;
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Poruka je uspješno poslana!");
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "generate_lead", {
          event_category: "contact_form",
          event_label: "Kontakt forma",
        });
      }
    } catch {
      toast.error("Greška pri slanju. Pokušajte ponovo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="kontakt" className="section-padding scroll-mt-24">
      <div className="container-narrow">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-brick-dark p-8 sm:p-12 lg:p-20">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight">Spremni za svoju renovaciju iz snova?</h2>
                <p className="mt-6 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl">Zatražite besplatnu procjenu danas i započnite transformaciju svog doma bez stresa, skrivenih troškova i briga.</p>
                <div className="mt-8">
                  <Button size="xl" className="bg-background text-foreground hover:bg-background/90 shadow-floating" onClick={() => setQuoteOpen(true)}>
                    Zatražite besplatnu procjenu
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
                <p className="mt-6 text-sm text-primary-foreground/60">Bez obaveza • Odgovaramo u roku 24 sata • 100% besplatno</p>
              </div>

              <div className="bg-background/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-primary-foreground/10">
                {sent ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-primary-foreground">Hvala vam!</h3>
                    <p className="mt-2 text-primary-foreground/70">Javit ćemo vam se u najkraćem roku.</p>
                    <Button variant="outline" className="mt-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setSent(false)}>Pošaljite novu poruku</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-primary-foreground mb-2">Razgovarajmo</h3>
                    <p className="text-sm text-primary-foreground/60 mb-4">Pošaljite nam poruku i javit ćemo vam se u roku 24 sata.</p>
                    <Input placeholder="Ime i prezime *" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30" required />
                    <Input type="email" placeholder="Email adresa *" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30" required />
                    <Input type="tel" placeholder="Telefon (opcionalno)" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30" />
                    <Textarea placeholder="Vaša poruka *" value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30 min-h-[100px]" required />
                    <Button type="submit" disabled={sending} className="w-full bg-background text-foreground hover:bg-background/90 shadow-soft" size="lg">
                      {sending ? "Šalje se..." : "Pošaljite poruku"}
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
      <QuoteRequestDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </section>
  );
};

export default CTASection;
