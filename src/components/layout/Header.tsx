import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import QuoteRequestDialog from "@/components/QuoteRequestDialog";

/**
 * Shared style for the primary nav items.
 * Hover = subtle underline drawn left-to-right from the primary (terracotta) colour.
 */
const navLinkClass =
  "relative text-sm font-medium text-foreground/70 transition-colors duration-200 hover:text-foreground " +
  "after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 " +
  "after:rounded-full after:bg-primary after:transition-transform after:duration-200 after:ease-out " +
  "hover:after:scale-x-100";

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

  const goToAccount = useCallback(() => {
    navigate(session ? "/dashboard" : "/prijava");
  }, [navigate, session]);

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
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-lg font-bold text-foreground">Brick</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-[38px]">
            <a href="/usluge" className={navLinkClass}>
              Usluge
            </a>
            <button
              type="button"
              onClick={() => handleHashNav("kako-funkcionira")}
              className={navLinkClass}
            >
              Kako funkcionira
            </button>
            <button
              type="button"
              onClick={() => handleHashNav("o-nama")}
              className={navLinkClass}
            >
              O nama
            </button>
            <a href="/projekti" className={navLinkClass}>
              Projekti
            </a>
            <a href="/izvodaci" className={navLinkClass}>
              Izvođači
            </a>
            <button
              type="button"
              onClick={() => handleHashNav("kontakt")}
              className={navLinkClass}
            >
              Kontakt
            </button>
          </nav>

          {/* Right side: discreet sign-in icon, CTA, mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={session ? "Dashboard" : "Prijava"}
              title={session ? "Dashboard" : "Prijava"}
              onClick={goToAccount}
              className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogIn className="w-4 h-4" />
            </button>

            <Button
              size="sm"
              className="hidden md:inline-flex px-5 py-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/35"
              onClick={() => setQuoteOpen(true)}
            >
              Zatraži ponudu
            </Button>

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
              <button
                type="button"
                className="text-base font-medium py-2 hover:text-primary transition-colors text-left"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleHashNav("o-nama");
                }}
              >
                O nama
              </button>
              <a
                href="/projekti"
                className="text-base font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projekti
              </a>
              <a
                href="/izvodaci"
                className="text-base font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Izvođači
              </a>
              <button
                type="button"
                className="text-base font-medium py-2 hover:text-primary transition-colors text-left"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleHashNav("kontakt");
                }}
              >
                Kontakt
              </button>
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button
                  className="w-full px-5 py-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/35"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setQuoteOpen(true);
                  }}
                >
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
