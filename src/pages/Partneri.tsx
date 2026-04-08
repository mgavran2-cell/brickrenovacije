import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/animations/ScrollReveal";
import {
  Handshake,
  CheckCircle,
  Send,
  Building2,
  TrendingUp,
  Users,
  Shield,
} from "lucide-react";

const SERVICE_OPTIONS = [
  "Zidarski radovi",
  "Elektroinstalacije",
  "Vodoinstalacije",
  "Keramičarski radovi",
  "Soboslikarski radovi",
  "Stolarija",
  "Podopolagački radovi",
  "Fasaderski radovi",
  "Krovopokrivački radovi",
  "Klimatizacija i grijanje",
  "Ostalo",
];

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Stalni priljev poslova",
    description:
      "Povezujemo vas s kvalificiranim klijentima koji traže upravo vaše usluge.",
  },
  {
    icon: Shield,
    title: "Bez početnih troškova",
    description:
      "Pridruživanje je potpuno besplatno — plaćate samo kada dobijete posao.",
  },
  {
    icon: Users,
    title: "Podrška i vidljivost",
    description:
      "Promovirati ćemo vaš obrt kroz naše kanale i osigurati vidljivost kod klijenata.",
  },
  {
    icon: Building2,
    title: "Profesionalna suradnja",
    description:
      "Radimo samo s pouzdanim partnerima — vaša kvaliteta je naš prioritet.",
  },
];

const Partneri = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    oib: "",
    city: "",
    experience_years: "",
    message: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.company_name ||
      !form.contact_person ||
      !form.email ||
      !form.phone ||
      !form.city
    ) {
      toast.error("Molimo ispunite sva obavezna polja.");
      return;
    }
    if (selectedServices.length === 0) {
      toast.error("Molimo odaberite barem jednu uslugu.");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase
        .from("partner_applications" as any)
        .insert({
          company_name: form.company_name,
          contact_person: form.contact_person,
          email: form.email,
          phone: form.phone,
          oib: form.oib || null,
          city: form.city,
          services: selectedServices,
          experience_years: form.experience_years
            ? parseInt(form.experience_years, 10)
            : null,
          message: form.message || null,
        } as any);
      if (error) throw error;
      setSent(true);
      toast.success("Prijava je uspješno poslana!");
    } catch {
      toast.error("Greška pri slanju prijave. Pokušajte ponovo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-narrow px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Handshake className="w-4 h-4" />
                Partnerski program
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                Postanite naš partner
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Tražimo pouzdane obrtnike i tvrtke za suradnju na renovacijskim
                projektima. Pridružite se našoj mreži i rastite zajedno s nama.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding">
          <div className="container-narrow px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
                Zašto surađivati s nama?
              </h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {BENEFITS.map((b, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="bg-card border border-border rounded-2xl p-6 text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <b.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {b.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {b.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="section-padding bg-secondary/30">
          <div className="container-narrow px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
                  Prijavite se
                </h2>
                <p className="text-center text-muted-foreground mb-10">
                  Ispunite obrazac i javit ćemo vam se u roku 48 sati.
                </p>

                {sent ? (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground">
                      Hvala na prijavi!
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Pregledat ćemo vašu prijavu i javiti vam se uskoro.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => {
                        setSent(false);
                        setForm({
                          company_name: "",
                          contact_person: "",
                          email: "",
                          phone: "",
                          oib: "",
                          city: "",
                          experience_years: "",
                          message: "",
                        });
                        setSelectedServices([]);
                      }}
                    >
                      Pošaljite novu prijavu
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-card border border-border rounded-2xl p-6 sm:p-10 space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Naziv tvrtke / obrta *</Label>
                        <Input
                          placeholder="npr. Majstor d.o.o."
                          value={form.company_name}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              company_name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kontakt osoba *</Label>
                        <Input
                          placeholder="Ime i prezime"
                          value={form.contact_person}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              contact_person: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          placeholder="email@tvrtka.hr"
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefon *</Label>
                        <Input
                          type="tel"
                          placeholder="+385 ..."
                          value={form.phone}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>OIB</Label>
                        <Input
                          placeholder="12345678901"
                          value={form.oib}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, oib: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Grad *</Label>
                        <Input
                          placeholder="Zagreb"
                          value={form.city}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, city: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Godine iskustva</Label>
                        <Input
                          type="number"
                          min="0"
                          placeholder="5"
                          value={form.experience_years}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              experience_years: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Usluge koje nudite *</Label>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {SERVICE_OPTIONS.map((service) => (
                          <label
                            key={service}
                            className="flex items-center gap-2 cursor-pointer rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                          >
                            <Checkbox
                              checked={selectedServices.includes(service)}
                              onCheckedChange={() => toggleService(service)}
                            />
                            <span className="text-sm text-foreground">
                              {service}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Dodatna poruka</Label>
                      <Textarea
                        placeholder="Recite nam nešto o svom poslu, referencama ili pitanjima..."
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full"
                      size="lg"
                    >
                      {sending ? "Šalje se..." : "Pošaljite prijavu"}
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partneri;
