import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { FiArrowRight, FiTag } from "react-icons/fi";
import { getDiscountedProducts, formatPrice, getDiscountedPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
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

export default function PromosPage() {
  const promoProducts = getDiscountedProducts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ─── Hero promo banner ─── */}
      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-[#1C1812]">
        {/* Animated radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/15 blur-[100px]" />
        </div>
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#c9a84c]/15 border border-[#c9a84c]/30 px-4 py-2 mb-8"
          >
            <FiTag className="text-[#c9a84c] text-sm" />
            <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c] font-medium">Offres exclusives · Durée limitée</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-5xl sm:text-6xl md:text-7xl text-white mb-6"
          >
            Promotions<br />
            <span className="italic gold-gradient-text">Privilèges</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-white/55 text-sm leading-relaxed max-w-md mx-auto mb-10"
          >
            Des montres d'exception sélectionnées à des prix privilégiés. Une opportunité rare, pour une clientèle d'exception.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8"
          >
            {[
              { num: `${promoProducts.length}`, label: "Pièces en promo" },
              { num: "jusqu'à", label: `${Math.max(...promoProducts.map(p => p.discount || 0))}% de remise` },
              { num: "Livraison", label: "offerte" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-2xl text-white font-light">{s.num}</p>
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <MarqueeStrip />

      {/* ─── Promo grid ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c] mb-4 font-medium">Sélection</p>
            <h2 className="font-serif font-light text-4xl sm:text-5xl text-foreground">Nos meilleures offres</h2>
            <div className="w-12 h-[1px] bg-[#c9a84c]/50 mx-auto mt-6" />
          </SectionReveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {promoProducts.map(product => {
              const discountedPrice = getDiscountedPrice(product.price, product.discount!);
              const savings = product.price - discountedPrice;

              return (
                <motion.div key={product.id} variants={fadeUp}>
                  <Link href={`/produit/${product.id}`}>
                    <div className="group bg-white border border-border product-card-hover cursor-pointer overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
                      {/* Discount banner */}
                      <div className="bg-[#c9a84c] py-2 px-4 flex items-center justify-between">
                        <span className="text-[9px] tracking-[0.4em] uppercase text-white font-medium">
                          Remise exclusive
                        </span>
                        <span className="font-serif text-2xl text-white font-light">
                          -{product.discount}%
                        </span>
                      </div>

                      {/* Image */}
                      <div className="relative aspect-square bg-[#F8F5EF] flex items-center justify-center p-8 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                        {product.isNew && (
                          <span className="absolute top-4 right-4 text-[7px] tracking-[0.25em] uppercase bg-[#1C1812] text-white px-2 py-1">
                            Nouveau
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-5 sm:p-6">
                        <p className="text-[8px] tracking-[0.4em] uppercase text-[#c9a84c] mb-2 font-medium">
                          {product.category === 'homme' ? 'Collection Homme' : 'Collection Femme'}
                        </p>
                        <h3 className="font-serif text-xl sm:text-2xl mb-4 group-hover:text-[#c9a84c] transition-colors duration-300 text-foreground">
                          {product.name}
                        </h3>

                        {/* Price comparison */}
                        <div className="flex items-end gap-3 mb-4">
                          <p className="font-serif text-2xl text-[#c9a84c]">
                            {formatPrice(discountedPrice)}
                          </p>
                          <p className="text-foreground/35 text-sm line-through mb-0.5">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* Savings badge */}
                        <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/25 px-3 py-1.5 mb-4">
                          <FiTag className="text-[#c9a84c] text-xs" />
                          <span className="text-[9px] tracking-[0.2em] uppercase text-[#c9a84c] font-medium">
                            Économie : {formatPrice(savings)}
                          </span>
                        </div>

                        {!product.inStock && (
                          <p className="text-red-500 text-[9px] tracking-[0.2em] uppercase mb-3">Rupture de stock</p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 group-hover:text-[#c9a84c] transition-colors">
                            Voir le détail
                          </span>
                          <FiArrowRight className="text-foreground/30 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 px-6 bg-[#F3EDE4]">
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a84c] mb-5 font-medium">Toutes nos pièces</p>
            <h2 className="font-serif font-light text-4xl sm:text-5xl mb-6 text-foreground">
              Découvrir l'ensemble<br />des collections
            </h2>
            <p className="text-foreground/55 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Au-delà des promotions, explorez toute notre sélection de montres de prestige.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/montres/homme"
                className="inline-flex items-center gap-3 bg-[#1C1812] text-white text-[10px] tracking-[0.35em] uppercase px-8 py-4 hover:bg-[#c9a84c] transition-all duration-300"
              >
                Collection Homme <FiArrowRight />
              </Link>
              <Link
                href="/montres/femme"
                className="inline-flex items-center gap-3 border border-[#c9a84c] text-[#c9a84c] text-[10px] tracking-[0.35em] uppercase px-8 py-4 hover:bg-[#c9a84c] hover:text-white transition-all duration-300"
              >
                Collection Femme
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
