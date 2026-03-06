import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import QuoteRequestDialog from "@/components/QuoteRequestDialog";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { session } = useAuth();

  const handleHashNav = useCallback((hash: string) => {
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: `#${hash}` });
      return;
    }
    document
      .getElementById(hash)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              brick renovacije
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/usluge" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Usluge
            </a>
            <button 
              type="button"
              onClick={() => handleHashNav("kako-funkcionira")}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Kako funkcionira
            </button>
            <button
              type="button"
              onClick={() => handleHashNav("o-nama")}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              O nama
            </button>
            <a href="/projekti" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Projekti
            </a>
            <button
              type="button"
              onClick={() => handleHashNav("kontakt")}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Kontakt
            </button>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(session ? "/dashboard" : "/prijava")}>
              {session ? "Dashboard" : "Prijava"}
            </Button>
            <Button size="sm" onClick={() => setQuoteOpen(true)}>
              Zatraži ponudu
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-elevated animate-fade-in">
            <nav className="flex flex-col p-6 gap-4">
              <a
                href="/usluge"
                className="text-base font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Usluge
              </a>
              <button
                type="button"
                className="text-base font-medium py-2 hover:text-primary transition-colors text-left"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleHashNav("kako-funkcionira");
                }}
              >
                Kako funkcionira
              </button>
              <a
                href="#o-nama"
                className="text-base font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                O nama
              </a>
              <a
                href="/projekti"
                className="text-base font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projekti
              </a>
              <a
                href="#kontakt"
                className="text-base font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kontakt
              </a>
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="w-full" onClick={() => { setIsMobileMenuOpen(false); navigate(session ? "/dashboard" : "/prijava"); }}>
                  {session ? "Dashboard" : "Prijava"}
                </Button>
                <Button className="w-full" onClick={() => { setIsMobileMenuOpen(false); setQuoteOpen(true); }}>
                  Zatraži ponudu
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
      <QuoteRequestDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </header>
  );
};

export default Header;
