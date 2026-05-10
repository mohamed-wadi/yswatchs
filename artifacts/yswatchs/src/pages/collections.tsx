import { motion } from "framer-motion";
import { Link } from "wouter";
import { products, formatPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const categories = [
  { key: 'all', label: 'Tout' },
  { key: 'homme', label: 'Homme' },
  { key: 'femme', label: 'Femme' },
  { key: 'ceinture', label: 'Ceintures' },
  { key: 'parfum', label: 'Parfums' },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-4"
          >
            Nos créations
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif font-light text-6xl md:text-7xl mb-4"
          >
            Toutes les <span className="italic text-[#c9a84c]">Collections</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-foreground/40 text-xs tracking-[0.2em]"
          >
            {products.length} pièces sélectionnées
          </motion.p>
        </div>
      </div>

      <div className="my-8">
        <MarqueeStrip />
      </div>

      {/* Category highlights */}
      {categories.filter(c => c.key !== 'all').map(cat => {
        const catProducts = products.filter(p => p.category === cat.key);
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.key} className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/60 mb-2">
                    {catProducts.length} pièce{catProducts.length > 1 ? 's' : ''}
                  </p>
                  <h2 className="font-serif font-light text-4xl">{cat.label}</h2>
                </div>
                {(cat.key === 'homme' || cat.key === 'femme') && (
                  <Link
                    href={`/montres/${cat.key}`}
                    data-testid={`link-see-all-${cat.key}`}
                    className="text-[9px] tracking-[0.3em] uppercase text-foreground/30 hover:text-[#c9a84c] transition-colors"
                  >
                    Voir tout
                  </Link>
                )}
              </div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={`grid gap-6 ${
                  catProducts.length >= 3
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : catProducts.length === 2
                    ? 'grid-cols-1 md:grid-cols-2 max-w-2xl'
                    : 'grid-cols-1 max-w-sm'
                }`}
              >
                {catProducts.slice(0, 4).map(product => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <Link href={`/produit/${product.id}`} data-testid={`card-product-${product.id}`}>
                      <div className="group border border-[rgba(255,255,255,0.06)] bg-card product-card-hover cursor-pointer overflow-hidden">
                        <div className="aspect-square bg-[#0f0f0f] overflow-hidden relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            {product.isNew && (
                              <span className="text-[7px] tracking-[0.25em] uppercase bg-[#c9a84c] text-black px-2 py-1">
                                Nouveau
                              </span>
                            )}
                            {!product.inStock && (
                              <span className="text-[7px] tracking-[0.25em] uppercase bg-red-700 text-white px-2 py-1">
                                Rupture
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-serif text-xl mb-1 group-hover:text-[#c9a84c] transition-colors duration-300">
                            {product.name}
                          </h3>
                          <p className="text-[#c9a84c] text-sm">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
