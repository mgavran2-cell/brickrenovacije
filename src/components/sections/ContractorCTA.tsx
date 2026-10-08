import { Link } from "react-router-dom";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContractorCTA = () => (
  <section className="py-16 bg-warm-grey">
    <div className="container-narrow px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Hammer className="w-6 h-6 text-primary" />
      </div>
      <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">Za izvođače</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Jesi izvođač? Priključi nam se.</h2>
      <p className="mt-3 text-muted-foreground">Tražimo pouzdane majstore za dugoročnu suradnju i dodatni posao.</p>
      <Button variant="outline" size="lg" asChild className="mt-6">
        <Link to="/izvodaci">Saznaj više</Link>
      </Button>
    </div>
  </section>
);

export default ContractorCTA;
