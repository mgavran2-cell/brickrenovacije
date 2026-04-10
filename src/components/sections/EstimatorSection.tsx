import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ArrowLeft,
  Home,
  Building2,
  Bath,
  UtensilsCrossed,
  Phone,
  CheckCircle,
} from "lucide-react";
import QuoteRequestDialog from "@/components/QuoteRequestDialog";
import type { EstimatorPreFill } from "@/components/QuoteRequestDialog";

const PROPERTY_TYPES = [
  { label: "Stan", icon: Building2 },
  { label: "Kuću", icon: Home },
  { label: "Kupaonicu", icon: Bath },
  { label: "Kuhinju", icon: UtensilsCrossed },
];

const WORK_OPTIONS = [
  "Rušenje",
  "Instalacije",
  "Podovi",
  "Zidovi",
  "Kupaonica",
  "Kuhinja",
];

const BUDGET_OPTIONS = [
  "< 10.000€",
  "10.000€ – 25.000€",
  "25.000€ – 50.000€",
  "50.000€+",
];

type EstimatorData = {
  propertyType: string;
  area: number;
  works: string[];
  budget: string;
};

// Cijena po m² za svaku vrstu rada (EUR)
const WORK_PRICES: Record<string, { low: number; high: number; label: string }> = {
  "Rušenje":     { low: 15, high: 30, label: "Rušenje i odvoz šute" },
  "Instalacije": { low: 40, high: 75, label: "Električne i vodovodne instalacije" },
  "Podovi":      { low: 35, high: 65, label: "Podne obloge i priprema" },
  "Zidovi":      { low: 20, high: 45, label: "Zidovi – gletanje, bojanje, obloge" },
  "Kupaonica":   { low: 60, high: 120, label: "Kompletna kupaonica" },
  "Kuhinja":     { low: 50, high: 100, label: "Kompletna kuhinja" },
};

// Množitelj prema tipu nekretnine
const PROPERTY_MULTIPLIER: Record<string, number> = {
  "Stan": 1.0,
  "Kuću": 1.2,
  "Kupaonicu": 1.4,  // intenzivniji radovi na malom prostoru
  "Kuhinju": 1.3,
};

// Efektivna površina za kupaonicu/kuhinju kad korisnik unese cijeli stan
function getEffectiveArea(type: string, area: number) {
  if (type === "Kupaonicu") return Math.min(area, 12); // max 12m² za kupaonicu
  if (type === "Kuhinju") return Math.min(area, 20);   // max 20m² za kuhinju
  return area;
}

type CostBreakdownItem = { label: string; low: number; high: number };

function calculateEstimate(data: EstimatorData) {
  const effectiveArea = getEffectiveArea(data.propertyType, data.area);
  const propMultiplier = PROPERTY_MULTIPLIER[data.propertyType] || 1;

  const breakdown: CostBreakdownItem[] = [];
  let totalLow = 0;
  let totalHigh = 0;

  for (const work of data.works) {
    const prices = WORK_PRICES[work];
    if (!prices) continue;
    const low = Math.round(prices.low * effectiveArea * propMultiplier / 10) * 10;
    const high = Math.round(prices.high * effectiveArea * propMultiplier / 10) * 10;
    breakdown.push({ label: prices.label, low, high });
    totalLow += low;
    totalHigh += high;
  }

  // Dodaj projektiranje i nadzor (8-12%)
  const projectLow = Math.round(totalLow * 0.08 / 10) * 10;
  const projectHigh = Math.round(totalHigh * 0.12 / 10) * 10;
  breakdown.push({ label: "Projektiranje i nadzor", low: projectLow, high: projectHigh });
  totalLow += projectLow;
  totalHigh += projectHigh;

  // Trajanje: bazno 1 tjedan + po radu ~0.8-1.5 tjedna, skalirano s površinom
  const areeFactor = Math.max(1, effectiveArea / 50);
  const weeksLow = Math.max(2, Math.round(data.works.length * 0.8 * areeFactor));
  const weeksHigh = Math.max(weeksLow + 1, Math.round(data.works.length * 1.5 * areeFactor));

  return { totalLow, totalHigh, weeksLow, weeksHigh, breakdown };
}

const EstimatorSection = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<EstimatorData>({
    propertyType: "",
    area: 0,
    works: [],
    budget: "",
  });
  const [quoteOpen, setQuoteOpen] = useState(false);

  const totalSteps = 4;
  const canNext =
    (step === 0 && data.propertyType) ||
    (step === 1 && data.area > 0) ||
    (step === 2 && data.works.length > 0) ||
    (step === 3 && data.budget);

  const estimate = step === 4 ? calculateEstimate(data) : null;

  const toggleWork = (work: string) =>
    setData((d) => ({
      ...d,
      works: d.works.includes(work)
        ? d.works.filter((w) => w !== work)
        : [...d.works, work],
    }));

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <section className="section-padding bg-secondary/40" id="estimator">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Procjena renovacije
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Odgovori na 4 pitanja i dobij okvirnu cijenu u 30 sekundi
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          {step < totalSteps && (
            <div className="flex items-center gap-2 mb-8">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= step ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2 whitespace-nowrap">
                {step + 1}/{totalSteps}
              </span>
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 min-h-[340px] flex flex-col">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Što renoviraš?
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PROPERTY_TYPES.map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        onClick={() => setData((d) => ({ ...d, propertyType: label }))}
                        className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          data.propertyType === label
                            ? "border-primary bg-accent text-accent-foreground shadow-sm"
                            : "border-border bg-card hover:border-primary/40 text-foreground"
                        }`}
                      >
                        <Icon className="w-7 h-7" />
                        <span className="font-semibold text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Kolika je površina?
                  </h3>
                  <div className="flex items-center gap-3 max-w-xs">
                    <Input
                      type="number"
                      min={1}
                      placeholder="npr. 65"
                      value={data.area || ""}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          area: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="text-lg h-14"
                      autoFocus
                    />
                    <span className="text-lg font-medium text-muted-foreground">
                      m²
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Koji radovi su potrebni?
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {WORK_OPTIONS.map((work) => (
                      <button
                        key={work}
                        onClick={() => toggleWork(work)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          data.works.includes(work)
                            ? "border-primary bg-accent text-accent-foreground shadow-sm"
                            : "border-border bg-card hover:border-primary/40 text-foreground"
                        }`}
                      >
                        {data.works.includes(work) && (
                          <CheckCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                        )}
                        {work}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Koji je tvoj budžet?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setData((d) => ({ ...d, budget: opt }))}
                        className={`px-5 py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          data.budget === opt
                            ? "border-primary bg-accent text-accent-foreground shadow-sm"
                            : "border-border bg-card hover:border-primary/40 text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Result */}
              {step === 4 && estimate && (
                <motion.div
                  key="result"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex-1 text-center flex flex-col items-center justify-center gap-6"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Okvirna cijena
                    </p>
                    <p className="text-3xl sm:text-4xl font-extrabold text-foreground">
                      {estimate.totalLow.toLocaleString("hr-HR")} –{" "}
                      {estimate.totalHigh.toLocaleString("hr-HR")} €
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div className="w-full max-w-md text-left">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Stavke</p>
                    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                      {estimate.breakdown.map((item) => (
                        <div key={item.label} className="flex justify-between items-center px-4 py-2.5 text-sm">
                          <span className="text-foreground">{item.label}</span>
                          <span className="text-muted-foreground font-medium whitespace-nowrap ml-3">
                            {item.low.toLocaleString("hr-HR")} – {item.high.toLocaleString("hr-HR")} €
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Procijenjeno trajanje
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {estimate.weeksLow}–{estimate.weeksHigh} tjedana
                    </p>
                  </div>
                  <Button
                    variant="hero"
                    size="lg"
                    className="mt-2 text-lg px-8 py-6 shadow-lg shadow-primary/30"
                    onClick={() => setQuoteOpen(true)}
                  >
                    <Phone className="w-5 h-5" />
                    Dogovori besplatan poziv
                  </Button>
                  <button
                    onClick={() => {
                      setStep(0);
                      setData({ propertyType: "", area: 0, works: [], budget: "" });
                    }}
                    className="text-sm text-muted-foreground underline hover:text-foreground transition-colors cursor-pointer"
                  >
                    Izračunaj ponovo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {step < totalSteps && (
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 0}
                  className="gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Natrag
                </Button>
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext}
                  className="gap-1"
                >
                  {step === totalSteps - 1 ? "Prikaži procjenu" : "Dalje"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <QuoteRequestDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        initialData={{ propertyType: data.propertyType, area: data.area, works: data.works, budget: data.budget }}
      />
    </section>
  );
};

export default EstimatorSection;
