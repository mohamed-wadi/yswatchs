import { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight, FiTag } from "react-icons/fi";
import { products, formatPrice, getDiscountedPrice, getDiscountedProducts } from "@/lib/data";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";

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
      style={{ color: 'rgba(201,168,76,0.12)' }}>
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

  const featured = products.slice(0, 3);
  const promoProducts = getDiscountedProducts().slice(0, 2);

  return (
    <div style={{ background: '#0C0A08', color: '#F5F0E8', minHeight: '100vh' }}>
      <Navbar />

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: '#08060A' }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 60%, rgba(201,168,76,0.07) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(8,6,10,0.55) 0%, transparent 35%, rgba(8,6,10,0.9) 85%, #0C0A08 100%)' }} />

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
              borderTop: t ? '1px solid rgba(201,168,76,0.3)' : 'none',
              borderBottom: b ? '1px solid rgba(201,168,76,0.3)' : 'none',
              borderLeft: l ? '1px solid rgba(201,168,76,0.3)' : 'none',
              borderRight: r ? '1px solid rgba(201,168,76,0.3)' : 'none',
            }} />
          </div>
        ))}

        {/* Hero content */}
        <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.p className="label-victorian mb-8 fade-up fade-up-1" style={{ display: 'block' }}>
            ✦ &nbsp; Maison d'Horlogerie · Maroc &nbsp; ✦
          </motion.p>

          <h1 className="fade-up fade-up-2" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '0.03em',
            marginBottom: '1.5rem',
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
              color: 'rgba(245,240,232,0.45)',
              maxWidth: '420px',
              margin: '0 auto',
              lineHeight: 1.9,
            }}>
              Chaque montre est une œuvre vivante — engrenages, cadrans et aiguilles
              orchestrés pour l'éternité. Bienvenue dans la Maison YsWatchs.
            </p>
          </div>

          <div className="fade-up fade-up-4 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/montres/homme">
              <button className="btn-victorian-filled">Découvrir la Collection</button>
            </Link>
            <Link href="/promotions">
              <button className="btn-victorian" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiTag style={{ fontSize: '0.7rem' }} /> Promotions
              </button>
            </Link>
          </div>

          {/* Scroll cue */}
          <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '-110px' }}
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <div style={{ width: '1px', height: '46px', background: 'linear-gradient(to bottom, rgba(201,168,76,0.5), transparent)', margin: '0 auto 6px' }} />
            <p style={{ fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)', fontFamily: "'Jost', sans-serif" }}>Défiler</p>
          </motion.div>
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
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, letterSpacing: '0.04em' }}>
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
                  <Link href={`/produit/${product.id}`}>
                    <div className="card-victorian cursor-pointer overflow-hidden group">
                      <div className="watch-display aspect-square flex items-center justify-center p-8 sm:p-10 relative">
                        <img src={product.images[0]} alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                          style={{ maxHeight: '100%', maxWidth: '100%', filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.7))' }} />
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                          {product.discount && (
                            <span className="promo-badge text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 font-medium"
                              style={{ background: '#C9A84C', color: '#0C0A08' }}>
                              -{product.discount}%
                            </span>
                          )}
                          {product.isNew && (
                            <span className="text-[7px] tracking-[0.25em] uppercase px-2.5 py-1"
                              style={{ background: '#1C1408', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.35)' }}>
                              Nouveau
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-5 sm:p-6" style={{ borderTop: '1px solid rgba(201,168,76,0.14)' }}>
                        <p className="label-victorian mb-2" style={{ fontSize: '0.55rem' }}>
                          {product.movement === 'automatique' ? 'Mécanique Automatique' : 'Mouvement Quartz'}
                        </p>
                        <h3 className="mb-3 group-hover:text-[#C9A84C] transition-colors"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 400, letterSpacing: '0.02em' }}>
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="gold-text" style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>
                              {disc ? formatPrice(disc) : formatPrice(product.price)}
                            </span>
                            {disc && (
                              <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.22)', textDecoration: 'line-through' }}>
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <FiArrowRight style={{ color: 'rgba(201,168,76,0.3)', fontSize: '0.85rem' }}
                            className="group-hover:text-[#C9A84C] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
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
        style={{ background: '#0A0806', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)',
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
            color: 'rgba(245,240,232,0.85)',
            marginBottom: '2rem',
          }}>
            "Le temps est la seule richesse que l'on ne peut acquérir.<br/>
            On peut seulement choisir comment le porter."
          </blockquote>
          <div className="ornament-divider max-w-[200px] mx-auto mb-4">◆</div>
          <p className="label-victorian" style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.55rem' }}>
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
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 300, letterSpacing: '0.04em' }}>
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
                          style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="promo-badge text-[7px] tracking-[0.2em] uppercase px-2 py-0.5 font-medium inline-block mb-1.5"
                          style={{ background: '#C9A84C', color: '#0C0A08' }}>-{p.discount}%</span>
                        <h4 className="group-hover:text-[#C9A84C] transition-colors truncate mb-1.5"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '1.05rem' }}>
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="gold-text" style={{ fontSize: '0.9rem' }}>{formatPrice(disc)}</span>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.22)', textDecoration: 'line-through' }}>
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
      <footer className="py-16 px-6 relative" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="h-[2px] absolute top-0 left-0 right-0"
          style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)' }} />
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
                    <li key={t}><span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.38)', letterSpacing: '0.07em', cursor: 'pointer' }}
                      className="hover:text-[#C9A84C] transition-colors">{t}</span></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="label-victorian mb-4">Contact</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.38)', lineHeight: 2, letterSpacing: '0.05em' }}>
                Casablanca, Maroc<br/>+212 6 00 00 00 00<br/>contact@yswatchs.ma
              </p>
            </div>
          </div>
          <div className="ornament-divider">◆</div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.18)' }}>
              © 2024 Maison YsWatchs — Tous droits réservés
            </p>
            <p className="label-victorian" style={{ fontSize: '0.5rem' }}>L'Art du Temps · Maroc</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
