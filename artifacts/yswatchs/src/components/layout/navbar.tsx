import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import logoPath from "@assets/LOGO_YS_1778428531681.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Homme", href: "/montres/homme" },
    { label: "Femme", href: "/montres/femme" },
    { label: "Collections", href: "/collections" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-[#c9a84c]/20 py-3 shadow-[0_2px_30px_rgba(0,0,0,0.06)]"
            : "bg-transparent py-4 md:py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 relative flex items-center justify-between">

          {/* Left: desktop nav | mobile hamburger */}
          <div className="flex items-center w-1/3">
            <button
              data-testid="button-mobile-menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-foreground hover:text-primary transition-colors lg:hidden"
              aria-label="Menu"
            >
              <FiMenu className="text-2xl" />
            </button>
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                  className={`text-xs tracking-[0.25em] uppercase font-medium transition-all hover:text-primary relative group ${
                    location.startsWith(link.href) ? "text-primary" : "text-foreground/60"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo — absolutely centered on all screen sizes */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" data-testid="link-logo" className="flex items-center">
              <img
                src={logoPath}
                alt="YsWatchs"
                className="h-9 sm:h-10 lg:h-12 w-auto object-contain hover:scale-105 transition-all duration-500"
                style={{
                  filter: 'brightness(0.2) sepia(0.4) saturate(3) hue-rotate(5deg)',
                }}
              />
            </Link>
          </div>

          {/* Right: search + cart */}
          <div className="flex items-center justify-end gap-5 w-1/3">
            <Link
              href="/recherche"
              data-testid="link-search"
              className="text-foreground/60 hover:text-primary transition-colors"
              aria-label="Recherche"
            >
              <FiSearch className="text-xl" />
            </Link>
            <Link
              href="/panier"
              data-testid="link-cart"
              className="text-foreground/60 hover:text-primary transition-colors relative"
              aria-label="Panier"
            >
              <FiShoppingCart className="text-xl" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    data-testid="badge-cart-count"
                    className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#FAF8F3] z-50 flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-[#c9a84c]/20">
              <img
                src={logoPath}
                alt="YsWatchs"
                className="h-9 w-auto object-contain"
                style={{ filter: 'brightness(0.2) sepia(0.4) saturate(3) hue-rotate(5deg)' }}
              />
              <button
                data-testid="button-close-mobile-menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="flex flex-col justify-center flex-1 px-8 gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block font-serif text-5xl sm:text-6xl font-light py-3 border-b border-[#c9a84c]/15 hover:text-primary transition-colors ${
                      location.startsWith(link.href) ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  href="/recherche"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-serif text-3xl sm:text-4xl font-light py-3 text-foreground/40 hover:text-primary transition-colors border-b border-[#c9a84c]/10"
                >
                  Recherche
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 }}
              >
                <Link
                  href="/panier"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-serif text-3xl sm:text-4xl font-light py-3 text-foreground/40 hover:text-primary transition-colors"
                >
                  Panier
                  {totalItems > 0 && (
                    <span className="ml-3 text-sm text-primary">({totalItems})</span>
                  )}
                </Link>
              </motion.div>
            </div>

            <div className="px-8 pb-10 text-[10px] tracking-[0.4em] uppercase text-foreground/30">
              L'Art du Temps
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
