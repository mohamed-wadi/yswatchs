import { motion } from "framer-motion";
import { Link } from "wouter";
import { products, formatPrice, getDiscountedPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

const categories = [
  { key: 'homme', label: 'Homme', bg: '#1C1812' },
  { key: 'femme', label: 'Femme', bg: '#F5EFE6' },
  { key: 'ceinture', label: 'Ceintures', bg: '#FAF8F3' },
  { key: 'parfum', label: 'Parfums', bg: '#FAF8F3' },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <div className="pt-28 sm:pt-32 pb-10 px-6 bg-[#EDE5D9]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c] mb-4 font-medium"
          >
            Nos créations
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif font-light text-5xl sm:text-6xl md:text-7xl mb-4 text-foreground"
          >
            Toutes les <span className="italic gold-gradient-text">Collections</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-foreground/50 text-xs tracking-[0.2em]"
          >
            {products.filter(p => p.category === 'homme' || p.category === 'femme').length} montres sélectionnées
          </motion.p>
        </div>
      </div>

      <div className="my-0">
        <MarqueeStrip />
      </div>

      {/* Category sections */}
      {categories.map(cat => {
        const catProducts = products.filter(p => p.category === cat.key);
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.key} className="py-16 sm:py-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8 sm:mb-12">
                <div>
                  <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c] mb-2 font-medium">
                    {catProducts.length} pièce{catProducts.length > 1 ? 's' : ''}
                  </p>
                  <h2 className="font-serif font-light text-3xl sm:text-4xl text-foreground">{cat.label}</h2>
                </div>
                {(cat.key === 'homme' || cat.key === 'femme') && (
                  <Link
                    href={`/montres/${cat.key}`}
                    className="text-[9px] tracking-[0.3em] uppercase text-foreground/40 hover:text-[#c9a84c] transition-colors hidden sm:block border-b border-foreground/20 pb-0.5 hover:border-[#c9a84c]"
                  >
                    Voir tout →
                  </Link>
                )}
              </div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={`grid gap-4 sm:gap-6 ${
                  catProducts.length >= 3
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : catProducts.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                    : 'grid-cols-1 max-w-sm'
                }`}
              >
                {catProducts.slice(0, 4).map(product => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <Link href={`/produit/${product.id}`}>
                      <div className="group border border-border bg-white product-card-hover cursor-pointer overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                        <div className="aspect-square bg-[#F8F5EF] overflow-hidden relative flex items-center justify-center p-5 sm:p-6">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.discount && (
                              <span className="text-[7px] tracking-[0.2em] uppercase bg-[#c9a84c] text-white px-2 py-1 font-medium promo-badge">
                                -{product.discount}%
                              </span>
                            )}
                            {product.isNew && !product.discount && (
                              <span className="text-[7px] tracking-[0.25em] uppercase bg-[#1C1812] text-white px-2 py-1">
                                Nouveau
                              </span>
                            )}
                            {!product.inStock && (
                              <span className="text-[7px] tracking-[0.25em] uppercase bg-red-500 text-white px-2 py-1">
                                Rupture
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className="font-serif text-base sm:text-lg mb-1.5 group-hover:text-[#c9a84c] transition-colors duration-300 line-clamp-1 text-foreground">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
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

              {(cat.key === 'homme' || cat.key === 'femme') && catProducts.length > 4 && (
                <div className="mt-8 text-center sm:hidden">
                  <Link href={`/montres/${cat.key}`} className="text-[9px] tracking-[0.3em] uppercase text-foreground/45 hover:text-[#c9a84c] transition-colors border-b border-current pb-1">
                    Voir tout
                  </Link>
                </div>
              )}
            </div>

            {cat.key !== 'parfum' && <div className="max-w-7xl mx-auto mt-12 h-[1px] bg-border" />}
          </section>
        );
      })}
    </div>
  );
}
