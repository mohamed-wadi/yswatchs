import { motion } from "framer-motion";
import { Link } from "wouter";
import { products, formatPrice, getDiscountedPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

export default function CollectionsPage() {
  const hommeProducts = products.filter(p => p.category === 'homme');
  const allProducts = products.filter(p => p.category === 'homme' || p.category === 'femme');

  return (
    <div style={{ background: '#0C0A08', color: '#F5F0E8', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div className="relative pt-28 sm:pt-32 pb-12 px-6 overflow-hidden" style={{ background: '#09070A' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.07) 0%, transparent 55%)',
        }} />
        <div className="h-[2px] absolute top-0 left-0 right-0"
          style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.45), transparent)' }} />
        {/* Corner ornaments */}
        <div className="absolute bottom-4 left-8 hidden sm:block" style={{ width: '24px', height: '24px', borderLeft: '1px solid rgba(201,168,76,0.3)', borderBottom: '1px solid rgba(201,168,76,0.3)' }} />
        <div className="absolute bottom-4 right-8 hidden sm:block" style={{ width: '24px', height: '24px', borderRight: '1px solid rgba(201,168,76,0.3)', borderBottom: '1px solid rgba(201,168,76,0.3)' }} />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label-victorian mb-4">
            ✦ &nbsp; Nos Créations &nbsp; ✦
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Toutes les <em className="gold-text" style={{ fontStyle: 'italic' }}>Collections</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.28)', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif" }}>
            {allProducts.length} montres sélectionnées à la main
          </motion.p>
        </div>
      </div>

      <div className="vr-gold" />
      <MarqueeStrip />
      <div className="vr-gold" />

      {/* Collection Homme */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div>
              <p className="label-victorian mb-2" style={{ fontSize: '0.55rem' }}>
                {hommeProducts.length} pièces exclusives
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, letterSpacing: '0.04em' }}>
                Horlogerie <em className="gold-text" style={{ fontStyle: 'italic' }}>Masculine</em>
              </h2>
            </div>
            <Link href="/montres/homme"
              className="hidden sm:flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
              style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', borderBottom: '1px solid rgba(245,240,232,0.15)', paddingBottom: '2px' }}>
              Explorer tout
            </Link>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {hommeProducts.map(product => {
              const disc = product.discount ? getDiscountedPrice(product.price, product.discount) : null;
              return (
                <motion.div key={product.id} variants={fadeUp}>
                  <Link href={`/produit/${product.id}`}>
                    <div className="card-victorian cursor-pointer overflow-hidden group">
                      <div className="watch-display aspect-square flex items-center justify-center p-4 sm:p-6 relative">
                        <img src={product.images[0]} alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-700"
                          style={{ maxHeight: '100%', maxWidth: '100%', filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.7))' }} />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.discount && (
                            <span className="promo-badge text-[6px] tracking-[0.15em] uppercase px-1.5 py-0.5 font-medium"
                              style={{ background: '#C9A84C', color: '#0C0A08' }}>-{product.discount}%</span>
                          )}
                          {product.isNew && (
                            <span className="text-[6px] tracking-[0.15em] uppercase px-1.5 py-0.5"
                              style={{ background: '#1C1408', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>New</span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4" style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}>
                        <h3 className="group-hover:text-[#C9A84C] transition-colors mb-2 line-clamp-1"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 400, letterSpacing: '0.02em' }}>
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="gold-text" style={{ fontSize: '0.82rem' }}>
                            {disc ? formatPrice(disc) : formatPrice(product.price)}
                          </span>
                          {disc && (
                            <span style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.2)', textDecoration: 'line-through' }}>
                              {formatPrice(product.price)}
                            </span>
                          )}
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

      {/* Coming soon — femme */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="vr-gold mb-16" />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center py-16 px-8"
            style={{ border: '1px solid rgba(201,168,76,0.18)', background: '#0A0806', position: 'relative' }}>
            {/* corner ornaments */}
            {[['top-3 left-3', '1px 0 0 1px'], ['top-3 right-3', '1px 1px 0 0'], ['bottom-3 left-3', '0 0 1px 1px'], ['bottom-3 right-3', '0 1px 1px 0']].map(([pos, bw], i) => (
              <div key={i} className={`absolute ${pos}`} style={{ width: '12px', height: '12px', borderWidth: bw, borderStyle: 'solid', borderColor: 'rgba(201,168,76,0.35)' }} />
            ))}
            <p className="label-victorian mb-4" style={{ fontSize: '0.55rem' }}>✦ &nbsp; Prochainement &nbsp; ✦</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '1rem' }}>
              Horlogerie <em className="gold-text" style={{ fontStyle: 'italic' }}>Féminine</em>
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.35)', letterSpacing: '0.15em', lineHeight: 1.8, maxWidth: '420px', margin: '0 auto 2rem', fontFamily: "'Jost', sans-serif" }}>
              Notre collection féminine est actuellement en cours de création.<br/>
              Des pièces d'exception vous seront bientôt dévoilées.
            </p>
            <button className="btn-victorian" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
              Bientôt disponible
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
