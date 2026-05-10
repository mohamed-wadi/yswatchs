import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { FiArrowRight, FiArrowDownRight } from "react-icons/fi";
import { products, formatPrice, getDiscountedPrice } from "@/lib/data";
import { montre1, montre2, watchGold, watchSilver } from "@/lib/watch-images";
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
      <section className="relative min-h-screen flex items-center overflow-hidden hero-animated-bg">
        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/10 blur-[120px]" />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#c9a84c]/6 blur-[80px]" />
        </div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)', backgroundSize: '80px 80px' }}
        />

        {/* Gold accent line top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />

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
                <div className="w-8 h-[1px] bg-[#c9a84c]" />
                <p className="text-[10px] tracking-[0.55em] uppercase text-[#c9a84c] font-medium">
                  Collection 2025
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif font-light text-5xl sm:text-6xl md:text-7xl xl:text-8xl leading-[0.92] mb-8 text-foreground"
              >
                L'Art<br />
                du{" "}
                <span className="italic gold-gradient-text">Temps</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.55 }}
                className="text-foreground/65 text-sm leading-loose max-w-sm mb-10 font-light tracking-wide"
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
                  className="group inline-flex items-center gap-3 bg-[#1C1812] text-white text-[10px] tracking-[0.3em] uppercase px-7 py-4 hover:bg-[#c9a84c] transition-all duration-400"
                >
                  Collection Homme
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/montres/femme"
                  className="group inline-flex items-center gap-3 border border-[#c9a84c] text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase px-7 py-4 hover:bg-[#c9a84c] hover:text-white transition-all duration-400"
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
                  { num: "100%", label: "Authenticité" },
                  { num: "2025", label: "Nouveautés" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl text-foreground font-light">{s.num}</p>
                    <p className="text-[9px] tracking-[0.35em] uppercase text-foreground/45 mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: watch images stack */}
            <div className="order-1 lg:order-2 relative flex items-center justify-center min-h-[360px] sm:min-h-[480px] lg:min-h-[600px]">
              {/* Gold circle glow */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#c9a84c]/12 blur-3xl" />

              {/* Background watch — montre2 (Benyar) */}
              <motion.div
                initial={{ opacity: 0, x: 40, rotate: 8 }}
                animate={{ opacity: 0.55, x: 0, rotate: 8 }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-4 sm:right-8 top-8 sm:top-12 w-44 sm:w-56 lg:w-64"
              >
                <img
                  src={montre2}
                  alt=""
                  className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                />
              </motion.div>

              {/* Side watch — silver */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotate: -5 }}
                animate={{ opacity: 0.5, x: 0, rotate: -5 }}
                transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-4 sm:left-8 bottom-16 sm:bottom-20 w-32 sm:w-40 lg:w-48"
              >
                <img
                  src={watchSilver}
                  alt=""
                  className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                />
              </motion.div>

              {/* Hero main watch — montre1 (Pagani) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-52 sm:w-64 md:w-72 lg:w-80"
              >
                <img
                  src={montre1}
                  alt="YsWatchs — Pagani Classic"
                  className="w-full h-auto object-contain drop-shadow-[0_30px_80px_rgba(201,168,76,0.3)]"
                />
              </motion.div>

              {/* Floating tag */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7 }}
                className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 bg-white/90 backdrop-blur-sm border border-[#c9a84c]/30 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
              >
                <p className="text-[8px] tracking-[0.4em] uppercase text-foreground/50">À partir de</p>
                <p className="font-serif text-lg text-foreground font-light">12 500 DH</p>
              </motion.div>
            </div>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-foreground/35"
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
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c] mb-4 font-medium">Sélection</p>
            <h2 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-foreground">Meilleures Ventes</h2>
            <div className="w-12 h-[1px] bg-[#c9a84c]/50 mx-auto mt-6" />
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
                <Link href={`/produit/${product.id}`}>
                  <div className="group border border-border bg-white product-card-hover cursor-pointer overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                    <div className="relative aspect-square overflow-hidden bg-[#F8F5EF] flex items-center justify-center p-6">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                      />
                      {product.discount && (
                        <div className="absolute top-3 left-3 bg-[#c9a84c] text-white text-[8px] tracking-[0.2em] uppercase px-2 py-1 promo-badge font-medium">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="text-[8px] tracking-[0.35em] uppercase text-[#c9a84c] mb-1 font-medium">
                        {product.category === 'homme' ? 'Homme' : 'Femme'}
                      </p>
                      <h3 className="font-serif text-base sm:text-lg mb-2 group-hover:text-[#c9a84c] transition-colors duration-300 line-clamp-1 text-foreground">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-[#c9a84c] text-sm tracking-wider font-medium">
                          {product.discount
                            ? formatPrice(getDiscountedPrice(product.price, product.discount))
                            : formatPrice(product.price)}
                        </p>
                        {product.discount && (
                          <p className="text-foreground/35 text-xs line-through">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <SectionReveal className="text-center mt-12">
            <Link
              href="/collections"
              className="group border border-foreground/25 text-foreground/70 text-[10px] tracking-[0.3em] uppercase px-10 py-4 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-400 inline-flex items-center gap-3"
            >
              Voir toutes les collections
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ─── SPLIT BANNER ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <Link href="/montres/homme" className="group relative overflow-hidden min-h-[50vw] md:min-h-[560px] flex items-end bg-[#1C1812] cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <img
              src={montre1}
              alt="Collection Homme"
              className="w-full max-w-[280px] sm:max-w-xs h-auto object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_60px_rgba(201,168,76,0.25)]"
            />
          </div>
          <div className="relative z-10 p-8 sm:p-10 w-full bg-gradient-to-t from-[#1C1812] via-[#1C1812]/60 to-transparent">
            <p className="text-[8px] tracking-[0.5em] uppercase text-[#c9a84c] mb-2 font-medium">Collection</p>
            <h3 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl text-white mb-4">Pour Lui</h3>
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 border-b border-white/25 pb-1 group-hover:text-[#c9a84c] group-hover:border-[#c9a84c] transition-colors duration-300 inline-block">
              Découvrir
            </span>
          </div>
        </Link>

        <Link href="/montres/femme" className="group relative overflow-hidden min-h-[50vw] md:min-h-[560px] flex items-end bg-[#F0E8DC] cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <img
              src={watchGold}
              alt="Collection Femme"
              className="w-full max-w-[260px] sm:max-w-xs h-auto object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            />
          </div>
          <div className="relative z-10 p-8 sm:p-10 w-full bg-gradient-to-t from-[#E8DDD0]/95 via-[#E8DDD0]/50 to-transparent">
            <p className="text-[8px] tracking-[0.5em] uppercase text-[#c9a84c] mb-2 font-medium">Collection</p>
            <h3 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">Pour Elle</h3>
            <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 border-b border-foreground/25 pb-1 group-hover:text-[#c9a84c] group-hover:border-[#c9a84c] transition-colors duration-300 inline-block">
              Découvrir
            </span>
          </div>
        </Link>
      </section>

      <MarqueeStrip />

      {/* ─── PROMOS BANNER ─── */}
      <section className="py-16 px-6 bg-[#1C1812] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(201,168,76,0.12)_0%,transparent_70%)]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <SectionReveal>
            <p className="text-[10px] tracking-[0.55em] uppercase text-[#c9a84c] mb-4 font-medium">Offres exclusives</p>
            <h2 className="font-serif font-light text-4xl sm:text-5xl text-white mb-5">
              Promotions & <span className="italic gold-gradient-text">Privilèges</span>
            </h2>
            <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              Des pièces d'exception à des prix privilégiés — pour un temps limité seulement.
            </p>
            <Link
              href="/promotions"
              className="inline-flex items-center gap-3 bg-[#c9a84c] text-white text-[10px] tracking-[0.35em] uppercase px-8 py-4 hover:bg-[#d4b55a] transition-all duration-300"
            >
              Voir les promotions
              <FiArrowRight />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-20 sm:py-28 px-6 bg-[#F3EDE4]">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 sm:mb-20 gap-4">
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c] mb-4 font-medium">Nouveautés</p>
              <h2 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-foreground">Dernières Arrivées</h2>
            </div>
            <Link href="/collections" className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 hover:text-[#c9a84c] transition-colors whitespace-nowrap border-b border-foreground/20 pb-1 hover:border-[#c9a84c]">
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
                <Link href={`/produit/${product.id}`}>
                  <div className="group cursor-pointer">
                    <div className={`relative overflow-hidden bg-white flex items-center justify-center p-6 sm:p-8 mb-5 shadow-[0_2px_20px_rgba(0,0,0,0.07)] ${i === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                      />
                      {product.discount && (
                        <div className="absolute top-4 left-4 bg-[#c9a84c] text-white text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 promo-badge font-medium">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[8px] tracking-[0.3em] uppercase text-[#c9a84c] mb-1 font-medium">
                          {product.isNew && <span>Nouveau · </span>}
                          {product.category === 'homme' ? 'Homme' : 'Femme'}
                        </p>
                        <h3 className="font-serif text-xl sm:text-2xl group-hover:text-[#c9a84c] transition-colors duration-300 text-foreground">{product.name}</h3>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-[#c9a84c] text-sm font-medium">
                          {product.discount
                            ? formatPrice(getDiscountedPrice(product.price, product.discount))
                            : formatPrice(product.price)}
                        </p>
                        {product.discount && (
                          <p className="text-foreground/35 text-xs line-through">{formatPrice(product.price)}</p>
                        )}
                      </div>
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
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(201,168,76,0.07)_0%,transparent_70%)]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <SectionReveal>
            <div className="w-8 h-[1px] bg-[#c9a84c]/50 mx-auto mb-10" />
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c] mb-8 font-medium">Notre Philosophie</p>
            <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-10 text-foreground">
              "Le temps ne se possède pas.{" "}
              <span className="italic gold-gradient-text">Il se contemple.</span>"
            </h2>
            <p className="text-foreground/55 leading-relaxed text-sm font-light max-w-xl mx-auto mb-10">
              Chez YsWatchs, chaque montre est une œuvre d'art vivante. Nous sélectionnons des pièces qui transcendent la simple fonction — des instruments qui racontent une histoire, portent une âme, et traversent les générations.
            </p>
            <div className="w-8 h-[1px] bg-[#c9a84c]/50 mx-auto" />
          </SectionReveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-14 sm:py-16 px-6 bg-[#EDE5D9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
          <div className="sm:col-span-2">
            <p className="font-serif text-2xl text-foreground mb-1">YsWatchs</p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-4 font-medium">L'Art du Temps</p>
            <p className="text-foreground/55 text-xs leading-relaxed max-w-xs">
              Montres de prestige pour hommes et femmes au Maroc. L'art du temps, capturé dans chaque pièce.
            </p>
            <div className="mt-6 flex gap-3">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 bg-white/80 border border-border px-4 py-2 text-xs text-foreground/70 placeholder-foreground/35 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
              />
              <button className="border border-[#c9a84c] text-[#c9a84c] text-[9px] tracking-[0.3em] uppercase px-4 py-2 hover:bg-[#c9a84c] hover:text-white transition-all duration-300 font-medium">
                Ok
              </button>
            </div>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c] mb-5 font-medium">Navigation</p>
            <ul className="space-y-3">
              {[
                { label: "Collection Homme", href: "/montres/homme" },
                { label: "Collection Femme", href: "/montres/femme" },
                { label: "Promotions", href: "/promotions" },
                { label: "Toutes les Collections", href: "/collections" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-foreground/55 hover:text-[#c9a84c] transition-colors tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c] mb-5 font-medium">Contact</p>
            <ul className="space-y-3 text-xs text-foreground/55">
              <li>contact@yswatchs.ma</li>
              <li>+212 6 00 00 00 00</li>
              <li>Casablanca, Maroc</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/35">
            © 2025 YsWatchs. Tous droits réservés.
          </p>
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/35">
            Fait avec passion · Maroc
          </p>
        </div>
      </footer>
    </div>
  );
}
