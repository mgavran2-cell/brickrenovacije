import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ClipboardList, Receipt, HardHat } from "lucide-react";

const Prijava = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Uspješna prijava!");
        navigate("/admin");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Račun kreiran!");
        navigate("/admin");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-foreground/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-foreground/[0.03]" />

        {/* Top: logo */}
        <div className="relative z-10">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl font-bold">B</span>
            </div>
            <span className="text-xl font-bold">brick renovacije</span>
          </a>
        </div>

        {/* Center: value props */}
        <div className="relative z-10 space-y-10">
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
              Vaš prostor.<br />Vaš pregled.<br />Sve na jednom mjestu.
            </h1>
            <p className="mt-4 text-primary-foreground/70 text-lg max-w-md">
              Prijavite se kako biste pratili status vaših radova, pregledali ponude i račune.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Pratite radove</p>
                <p className="text-sm text-primary-foreground/60">Uvid u tijek renovacije u realnom vremenu</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Ponude i računi</p>
                <p className="text-sm text-primary-foreground/60">Svi dokumenti na jednom mjestu</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Status projekta</p>
                <p className="text-sm text-primary-foreground/60">Transparentno od početka do predaje ključeva</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} Brick Renovacije. Sva prava pridržana.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col min-h-screen bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Natrag
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-sm font-bold text-foreground">brick renovacije</span>
          </div>
        </div>

        {/* Form centered */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {isLogin ? "Dobrodošli natrag" : "Kreirajte račun"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Unesite podatke za pristup klijentskom portalu."
                  : "Registrirajte se za pristup klijentskom portalu."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email adresa
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vas@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Lozinka
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:bg-background transition-colors"
                />
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl text-base" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isLogin ? "Prijavi se" : "Kreiraj račun"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">ili</span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Nemate račun?" : "Već imate račun?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                {isLogin ? "Registrirajte se" : "Prijavite se"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prijava;
