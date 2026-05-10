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
            ? "bg-black/85 backdrop-blur-md border-b border-[rgba(201,168,76,0.15)] py-3 shadow-[0_4px_40px_rgba(0,0,0,0.9)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              data-testid="button-mobile-menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <FiMenu className="text-2xl" />
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-10 w-1/3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
                className={`text-xs tracking-[0.25em] uppercase font-medium transition-all hover:text-primary relative group ${
                  location.startsWith(link.href) ? "text-primary" : "text-foreground/70"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="w-1/3 flex justify-center">
            <Link href="/" data-testid="link-logo">
              <img
                src={logoPath}
                alt="YsWatchs"
                className="h-10 lg:h-12 w-auto object-contain invert brightness-90 drop-shadow-[0_0_12px_rgba(201,168,76,0.5)] hover:drop-shadow-[0_0_20px_rgba(201,168,76,0.8)] transition-all duration-500 hover:scale-105"
              />
            </Link>
          </div>

          <div className="w-1/3 flex items-center justify-end gap-6">
            <Link
              href="/recherche"
              data-testid="link-search"
              className="text-foreground/70 hover:text-primary transition-colors hidden sm:block"
            >
              <FiSearch className="text-xl" />
            </Link>
            <Link
              href="/panier"
              data-testid="link-cart"
              className="text-foreground/70 hover:text-primary transition-colors relative"
            >
              <FiShoppingCart className="text-xl" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    data-testid="badge-cart-count"
                    className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/97 z-50 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex justify-between items-center p-6">
              <img src={logoPath} alt="YsWatchs" className="h-10 w-auto object-contain invert brightness-90" />
              <button
                data-testid="button-close-mobile-menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors"
              >
                <FiX className="text-3xl" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-5xl tracking-widest hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="w-16 h-[1px] bg-primary/40 my-2" />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Link
                  href="/recherche"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-2xl tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  Recherche
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
