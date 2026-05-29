import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiTag, FiHeart } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import { useTheme } from "@/hooks/use-theme";
import { useWishlist } from "@/hooks/use-wishlist";
import logoPath from "@assets/LOGO_YS_1778428531681.png";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      title={theme === "dark" ? "Mode clair" : "Mode sombre"}
    >
      <span className="theme-toggle-thumb" />
      <span style={{
        position: 'absolute', right: '4px',
        fontSize: '8px', lineHeight: 1,
        color: 'rgba(201,168,76,0.5)',
        transition: 'opacity 0.3s',
        opacity: theme === 'dark' ? 1 : 0,
      }}>☀</span>
      <span style={{
        position: 'absolute', left: '4px',
        fontSize: '8px', lineHeight: 1,
        color: 'rgba(168,114,28,0.6)',
        transition: 'opacity 0.3s',
        opacity: theme === 'light' ? 1 : 0,
      }}>☾</span>
    </button>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { theme } = useTheme();

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

  const isLight = theme === 'light';

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-40 transition-all duration-500"
        style={{
          background: isScrolled
            ? 'var(--ys-navbar-bg)'
            : isLight
              ? 'rgba(240,232,208,0.4)'
              : 'linear-gradient(to bottom, rgba(10,8,6,0.85), transparent)',
          borderBottom: isScrolled ? '1px solid var(--ys-border)' : 'none',
          backdropFilter: isScrolled ? 'blur(14px)' : 'none',
          padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
          boxShadow: isScrolled ? '0 2px 40px rgba(0,0,0,0.2)' : 'none',
        }}
      >
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(to right, transparent, var(--ys-gold) 20%, var(--ys-gold-light, #E2C87A) 50%, var(--ys-gold) 80%, transparent)` }} />
        )}

        <div className="container mx-auto px-5 sm:px-8 relative flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center w-1/3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden transition-colors"
              style={{ color: 'var(--ys-text-muted)' }}
              aria-label="Menu"
            >
              <FiMenu className="text-xl" />
            </button>
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="relative group transition-all text-[9px] tracking-[0.35em] uppercase font-medium"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: link.highlight
                      ? 'var(--ys-gold)'
                      : location.startsWith(link.href)
                        ? 'var(--ys-gold)'
                        : 'var(--ys-text-muted)',
                  }}>
                  {link.highlight && <FiTag className="inline mr-1 text-[9px] -mt-0.5" />}
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-400 group-hover:w-full"
                    style={{ background: 'var(--ys-gold)' }} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="block hover:scale-105 transition-transform duration-500">
              <img src={logoPath} alt="YsWatchs"
                className="h-9 sm:h-10 lg:h-12 w-auto object-contain"
                style={{
                  filter: isLight
                    ? 'brightness(0.1) sepia(0.5) saturate(3) hue-rotate(-5deg)'
                    : 'invert(1) brightness(0.88) drop-shadow(0 0 8px rgba(201,168,76,0.3))',
                }} />
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 w-1/3">
            <ThemeToggle />
            <Link href="/recherche" className="hover:text-[var(--ys-gold)] transition-colors"
              style={{ color: 'var(--ys-text-muted)' }} aria-label="Recherche">
              <FiSearch className="text-lg" />
            </Link>
            {/* Wishlist */}
            <Link href="/wishlist" className="hover:text-[var(--ys-gold)] transition-colors relative"
              style={{ color: location === '/wishlist' ? 'var(--ys-gold)' : 'var(--ys-text-muted)' }} aria-label="Liste de souhaits">
              <FiHeart className="text-lg" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--ys-gold)', color: 'var(--ys-bg)' }}>
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            {/* Cart */}
            <Link href="/panier" className="hover:text-[var(--ys-gold)] transition-colors relative"
              style={{ color: 'var(--ys-text-muted)' }} aria-label="Panier">
              <FiShoppingCart className="text-lg" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--ys-gold)', color: 'var(--ys-bg)' }}>
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
            style={{ background: 'var(--ys-bg)' }}
          >
            <div className="h-[2px]" style={{
              background: 'linear-gradient(to right, transparent, var(--ys-gold) 20%, var(--ys-gold-light, #E2C87A) 50%, var(--ys-gold) 80%, transparent)'
            }} />
            <div className="flex justify-between items-center px-7 py-5"
              style={{ borderBottom: '1px solid var(--ys-border)' }}>
              <img src={logoPath} alt="YsWatchs" className="h-9 w-auto object-contain"
                style={{
                  filter: isLight
                    ? 'brightness(0.1) sepia(0.5) saturate(3) hue-rotate(-5deg)'
                    : 'invert(1) brightness(0.88)',
                }} />
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <button onClick={() => setIsMobileMenuOpen(false)}
                  style={{ color: 'var(--ys-text-muted)' }}
                  className="hover:text-[var(--ys-gold)] transition-colors">
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center flex-1 px-8 gap-1">
              {[...navLinks,
                { label: "Liste de Souhaits", href: "/wishlist" },
                { label: "Recherche", href: "/recherche" },
                { label: "Panier", href: "/panier" },
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
                      color: 'highlight' in link && link.highlight ? 'var(--ys-gold)' : 'var(--ys-text)',
                      borderBottom: '1px solid var(--ys-border)',
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
              color: 'var(--ys-gold)',
              opacity: 0.35,
            }}>
              Maison YsWatchs · Maroc · Est. MMXXIV
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
