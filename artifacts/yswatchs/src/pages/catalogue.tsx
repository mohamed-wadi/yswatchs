import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { products, formatPrice, type Category } from "@/lib/data";
import { watchGold, watchSilver } from "@/lib/watch-images";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

export default function CataloguePage() {
  const [matchHomme] = useRoute("/montres/homme");
  const category: Category = matchHomme ? "homme" : "femme";
  const [sort, setSort] = useState<SortOption>('default');
  const [filter, setFilter] = useState<'all' | 'new' | 'bestseller' | 'instock'>('all');

  let filtered = products.filter(p => p.category === category);
  if (filter === 'new') filtered = filtered.filter(p => p.isNew);
  if (filter === 'bestseller') filtered = filtered.filter(p => p.isBestSeller);
  if (filter === 'instock') filtered = filtered.filter(p => p.inStock);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const heroWatch = category === 'homme' ? watchGold : watchSilver;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero banner — light editorial */}
      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-[#F0E9DE]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EDE4D6] to-[#F5EFE6]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
          <div className="flex-1 text-center sm:text-left">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[9px] tracking-[0.55em] uppercase text-[#c9a84c]/70 mb-4"
            >
              Collection
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-light text-5xl sm:text-6xl md:text-7xl"
            >
              {category === 'homme' ? (
                <>Pour <span className="italic gold-gradient-text">Lui</span></>
              ) : (
                <>Pour <span className="italic gold-gradient-text">Elle</span></>
              )}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-foreground/40 text-xs tracking-[0.2em] mt-4"
            >
              {sorted.length} pièce{sorted.length !== 1 ? 's' : ''} sélectionnée{sorted.length !== 1 ? 's' : ''}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-36 sm:w-44 md:w-52 flex-shrink-0"
          >
            <img
              src={heroWatch}
              alt=""
              className="w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
            />
          </motion.div>
        </div>
      </div>

      <MarqueeStrip />

      {/* Filters & sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'new', label: 'Nouveautés' },
            { key: 'bestseller', label: 'Best-sellers' },
            { key: 'instock', label: 'En stock' },
          ].map(f => (
            <button
              key={f.key}
              data-testid={`filter-${f.key}`}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`text-[9px] tracking-[0.3em] uppercase px-3 sm:px-4 py-2 border transition-all duration-300 ${
                filter === f.key
                  ? 'border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/8'
                  : 'border-border text-foreground/40 hover:border-foreground/30 hover:text-foreground/70'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          data-testid="select-sort"
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="bg-white border border-border text-foreground/50 text-[9px] tracking-[0.2em] uppercase px-4 py-2 focus:outline-none focus:border-[#c9a84c]/40 w-full sm:w-auto"
        >
          <option value="default">Par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom</option>
        </select>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32">
        {sorted.length === 0 ? (
          <div className="text-center py-28 text-foreground/30 font-serif text-2xl">Aucun résultat</div>
        ) : (
          <motion.div
            key={`${category}-${filter}-${sort}`}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {sorted.map(product => (
              <motion.div key={product.id} variants={fadeUp}>
                <Link href={`/produit/${product.id}`} data-testid={`card-product-${product.id}`}>
                  <div className="group border border-border bg-white product-card-hover cursor-pointer overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                    <div className="aspect-square bg-[#F5F2EC] overflow-hidden relative flex items-center justify-center p-4 sm:p-6">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.isNew && (
                          <span className="text-[7px] tracking-[0.25em] uppercase bg-[#c9a84c] text-white px-2 py-1">
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
                    <div className="p-4 sm:p-6">
                      <h3 className="font-serif text-lg sm:text-xl md:text-2xl mb-1.5 group-hover:text-[#c9a84c] transition-colors duration-300 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-foreground/40 text-xs leading-relaxed mb-3 line-clamp-2 hidden sm:block">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p data-testid={`text-price-${product.id}`} className="text-[#c9a84c] text-sm tracking-wider">
                          {formatPrice(product.price)}
                        </p>
                        <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/25 group-hover:text-[#c9a84c]/60 transition-colors hidden sm:block">
                          Voir →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
