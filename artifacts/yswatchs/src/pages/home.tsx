import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import { products, formatPrice } from "@/lib/data";
import MarqueeStrip from "@/components/MarqueeStrip";
import Navbar from "@/components/layout/navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
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

const featured = products.filter(p => p.isBestSeller).slice(0, 4);
const newArrivals = products.filter(p => p.isNew).slice(0, 3);

export default function HomePage() {
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&q=85"
            alt="Hero watch"
            className={`w-full h-full object-cover transition-opacity duration-1000 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setHeroImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.8em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c]/80 mb-6"
          >
            Collection 2024
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-6xl md:text-8xl lg:text-[120px] leading-[0.9] mb-8 tracking-tight"
          >
            L'Art du{" "}
            <span className="italic gold-gradient-text">Temps</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-foreground/60 text-sm tracking-widest max-w-md mx-auto mb-12 font-light"
          >
            Montres de prestige pour hommes et femmes. Chaque pièce, une histoire.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex items-center justify-center gap-6"
          >
            <Link
              href="/montres/homme"
              data-testid="link-hero-homme"
              className="group border border-[#c9a84c]/60 text-[#c9a84c] text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-[#c9a84c] hover:text-black transition-all duration-400 flex items-center gap-3"
            >
              Collection Homme
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/montres/femme"
              data-testid="link-hero-femme"
              className="group border border-white/20 text-white/70 text-xs tracking-[0.25em] uppercase px-8 py-4 hover:border-white/60 hover:text-white transition-all duration-400"
            >
              Collection Femme
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase">Découvrir</span>
          <FiChevronDown className="text-lg animate-bounce" />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <MarqueeStrip />

      {/* BEST SELLERS */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-20">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-4">Sélection</p>
            <h2 className="font-serif font-light text-5xl md:text-6xl">Meilleures Ventes</h2>
            <div className="w-16 h-[1px] bg-[#c9a84c]/40 mx-auto mt-6" />
          </SectionReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featured.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <Link href={`/produit/${product.id}`} data-testid={`card-product-${product.id}`}>
                  <div className="group border border-[rgba(255,255,255,0.06)] bg-card product-card-hover cursor-pointer overflow-hidden">
                    <div className="aspect-square overflow-hidden bg-[#0f0f0f]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a84c]/60 mb-1">
                        {product.category === 'homme' ? 'Homme' : product.category === 'femme' ? 'Femme' : product.category}
                      </p>
                      <h3 className="font-serif text-xl mb-2 group-hover:text-[#c9a84c] transition-colors duration-300">{product.name}</h3>
                      <p data-testid={`text-price-${product.id}`} className="text-[#c9a84c] text-sm tracking-wider">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <SectionReveal className="text-center mt-14">
            <Link
              href="/collections"
              data-testid="link-view-all"
              className="group border border-[rgba(201,168,76,0.3)] text-[#c9a84c]/80 text-xs tracking-[0.3em] uppercase px-10 py-4 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/60 transition-all duration-400 inline-flex items-center gap-3"
            >
              Voir toutes les collections
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* SPLIT BANNER — HOMME / FEMME */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        <div className="relative overflow-hidden group cursor-pointer">
          <Link href="/montres/homme" data-testid="link-banner-homme">
            <img
              src="https://images.unsplash.com/photo-1542496658-e33a6d0d56f6?w=1000&q=85"
              alt="Collection Homme"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 min-h-[50vh]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/80 mb-2">Collection</p>
              <h3 className="font-serif font-light text-4xl md:text-5xl mb-4">Pour Lui</h3>
              <span className="text-[10px] tracking-[0.3em] uppercase border-b border-white/40 pb-1 group-hover:border-[#c9a84c] group-hover:text-[#c9a84c] transition-colors duration-300">
                Découvrir
              </span>
            </div>
          </Link>
        </div>

        <div className="relative overflow-hidden group cursor-pointer">
          <Link href="/montres/femme" data-testid="link-banner-femme">
            <img
              src="https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?w=1000&q=85"
              alt="Collection Femme"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 min-h-[50vh]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/80 mb-2">Collection</p>
              <h3 className="font-serif font-light text-4xl md:text-5xl mb-4">Pour Elle</h3>
              <span className="text-[10px] tracking-[0.3em] uppercase border-b border-white/40 pb-1 group-hover:border-[#c9a84c] group-hover:text-[#c9a84c] transition-colors duration-300">
                Découvrir
              </span>
            </div>
          </Link>
        </div>
      </section>

      <MarqueeStrip />

      {/* NEW ARRIVALS */}
      <section className="py-28 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="flex items-end justify-between mb-20">
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-4">Nouveautés</p>
              <h2 className="font-serif font-light text-5xl md:text-6xl">Dernières Arrivées</h2>
            </div>
            <Link href="/collections" className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 hover:text-[#c9a84c] transition-colors hidden md:block">
              Tout voir
            </Link>
          </SectionReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {newArrivals.map((product, i) => (
              <motion.div key={product.id} variants={fadeUp}>
                <Link href={`/produit/${product.id}`} data-testid={`card-new-${product.id}`}>
                  <div className="group cursor-pointer">
                    <div className={`overflow-hidden bg-[#0f0f0f] mb-5 ${i === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] tracking-[0.3em] uppercase text-[#c9a84c]/50 mb-1">
                          {product.isNew && <span className="text-[#c9a84c]/80">Nouveau · </span>}
                          {product.category === 'homme' ? 'Homme' : 'Femme'}
                        </p>
                        <h3 className="font-serif text-2xl group-hover:text-[#c9a84c] transition-colors duration-300">{product.name}</h3>
                      </div>
                      <p className="text-[#c9a84c] text-sm">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(201,168,76,0.3)_0%,transparent_70%)]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <SectionReveal>
            <div className="w-8 h-[1px] bg-[#c9a84c]/40 mx-auto mb-10" />
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-8">Notre Philosophie</p>
            <h2 className="font-serif font-light text-4xl md:text-6xl leading-tight mb-10">
              "Le temps ne se possède pas.{" "}
              <span className="italic text-[#c9a84c]">Il se contemple.</span>"
            </h2>
            <p className="text-foreground/50 leading-relaxed text-sm font-light max-w-xl mx-auto mb-10">
              Chez YsWatchs, chaque montre est une œuvre d'art vivante. Nous sélectionnons des pièces qui transcendent la simple fonction — des instruments qui racontent une histoire, portent une âme, et traversent les générations.
            </p>
            <div className="w-8 h-[1px] bg-[#c9a84c]/40 mx-auto" />
          </SectionReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <p className="font-serif text-3xl text-[#c9a84c] mb-4">YsWatchs</p>
            <p className="text-foreground/40 text-xs leading-relaxed max-w-xs">
              Montres de prestige pour hommes et femmes. L'art du temps, capturé dans chaque pièce.
            </p>
            <div className="mt-8 flex gap-4">
              <input
                type="email"
                placeholder="Votre email"
                data-testid="input-newsletter"
                className="flex-1 bg-transparent border border-[rgba(255,255,255,0.1)] px-4 py-2 text-xs text-foreground/70 placeholder-foreground/30 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              />
              <button
                data-testid="button-newsletter"
                className="border border-[#c9a84c]/40 text-[#c9a84c]/80 text-[9px] tracking-[0.3em] uppercase px-4 py-2 hover:bg-[#c9a84c]/10 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c]/60 mb-6">Navigation</p>
            <ul className="space-y-3">
              {[
                { label: "Collection Homme", href: "/montres/homme" },
                { label: "Collection Femme", href: "/montres/femme" },
                { label: "Toutes les Collections", href: "/collections" },
                { label: "Panier", href: "/panier" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-foreground/40 hover:text-[#c9a84c]/80 transition-colors tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c]/60 mb-6">Contact</p>
            <ul className="space-y-3 text-xs text-foreground/40">
              <li>contact@yswatchs.com</li>
              <li>+33 1 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/25">
            © 2024 YsWatchs. Tous droits réservés.
          </p>
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/25">
            Fait avec passion · Paris
          </p>
        </div>
      </footer>
    </div>
  );
}
