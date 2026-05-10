import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiTag } from "react-icons/fi";
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
    { label: "Collection Homme", href: "/montres/homme" },
    { label: "Collections", href: "/collections" },
    { label: "Promotions", href: "/promotions", highlight: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? "border-b py-3 shadow-[0_2px_40px_rgba(0,0,0,0.6)]"
            : "py-4 md:py-5"
        }`}
        style={{
          background: isScrolled
            ? 'rgba(10,8,6,0.97)'
            : 'linear-gradient(to bottom, rgba(10,8,6,0.85), transparent)',
          borderColor: 'rgba(201,168,76,0.18)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        }}
      >
        {/* Top filigree line */}
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent)' }} />
        )}

        <div className="container mx-auto px-5 sm:px-8 relative flex items-center justify-between">
          {/* Left nav */}
          <div className="flex items-center w-1/3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden transition-colors"
              style={{ color: 'rgba(245,240,232,0.7)' }}
              aria-label="Menu"
            >
              <FiMenu className="text-xl" />
            </button>
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative group transition-all text-[9px] tracking-[0.35em] uppercase font-medium`}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: link.highlight
                      ? '#C9A84C'
                      : location.startsWith(link.href)
                      ? '#C9A84C'
                      : 'rgba(245,240,232,0.55)',
                  }}
                >
                  {link.highlight && <FiTag className="inline mr-1 text-[9px] -mt-0.5" />}
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-400 group-hover:w-full"
                    style={{ background: 'rgba(201,168,76,0.6)' }} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="block hover:scale-105 transition-transform duration-500">
              <img
                src={logoPath}
                alt="YsWatchs"
                className="h-9 sm:h-10 lg:h-12 w-auto object-contain"
                style={{ filter: 'invert(1) brightness(0.88) drop-shadow(0 0 8px rgba(201,168,76,0.3))' }}
              />
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center justify-end gap-5 w-1/3">
            <Link href="/recherche" style={{ color: 'rgba(245,240,232,0.55)' }}
              className="hover:text-[#C9A84C] transition-colors" aria-label="Recherche">
              <FiSearch className="text-lg" />
            </Link>
            <Link href="/panier" style={{ color: 'rgba(245,240,232,0.55)' }}
              className="hover:text-[#C9A84C] transition-colors relative" aria-label="Panier">
              <FiShoppingCart className="text-lg" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 text-[#0C0A08] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: '#C9A84C' }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: '#0A0806' }}
          >
            {/* Top border */}
            <div className="h-[2px]" style={{
              background: 'linear-gradient(to right, transparent, #C9A84C 20%, #E2C87A 50%, #C9A84C 80%, transparent)'
            }} />

            <div className="flex justify-between items-center px-7 py-5"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
              <img src={logoPath} alt="YsWatchs" className="h-9 w-auto object-contain"
                style={{ filter: 'invert(1) brightness(0.88) drop-shadow(0 0 6px rgba(201,168,76,0.3))' }} />
              <button onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: 'rgba(245,240,232,0.5)' }} className="hover:text-[#C9A84C] transition-colors">
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="flex flex-col justify-center flex-1 px-8 gap-1">
              {[...navLinks,
                { label: "Recherche", href: "/recherche" },
                { label: "Panier", href: "/panier" }
              ].map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}>
                  <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-4 transition-colors"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
                      fontWeight: 300,
                      letterSpacing: '0.03em',
                      color: 'highlight' in link && link.highlight ? '#C9A84C' : 'rgba(245,240,232,0.8)',
                      borderBottom: '1px solid rgba(201,168,76,0.12)',
                    }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="px-8 pb-10" style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.55rem',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.3)'
            }}>
              Maison YsWatchs · Maroc · Est. MMXXIV
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
