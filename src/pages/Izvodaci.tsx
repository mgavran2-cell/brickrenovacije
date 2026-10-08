import { useState } from "react";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/animations/ScrollReveal";
import {
  Briefcase,
  HandCoins,
  UserCheck,
  Handshake,
  CheckCircle,
  Send,
  Zap,
  Droplets,
  Grid3x3,
  PaintRoller,
  Hammer,
  Layers,
  Building,
  DoorOpen,
} from "lucide-react";

const PROFESSIONS = [
  { name: "Elektroinstalateri", icon: Zap },
  { name: "Vodoinstalateri", icon: Droplets },
  { name: "Keramičari", icon: Grid3x3 },
  { name: "Soboslikari", icon: PaintRoller },
  { name: "Stolari", icon: Hammer },
  { name: "Parketari", icon: Layers },
  { name: "Fasaderi", icon: Building },
  { name: "Aluminijska i PVC stolarija", icon: DoorOpen },
];

const EXPERIENCE = ["Manje od 2", "2-5", "5-10", "Više od 10"];
const LEGAL_FORMS = ["Obrt", "d.o.o.", "j.d.o.o.", "Paušalni obrt", "Drugo"];

const BENEFITS = [
  { icon: Briefcase, title: "Redoviti protok posla", description: "Imamo stalan priliv projekata — ti radiš, mi dovodimo klijente i koordiniramo sve ostalo" },
  { icon: HandCoins, title: "Uredno i redovito plaćanje", description: "Sve kroz tvrtku, R1 računi, isplate po dogovorenim rokovima bez čekanja" },
  { icon: UserCheck, title: "Jedan kontakt, bez stresa", description: "Komuniciraš samo s nama, ne s klijentom. Mi preuzimamo organizaciju, promjene i reklamacije" },
  { icon: Handshake, title: "Dugoročna suradnja", description: "Tražimo partnere s kojima gradimo odnos — ne jednokratne poslove" },
];

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  profession: z.string().trim().min(1).max(100),
  experience: z.string().min(1),
  legal_form: z.string().min(1),
  location: z.string().trim().min(1).max(150),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(255),
  about: z.string().trim().max(2000),
});

const empty = { name: "", profession: "", experience: "", legal_form: "", location: "", phone: "", email: "", about: "" };

const Izvodaci = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState(empty);
  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Molimo ispravno ispunite sva obavezna polja.");
      return;
    }
    const record = { ...parsed.data, about: parsed.data.about || null } as {
      name: string; profession: string; experience: string; legal_form: string;
      location: string; phone: string; email: string; about: string | null;
    };
    setSending(true);
    try {
      const { error } = await supabase.from("contractor_applications").insert(record);
      if (error) throw error;
      try {
        await supabase.functions.invoke("notify-new-contractor", {
          body: { record: { ...record, created_at: new Date().toISOString() } },
        });
      } catch (err) {
        console.warn("notify-new-contractor failed", err);
      }
      setSent(true);
      setForm(empty);
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
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-narrow px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 uppercase tracking-wide">
                <Handshake className="w-4 h-4" />
                Za izvođače
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
                Priključi se našoj mreži izvođača
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Rastemo i trebamo pouzdane majstore za dodatni posao. Ako si samostalan izvođač s iskustvom u građevini i tražiš stabilan protok projekata, javi nam se.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="lg" asChild className="text-lg px-8 py-6 shadow-lg shadow-primary/30">
                  <a href="#prijava">Prijavi se</a>
                </Button>
                <Button variant="hero-outline" size="lg" asChild className="px-8 py-6">
                  <a href="#zasto">Saznaj više</a>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="zasto" className="section-padding scroll-mt-24">
          <div className="container-narrow px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl text-foreground text-center mb-12">Zašto raditi s nama</h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {BENEFITS.map((b, i) => (
                <ScrollReveal key={b.title} delay={i * 0.1}>
                  <div className="bg-card border border-border rounded-2xl p-6 text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <b.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-warm-grey">
          <div className="container-narrow px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl text-foreground text-center mb-12">Koga tražimo</h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PROFESSIONS.map((p) => (
                <div key={p.name} className="bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center gap-3">
                  <p.icon className="w-7 h-7 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{p.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-muted-foreground">
              Imaš drugu specijalnost? I dalje nam javi — tražimo pouzdane ljude.
            </p>
          </div>
        </section>

        <section id="prijava" className="section-padding scroll-mt-24">
          <div className="container-narrow px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl text-foreground text-center mb-10">Prijavi se</h2>
              {sent ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground">Hvala na prijavi!</h3>
                  <p className="mt-2 text-muted-foreground">Javljamo se u roku 5 radnih dana.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Pošalji novu prijavu</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
                  <div>
                    <Label htmlFor="name">Ime i prezime *</Label>
                    <Input id="name" maxLength={100} value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label>Zanimanje / specijalnost *</Label>
                      <Select value={form.profession} onValueChange={(v) => set("profession", v)}>
                        <SelectTrigger><SelectValue placeholder="Odaberite" /></SelectTrigger>
                        <SelectContent>
                          {PROFESSIONS.map((p) => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                          <SelectItem value="Drugo">Drugo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Godine iskustva *</Label>
                      <Select value={form.experience} onValueChange={(v) => set("experience", v)}>
                        <SelectTrigger><SelectValue placeholder="Odaberite" /></SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Pravni oblik *</Label>
                    <RadioGroup value={form.legal_form} onValueChange={(v) => set("legal_form", v)} className="flex flex-wrap gap-4 mt-2">
                      {LEGAL_FORMS.map((l) => (
                        <div key={l} className="flex items-center gap-2">
                          <RadioGroupItem value={l} id={`lf-${l}`} />
                          <Label htmlFor={`lf-${l}`} className="font-normal">{l}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="location">Lokacija / područje rada *</Label>
                    <Input id="location" maxLength={150} value={form.location} onChange={(e) => set("location", e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input id="phone" type="tel" maxLength={30} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" maxLength={255} value={form.email} onChange={(e) => set("email", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="about">Kratko o sebi i referencama</Label>
                    <Textarea id="about" rows={4} maxLength={2000} value={form.about} onChange={(e) => set("about", e.target.value)} />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={sending}>
                    <Send className="w-4 h-4 mr-2" />
                    {sending ? "Šaljem..." : "Pošaljite prijavu"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Javljamo se u roku 5 radnih dana. Prijavom pristajete na obradu podataka u svrhu kontakta.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Izvodaci;
