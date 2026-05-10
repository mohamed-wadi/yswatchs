import { Link } from "wouter";
import { motion } from "framer-motion";
import { FiTag, FiArrowRight } from "react-icons/fi";
import { getDiscountedProducts, formatPrice, getDiscountedPrice, products } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

function GearSvg({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}
      style={{ color: 'rgba(201,168,76,0.1)' }}>
      <path d="M50 20a30 30 0 1 0 0 60A30 30 0 0 0 50 20zm0 8a22 22 0 1 1 0 44 22 22 0 0 1 0-44z" fill="currentColor"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
        <rect key={i} x="47" y="6" width="6" height="14" rx="1" fill="currentColor" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="6" fill="currentColor"/>
    </svg>
  );
}

export default function PromosPage() {
  const promoProducts = getDiscountedProducts();
  const totalSavings = promoProducts.reduce((acc, p) => acc + (p.price - getDiscountedPrice(p.price, p.discount!)), 0);

  return (
    <div style={{ background: '#0C0A08', color: '#F5F0E8', minHeight: '100vh' }}>
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative pt-28 sm:pt-32 pb-16 px-6 overflow-hidden" style={{ background: '#08060A' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(201,168,76,0.1) 0%, transparent 55%)',
        }} />
        <div className="h-[2px] absolute top-0 left-0 right-0"
          style={{ background: 'linear-gradient(to right, transparent, #C9A84C 20%, #E2C87A 50%, #C9A84C 80%, transparent)' }} />

        {/* Gears */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:block">
          <GearSvg size={160} className="gear-spin-slow" />
        </div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
          <GearSvg size={120} className="gear-spin" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 mb-7 px-5 py-2.5"
            style={{ border: '1px solid rgba(201,168,76,0.35)', background: 'rgba(201,168,76,0.06)' }}>
            <FiTag style={{ color: '#C9A84C', fontSize: '0.9rem' }} />
            <span className="label-victorian" style={{ fontSize: '0.6rem' }}>Offres Exceptionnelles</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '0.03em', marginBottom: '1.5rem' }}>
            Promotions<br/>
            <em className="gold-text" style={{ fontStyle: 'italic' }}>du Moment</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.2em', lineHeight: 1.8, marginBottom: '2rem', fontFamily: "'Jost', sans-serif" }}>
            Des pièces d'exception sélectionnées à prix réduit pour une durée limitée.
          </motion.p>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex items-center justify-center gap-8 sm:gap-16 flex-wrap">
            {[
              { label: 'Pièces en promotion', value: promoProducts.length.toString() },
              { label: 'Économie maximale', value: `${Math.max(...promoProducts.map(p => p.discount!))}%` },
              { label: 'Économies totales', value: formatPrice(totalSavings) },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="gold-text" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, letterSpacing: '0.05em' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', fontFamily: "'Jost', sans-serif' " }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="vr-gold" />

      {/* ─── Promo products ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {promoProducts.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: 'rgba(245,240,232,0.25)', marginBottom: '1.5rem' }}>
                Aucune promotion en ce moment
              </p>
              <Link href="/collections">
                <button className="btn-victorian">Voir toutes les collections</button>
              </Link>
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {promoProducts.map(product => {
                const discounted = getDiscountedPrice(product.price, product.discount!);
                const savings = product.price - discounted;
                return (
                  <motion.div key={product.id} variants={fadeUp}>
                    <Link href={`/produit/${product.id}`}>
                      <div className="card-victorian cursor-pointer overflow-hidden group h-full flex flex-col">
                        {/* Image */}
                        <div className="watch-display relative flex items-center justify-center p-10 sm:p-12"
                          style={{ aspectRatio: '1', position: 'relative' }}>
                          {/* Ornamental frame corners */}
                          {[['top-3 left-3', '1px 0 0 1px'], ['top-3 right-3', '1px 1px 0 0'], ['bottom-3 left-3', '0 0 1px 1px'], ['bottom-3 right-3', '0 1px 1px 0']].map(([pos, bw], i) => (
                            <div key={i} className={`absolute ${pos}`} style={{ width: '12px', height: '12px', borderWidth: bw, borderStyle: 'solid', borderColor: 'rgba(201,168,76,0.35)' }} />
                          ))}

                          <img src={product.images[0]} alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                            style={{ maxHeight: '100%', maxWidth: '100%', filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.75))' }} />

                          {/* Promo badge */}
                          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                            <span className="promo-badge text-[8px] tracking-[0.25em] uppercase px-2.5 py-1 font-semibold"
                              style={{ background: '#C9A84C', color: '#0C0A08' }}>
                              -{product.discount}%
                            </span>
                            {product.isNew && (
                              <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: '#1C1408', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)', padding: '3px 8px' }}>
                                Nouveau
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col" style={{ borderTop: '1px solid rgba(201,168,76,0.14)' }}>
                          <p className="label-victorian mb-2" style={{ fontSize: '0.53rem' }}>
                            {product.movement === 'automatique' ? 'Mécanique Automatique' : 'Mouvement Quartz'}
                          </p>
                          <h3 className="group-hover:text-[#C9A84C] transition-colors mb-3 flex-1"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 400, letterSpacing: '0.02em' }}>
                            {product.name}
                          </h3>

                          <div className="flex items-end justify-between">
                            <div>
                              <p className="gold-text mb-1" style={{ fontSize: '1.3rem', letterSpacing: '0.05em' }}>
                                {formatPrice(discounted)}
                              </p>
                              <p style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.22)', textDecoration: 'line-through' }}>
                                {formatPrice(product.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', fontFamily: "'Jost', sans-serif", marginBottom: '2px' }}>
                                Économie
                              </p>
                              <p className="gold-text" style={{ fontSize: '0.9rem' }}>
                                {formatPrice(savings)}
                              </p>
                            </div>
                          </div>

                          <div className="vr-gold mt-4 mb-4" />

                          <div className="flex items-center justify-between">
                            <span style={{ fontSize: '0.55rem', color: 'rgba(245,240,232,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif" }}>
                              {product.inStock ? '✓ En stock' : 'Rupture de stock'}
                            </span>
                            <span className="group-hover:text-[#C9A84C] transition-colors flex items-center gap-1"
                              style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', fontFamily: "'Jost', sans-serif" }}>
                              Voir <FiArrowRight />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="ornament-divider mb-8">◆</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '1rem' }}>
            Découvrez toute la <em className="gold-text" style={{ fontStyle: 'italic' }}>Collection</em>
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.38)', letterSpacing: '0.15em', marginBottom: '2rem', fontFamily: "'Jost', sans-serif", lineHeight: 1.8 }}>
            {products.length} pièces d'horlogerie disponibles, chacune sélectionnée avec soin.
          </p>
          <Link href="/montres/homme">
            <button className="btn-victorian-filled">Explorer la collection</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
