import { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight, FiTag, FiHeart } from "react-icons/fi";
import { products, formatPrice, getDiscountedPrice, getDiscountedProducts } from "@/lib/data";
import { useWishlist } from "@/hooks/use-wishlist";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";
import VictorianClock from "@/components/VictorianClock";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

function GearSvg({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}
      style={{ color: 'var(--ys-gold-dim, rgba(201,168,76,0.12))' }}>
      <path d="M50 20a30 30 0 1 0 0 60A30 30 0 0 0 50 20zm0 8a22 22 0 1 1 0 44 22 22 0 0 1 0-44z" fill="currentColor"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
        <rect key={i} x="47" y="6" width="6" height="14" rx="1" fill="currentColor" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="6" fill="currentColor"/>
    </svg>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const featured = products.slice(0, 3);
  const promoProducts = getDiscountedProducts().slice(0, 2);

  return (
    <div style={{ background: 'var(--ys-bg)', color: 'var(--ys-text)', minHeight: '100vh', transition: 'background 0.45s, color 0.45s' }}>
      <Navbar />

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--ys-bg-deep)' }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 60%, var(--ys-gold-glow) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--ys-hero-overlay)' }} />

        {/* Gears */}
        <motion.div className="absolute top-24 right-16 gear-spin hidden lg:block" style={{ y: heroY, opacity: heroOpacity }}>
          <GearSvg size={130} />
        </motion.div>
        <motion.div className="absolute bottom-32 left-12 gear-spin-slow hidden lg:block" style={{ y: heroY, opacity: heroOpacity }}>
          <GearSvg size={90} />
        </motion.div>
        <motion.div className="absolute top-2/3 right-24 gear-spin-med hidden xl:block" style={{ y: heroY }}>
          <GearSvg size={55} />
        </motion.div>
        <motion.div className="absolute top-1/4 left-24 gear-spin-slow hidden xl:block" style={{ y: heroY }}>
          <GearSvg size={70} />
        </motion.div>

        {/* Corner ornaments */}
        {[
          { pos: 'top-6 left-6', t: true, l: true },
          { pos: 'top-6 right-6', t: true, r: true },
          { pos: 'bottom-6 left-6', b: true, l: true },
          { pos: 'bottom-6 right-6', b: true, r: true },
        ].map(({ pos, t, b, l, r }, i) => (
          <div key={i} className={`absolute ${pos} hidden sm:block`}>
            <div className="w-10 h-10" style={{
              borderTop: t ? '1px solid var(--ys-border)' : 'none',
              borderBottom: b ? '1px solid var(--ys-border)' : 'none',
              borderLeft: l ? '1px solid var(--ys-border)' : 'none',
              borderRight: r ? '1px solid var(--ys-border)' : 'none',
            }} />
          </div>
        ))}

        {/* Hero content — two-column on large screens */}
        <motion.div
          className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-20"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Text column */}
          <div className="text-center lg:text-left flex-1">
            <motion.p className="label-victorian mb-8 fade-up fade-up-1 block">
              ✦ &nbsp; Maison d'Horlogerie · Maroc &nbsp; ✦
            </motion.p>

            <h1 className="fade-up fade-up-2" style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(3.2rem, 9vw, 7rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '0.03em',
              marginBottom: '1.5rem',
              color: 'var(--ys-text)',
            }}>
              L'Art du Temps<br/>
              <em className="gold-text" style={{ fontStyle: 'italic' }}>Perpétuel</em>
            </h1>

            <div className="fade-up fade-up-3" style={{ marginBottom: '2.5rem' }}>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                color: 'var(--ys-text-muted)',
                maxWidth: '420px',
                margin: '0 auto',
                lineHeight: 1.9,
              }}>
                Chaque montre est une œuvre vivante — engrenages, cadrans et aiguilles
                orchestrés pour l'éternité. Bienvenue dans la Maison YsWatchs.
              </p>
            </div>

            <div className="fade-up fade-up-4 flex items-center justify-center lg:justify-start gap-4 flex-wrap">
              <Link href="/montres/homme">
                <button className="btn-victorian-filled">Découvrir la Collection</button>
              </Link>
              <Link href="/promotions">
                <button className="btn-victorian" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FiTag style={{ fontSize: '0.7rem' }} /> Promotions
                </button>
              </Link>
            </div>
          </div>

          {/* Clock column */}
          <motion.div
            className="flex-shrink-0 flex flex-col items-center gap-4 clock-container"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <VictorianClock size={220} />
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.52rem',
              letterSpacing: '0.55em',
              textTransform: 'uppercase',
              color: 'var(--ys-gold)',
              opacity: 0.45,
            }}>
              Heure en direct
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div className="absolute left-1/2 -translate-x-1/2 bottom-8"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <div style={{ width: '1px', height: '46px', background: 'linear-gradient(to bottom, var(--ys-gold), transparent)', margin: '0 auto 6px', opacity: 0.5 }} />
          <p style={{ fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--ys-gold)', opacity: 0.3, fontFamily: "'Jost', sans-serif" }}>Défiler</p>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="relative z-10">
        <div className="vr-gold" />
        <MarqueeStrip />
        <div className="vr-gold" />
      </div>

      {/* ═══ FEATURED ═══════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <p className="label-victorian mb-5">✦ &nbsp; Pièces d'Exception &nbsp; ✦</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, letterSpacing: '0.04em', color: 'var(--ys-text)' }}>
              Collection <em className="gold-text" style={{ fontStyle: 'italic' }}>Prestige</em>
            </h2>
            <div className="ornament-divider mt-6 max-w-xs mx-auto">◆</div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featured.map(product => {
              const disc = product.discount ? getDiscountedPrice(product.price, product.discount) : null;
              return (
                <motion.div key={product.id} variants={fadeUp}>
                  <div className="card-victorian overflow-hidden group relative">
                    {/* Wishlist heart */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                      className="absolute top-3 right-3 z-10 flex items-center justify-center transition-all duration-250"
                      style={{
                        width: '30px', height: '30px',
                        background: isWishlisted(product.id) ? 'var(--ys-gold-dim)' : 'var(--ys-surface)',
                        border: `1px solid ${isWishlisted(product.id) ? 'var(--ys-gold)' : 'var(--ys-border)'}`,
                        color: isWishlisted(product.id) ? 'var(--ys-gold)' : 'var(--ys-text-dim)',
                      }}
                      title={isWishlisted(product.id) ? 'Retirer de la liste' : 'Ajouter à la liste de souhaits'}
                    >
                      <FiHeart style={{ fontSize: '0.75rem', fill: isWishlisted(product.id) ? 'var(--ys-gold)' : 'none' }} />
                    </button>
                    <Link href={`/produit/${product.id}`} className="cursor-pointer block">
                      <div className="watch-display aspect-square flex items-center justify-center p-8 sm:p-10 relative">
                        <img src={product.images[0]} alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                          style={{ maxHeight: '100%', maxWidth: '100%', filter: 'var(--ys-img-filter)' }} />
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                          {product.discount && (
                            <span className="promo-badge text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 font-medium"
                              style={{ background: 'var(--ys-gold)', color: 'var(--ys-bg)' }}>
                              -{product.discount}%
                            </span>
                          )}
                          {product.isNew && (
                            <span className="text-[7px] tracking-[0.25em] uppercase px-2.5 py-1"
                              style={{ background: 'var(--ys-surface-2)', color: 'var(--ys-gold)', border: '1px solid var(--ys-border)' }}>
                              Nouveau
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-5 sm:p-6" style={{ borderTop: '1px solid var(--ys-border)' }}>
                        <p className="label-victorian mb-2" style={{ fontSize: '0.55rem' }}>
                          {product.movement === 'automatique' ? 'Mécanique Automatique' : 'Mouvement Quartz'}
                        </p>
                        <h3 className="mb-3 group-hover:text-[var(--ys-gold)] transition-colors"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 400, letterSpacing: '0.02em', color: 'var(--ys-text)' }}>
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="gold-text" style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>
                              {disc ? formatPrice(disc) : formatPrice(product.price)}
                            </span>
                            {disc && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--ys-text-dim)', textDecoration: 'line-through' }}>
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <FiArrowRight style={{ color: 'var(--ys-border)', fontSize: '0.85rem' }}
                            className="group-hover:text-[var(--ys-gold)] transition-colors" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/montres/homme">
              <button className="btn-victorian">Voir toute la collection</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ QUOTE BANNER ════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6 relative overflow-hidden"
        style={{ background: 'var(--ys-surface)', borderTop: '1px solid var(--ys-border)', borderBottom: '1px solid var(--ys-border)', transition: 'background 0.45s' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 50%, var(--ys-gold-glow) 0%, transparent 60%)',
        }} />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
          <GearSvg size={180} className="gear-spin-slow" />
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block">
          <GearSvg size={110} className="gear-spin" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10">
          <p className="label-victorian mb-6">✦ &nbsp; Notre Philosophie &nbsp; ✦</p>
          <blockquote style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.45,
            letterSpacing: '0.02em',
            color: 'var(--ys-text)',
            opacity: 0.85,
            marginBottom: '2rem',
          }}>
            "Le temps est la seule richesse que l'on ne peut acquérir.<br/>
            On peut seulement choisir comment le porter."
          </blockquote>
          <div className="ornament-divider max-w-[200px] mx-auto mb-4">◆</div>
          <p className="label-victorian" style={{ fontSize: '0.65rem' }}>
            — Maison YsWatchs, Maroc
          </p>
        </motion.div>
      </section>

      {/* ═══ PROMOS ══════════════════════════════════════════ */}
      {promoProducts.length > 0 && (
        <section className="py-24 sm:py-28 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-14">
              <p className="label-victorian mb-4">✦ &nbsp; Offres Exceptionnelles &nbsp; ✦</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 300, letterSpacing: '0.04em', color: 'var(--ys-text)' }}>
                Promotions <em className="gold-text" style={{ fontStyle: 'italic' }}>du Moment</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {promoProducts.map(p => {
                const disc = getDiscountedPrice(p.price, p.discount!);
                return (
                  <Link key={p.id} href={`/produit/${p.id}`}>
                    <div className="card-victorian cursor-pointer overflow-hidden group flex gap-4 p-5 items-center">
                      <div className="watch-display flex-shrink-0 flex items-center justify-center p-2" style={{ width: '80px', height: '80px' }}>
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain"
                          style={{ filter: 'var(--ys-img-filter)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="promo-badge text-[7px] tracking-[0.2em] uppercase px-2 py-0.5 font-medium inline-block mb-1.5"
                          style={{ background: 'var(--ys-gold)', color: 'var(--ys-bg)' }}>-{p.discount}%</span>
                        <h4 className="group-hover:text-[var(--ys-gold)] transition-colors truncate mb-1.5"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '1.05rem', color: 'var(--ys-text)' }}>
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="gold-text" style={{ fontSize: '0.9rem' }}>{formatPrice(disc)}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--ys-text-dim)', textDecoration: 'line-through' }}>
                            {formatPrice(p.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link href="/promotions">
                <button className="btn-victorian" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FiTag style={{ fontSize: '0.7rem' }} /> Toutes les promotions
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FOOTER ══════════════════════════════════════════ */}
      <footer className="py-16 px-6 relative" style={{ borderTop: '1px solid var(--ys-border)' }}>
        <div className="h-[2px] absolute top-0 left-0 right-0"
          style={{ background: 'linear-gradient(to right, transparent, var(--ys-gold), transparent)', opacity: 0.4 }} />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {[
              { title: 'Maison', links: ['Notre histoire', 'Savoir-faire', 'Certifications', 'Presse'] },
              { title: 'Service', links: ['Guide des tailles', 'Entretien', 'Garantie', 'Retours'] },
            ].map(col => (
              <div key={col.title}>
                <p className="label-victorian mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(t => (
                    <li key={t}><span style={{ fontSize: '0.8rem', color: 'var(--ys-text-muted)', letterSpacing: '0.07em', cursor: 'pointer' }}
                      className="hover:text-[var(--ys-gold)] transition-colors">{t}</span></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="label-victorian mb-4">Contact</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--ys-text-muted)', lineHeight: 2, letterSpacing: '0.05em' }}>
                Casablanca, Maroc<br/>+212 6 00 00 00 00<br/>contact@yswatchs.ma
              </p>
            </div>
          </div>
          <div className="ornament-divider">◆</div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--ys-text-dim)' }}>
              © 2024 Maison YsWatchs — Tous droits réservés
            </p>
            <p className="label-victorian" style={{ fontSize: '0.5rem' }}>L'Art du Temps · Maroc</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
