import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { FiArrowRight, FiArrowDownRight } from "react-icons/fi";
import { products, formatPrice } from "@/lib/data";
import { watchGold, watchSilver, watchBlue } from "@/lib/watch-images";
import MarqueeStrip from "@/components/MarqueeStrip";
import Navbar from "@/components/layout/navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const featured = products.filter(p => p.isBestSeller && (p.category === 'homme' || p.category === 'femme')).slice(0, 4);
const newArrivals = products.filter(p => p.isNew && (p.category === 'homme' || p.category === 'femme')).slice(0, 3);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Warm background layers */}
        <div className="absolute inset-0 bg-[#FAF8F3]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f0e8] via-[#FAF8F3] to-[#ede5d8] opacity-80" />

        {/* Gold accent line top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-28 pb-20 md:pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left: text */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-8 h-[1px] bg-[#c9a84c]/60" />
                <p className="text-[10px] tracking-[0.55em] uppercase text-[#c9a84c]/80">
                  Collection 2025
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif font-light text-5xl sm:text-6xl md:text-7xl xl:text-8xl leading-[0.92] mb-8"
              >
                L'Art<br />
                du{" "}
                <span className="italic gold-gradient-text">Temps</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.55 }}
                className="text-foreground/50 text-sm leading-loose max-w-sm mb-10 font-light tracking-wide"
              >
                Montres de prestige pour hommes et femmes.
                Chaque pièce, une histoire. Chaque minute, une œuvre d'art.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.75 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Link
                  href="/montres/homme"
                  data-testid="link-hero-homme"
                  className="group inline-flex items-center gap-3 bg-foreground text-background text-[10px] tracking-[0.3em] uppercase px-7 py-4 hover:bg-[#c9a84c] hover:text-white transition-all duration-400"
                >
                  Collection Homme
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/montres/femme"
                  data-testid="link-hero-femme"
                  className="group inline-flex items-center gap-3 border border-[#c9a84c]/40 text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase px-7 py-4 hover:bg-[#c9a84c]/8 hover:border-[#c9a84c]/70 transition-all duration-400"
                >
                  Collection Femme
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-16 flex items-center gap-8"
              >
                {[
                  { num: "12+", label: "Collections" },
                  { num: "100%", label: "Swiss Made" },
                  { num: "2025", label: "Nouveautés" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl text-foreground/80">{s.num}</p>
                    <p className="text-[9px] tracking-[0.35em] uppercase text-foreground/35 mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: watch images stack */}
            <div className="order-1 lg:order-2 relative flex items-center justify-center min-h-[360px] sm:min-h-[480px] lg:min-h-[600px]">
              {/* Gold circle behind */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#c9a84c]/8 blur-3xl" />

              {/* Background watch */}
              <motion.div
                initial={{ opacity: 0, x: 40, rotate: 8 }}
                animate={{ opacity: 0.5, x: 0, rotate: 8 }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-4 sm:right-8 top-8 sm:top-12 w-40 sm:w-52 lg:w-60"
              >
                <img src={watchSilver} alt="" className="w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.12)]" />
              </motion.div>

              {/* Middle watch */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotate: -5 }}
                animate={{ opacity: 0.65, x: 0, rotate: -5 }}
                transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-4 sm:left-8 bottom-16 sm:bottom-20 w-36 sm:w-44 lg:w-52"
              >
                <img src={watchBlue} alt="" className="w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.12)]" />
              </motion.div>

              {/* Hero main watch */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-52 sm:w-64 md:w-72 lg:w-80"
              >
                <img
                  src={watchGold}
                  alt="YsWatchs — Herbelin Or"
                  className="w-full drop-shadow-[0_30px_80px_rgba(201,168,76,0.25)]"
                />
              </motion.div>

              {/* Floating tag */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7 }}
                className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 bg-white/80 backdrop-blur-sm border border-[#c9a84c]/20 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              >
                <p className="text-[8px] tracking-[0.4em] uppercase text-foreground/40">À partir de</p>
                <p className="font-serif text-lg text-foreground">1 250 €</p>
              </motion.div>
            </div>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-foreground/25"
          >
            <FiArrowDownRight className="text-lg" />
            <span className="text-[8px] tracking-[0.5em] uppercase">Découvrir</span>
          </motion.div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <MarqueeStrip />

      {/* ─── BEST SELLERS ─── */}
      <section className="py-20 sm:py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-14 sm:mb-20">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-4">Sélection</p>
            <h2 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl">Meilleures Ventes</h2>
            <div className="w-12 h-[1px] bg-[#c9a84c]/40 mx-auto mt-6" />
          </SectionReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {featured.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <Link href={`/produit/${product.id}`} data-testid={`card-product-${product.id}`}>
                  <div className="group border border-border bg-white product-card-hover cursor-pointer overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                    <div className="aspect-square overflow-hidden bg-[#F5F2EC] flex items-center justify-center p-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="text-[8px] tracking-[0.35em] uppercase text-[#c9a84c]/70 mb-1">
                        {product.category === 'homme' ? 'Homme' : 'Femme'}
                      </p>
                      <h3 className="font-serif text-lg sm:text-xl mb-2 group-hover:text-[#c9a84c] transition-colors duration-300 line-clamp-1">{product.name}</h3>
                      <p data-testid={`text-price-${product.id}`} className="text-[#c9a84c] text-sm tracking-wider">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <SectionReveal className="text-center mt-12">
            <Link
              href="/collections"
              data-testid="link-view-all"
              className="group border border-foreground/20 text-foreground/60 text-[10px] tracking-[0.3em] uppercase px-10 py-4 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-400 inline-flex items-center gap-3"
            >
              Voir toutes les collections
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ─── SPLIT BANNER ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <Link href="/montres/homme" data-testid="link-banner-homme" className="group relative overflow-hidden min-h-[50vw] md:min-h-[560px] flex items-end bg-[#1C1812] cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <img
              src={watchGold}
              alt="Collection Homme"
              className="w-full max-w-[280px] sm:max-w-xs object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_60px_rgba(201,168,76,0.2)]"
            />
          </div>
          <div className="relative z-10 p-8 sm:p-10 w-full bg-gradient-to-t from-[#1C1812] via-[#1C1812]/60 to-transparent">
            <p className="text-[8px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-2">Collection</p>
            <h3 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl text-white mb-4">Pour Lui</h3>
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 border-b border-white/20 pb-1 group-hover:text-[#c9a84c] group-hover:border-[#c9a84c] transition-colors duration-300 inline-block">
              Découvrir
            </span>
          </div>
        </Link>

        <Link href="/montres/femme" data-testid="link-banner-femme" className="group relative overflow-hidden min-h-[50vw] md:min-h-[560px] flex items-end bg-[#F5EFE6] cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <img
              src={watchSilver}
              alt="Collection Femme"
              className="w-full max-w-[260px] sm:max-w-xs object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            />
          </div>
          <div className="relative z-10 p-8 sm:p-10 w-full bg-gradient-to-t from-[#EDE4D6]/95 via-[#EDE4D6]/50 to-transparent">
            <p className="text-[8px] tracking-[0.5em] uppercase text-[#c9a84c]/80 mb-2">Collection</p>
            <h3 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">Pour Elle</h3>
            <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 border-b border-foreground/20 pb-1 group-hover:text-[#c9a84c] group-hover:border-[#c9a84c] transition-colors duration-300 inline-block">
              Découvrir
            </span>
          </div>
        </Link>
      </section>

      <MarqueeStrip />

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-20 sm:py-28 px-6 bg-[#F3EDE4]">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 sm:mb-20 gap-4">
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-4">Nouveautés</p>
              <h2 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl">Dernières Arrivées</h2>
            </div>
            <Link href="/collections" className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 hover:text-[#c9a84c] transition-colors whitespace-nowrap">
              Tout voir
            </Link>
          </SectionReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12"
          >
            {newArrivals.map((product, i) => (
              <motion.div key={product.id} variants={fadeUp}>
                <Link href={`/produit/${product.id}`} data-testid={`card-new-${product.id}`}>
                  <div className="group cursor-pointer">
                    <div className={`overflow-hidden bg-white flex items-center justify-center p-6 sm:p-8 mb-5 shadow-[0_2px_20px_rgba(0,0,0,0.06)] ${i === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
                      />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[8px] tracking-[0.3em] uppercase text-[#c9a84c]/60 mb-1">
                          {product.isNew && <span>Nouveau · </span>}
                          {product.category === 'homme' ? 'Homme' : 'Femme'}
                        </p>
                        <h3 className="font-serif text-xl sm:text-2xl group-hover:text-[#c9a84c] transition-colors duration-300">{product.name}</h3>
                      </div>
                      <p className="text-[#c9a84c] text-sm flex-shrink-0 ml-4">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── BRAND QUOTE ─── */}
      <section className="py-24 sm:py-32 px-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <SectionReveal>
            <div className="w-8 h-[1px] bg-[#c9a84c]/40 mx-auto mb-10" />
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c]/60 mb-8">Notre Philosophie</p>
            <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-10 text-foreground">
              "Le temps ne se possède pas.{" "}
              <span className="italic text-[#c9a84c]">Il se contemple.</span>"
            </h2>
            <p className="text-foreground/40 leading-relaxed text-sm font-light max-w-xl mx-auto mb-10">
              Chez YsWatchs, chaque montre est une œuvre d'art vivante. Nous sélectionnons des pièces qui transcendent la simple fonction — des instruments qui racontent une histoire, portent une âme, et traversent les générations.
            </p>
            <div className="w-8 h-[1px] bg-[#c9a84c]/40 mx-auto" />
          </SectionReveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-14 sm:py-16 px-6 bg-[#F0E9DE]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
          <div className="sm:col-span-2">
            <p className="font-serif text-2xl text-foreground mb-3">YsWatchs</p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]/60 mb-4">L'Art du Temps</p>
            <p className="text-foreground/40 text-xs leading-relaxed max-w-xs">
              Montres de prestige pour hommes et femmes. L'art du temps, capturé dans chaque pièce.
            </p>
            <div className="mt-6 flex gap-3">
              <input
                type="email"
                placeholder="Votre email"
                data-testid="input-newsletter"
                className="flex-1 bg-white/70 border border-border px-4 py-2 text-xs text-foreground/60 placeholder-foreground/30 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              />
              <button
                data-testid="button-newsletter"
                className="border border-[#c9a84c]/40 text-[#c9a84c] text-[9px] tracking-[0.3em] uppercase px-4 py-2 hover:bg-[#c9a84c] hover:text-white transition-all duration-300"
              >
                Ok
              </button>
            </div>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c]/60 mb-5">Navigation</p>
            <ul className="space-y-3">
              {[
                { label: "Collection Homme", href: "/montres/homme" },
                { label: "Collection Femme", href: "/montres/femme" },
                { label: "Toutes les Collections", href: "/collections" },
                { label: "Panier", href: "/panier" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-foreground/40 hover:text-[#c9a84c] transition-colors tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c]/60 mb-5">Contact</p>
            <ul className="space-y-3 text-xs text-foreground/40">
              <li>contact@yswatchs.com</li>
              <li>+33 1 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/25">
            © 2025 YsWatchs. Tous droits réservés.
          </p>
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/25">
            Fait avec passion · Paris
          </p>
        </div>
      </footer>
    </div>
  );
}
