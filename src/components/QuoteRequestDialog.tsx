import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Check, Home, Wrench, Sparkles, PaintBucket, User } from "lucide-react";

const PROPERTY_TYPES = ["Stan", "Kuća", "Poslovni prostor", "Apartman"];
const LOCATIONS = ["Zagreb", "Velika Gorica", "Samobor", "Zaprešić", "Sesvete", "Dugo Selo", "Ostalo"];
const SCOPE_OPTIONS = [
  "Kupaonica", "Kuhinja", "Dnevni boravak", "Spavaća soba",
  "Podovi", "Elektroinstalacije", "Vodoinstalacije", "Fasada",
];
const CONDITIONS = ["Dobro stanje – manji popravci", "Srednje – potrebna obnova", "Loše – kompletna renovacija"];
const MATERIALS = [
  { label: "Standardni", desc: "Kvalitetni materijali po pristupačnoj cijeni" },
  { label: "Premium", desc: "Vrhunski materijali poznatih brendova" },
  { label: "Luksuzni", desc: "Ekskluzivni dizajnerski materijali" },
];

const STEPS = [
  { icon: Home, label: "Nekretnina" },
  { icon: Wrench, label: "Opseg" },
  { icon: PaintBucket, label: "Stanje" },
  { icon: Sparkles, label: "Materijali" },
  { icon: User, label: "Kontakt" },
];

interface QuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteRequestDialog = ({ open, onOpenChange }: QuoteRequestDialogProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    propertyType: "",
    location: "",
    sqm: "",
    scope: [] as string[],
    condition: "",
    material: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleScope = (item: string) => {
    setData((d) => ({
      ...d,
      scope: d.scope.includes(item) ? d.scope.filter((s) => s !== item) : [...d.scope, item],
    }));
  };

  const canNext = () => {
    if (step === 0) return data.propertyType && data.location && data.sqm;
    if (step === 1) return data.scope.length > 0;
    if (step === 2) return data.condition;
    if (step === 3) return data.material;
    if (step === 4) return data.name && data.email && data.phone;
    return false;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
      setData({ propertyType: "", location: "", sqm: "", scope: [], condition: "", material: "", name: "", email: "", phone: "", message: "" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto p-0">
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl">Hvala vam!</DialogTitle>
              <DialogDescription>Vaš zahtjev je zaprimljen. Javit ćemo vam se u roku 24 sata.</DialogDescription>
            </DialogHeader>
            <Button onClick={handleClose} className="mt-4">Zatvori</Button>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                        i < step ? "bg-primary text-primary-foreground" :
                        i === step ? "bg-primary text-primary-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < step ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">{s.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-6 space-y-5">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {step === 0 && "O vašoj nekretnini"}
                  {step === 1 && "Opseg radova"}
                  {step === 2 && "Stanje nekretnine"}
                  {step === 3 && "Standard materijala"}
                  {step === 4 && "Vaši kontakt podaci"}
                </DialogTitle>
                <DialogDescription>
                  Korak {step + 1} od 5
                </DialogDescription>
              </DialogHeader>

              {/* Step 0: Property */}
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Tip nekretnine</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {PROPERTY_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setData((d) => ({ ...d, propertyType: t }))}
                          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                            data.propertyType === t
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Lokacija</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {LOCATIONS.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setData((d) => ({ ...d, location: l }))}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                            data.location === l
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sqm" className="text-sm font-medium">Kvadratura (m²)</Label>
                    <Input
                      id="sqm"
                      type="number"
                      placeholder="npr. 65"
                      value={data.sqm}
                      onChange={(e) => setData((d) => ({ ...d, sqm: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 1: Scope */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {SCOPE_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleScope(item)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors text-left ${
                        data.scope.includes(item)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {data.scope.includes(item) && <Check className="w-4 h-4" />}
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Condition */}
              {step === 2 && (
                <div className="space-y-2">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setData((d) => ({ ...d, condition: c }))}
                      className={`w-full px-4 py-4 rounded-xl border text-sm font-medium transition-colors text-left ${
                        data.condition === c
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Material */}
              {step === 3 && (
                <div className="space-y-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setData((d) => ({ ...d, material: m.label }))}
                      className={`w-full px-4 py-4 rounded-xl border text-left transition-colors ${
                        data.material === m.label
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="font-semibold text-sm">{m.label}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Contact */}
              {step === 4 && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Ime i prezime</Label>
                    <Input id="name" value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input id="email" type="email" value={data.email} onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Telefon</Label>
                    <Input id="phone" type="tel" value={data.phone} onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="msg" className="text-sm font-medium">Poruka (opcionalno)</Label>
                    <Textarea id="msg" rows={3} value={data.message} onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))} className="mt-1" />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Natrag
                </Button>
                {step < 4 ? (
                  <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                    Dalje <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canNext()}>
                    Pošalji zahtjev <Check className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestDialog;
