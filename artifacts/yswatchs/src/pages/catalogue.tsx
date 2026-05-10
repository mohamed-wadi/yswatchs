import { useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { products, formatPrice, type Category } from "@/lib/data";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
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

  const heroImg = category === 'homme'
    ? "https://images.unsplash.com/photo-1542496658-e33a6d0d56f6?w=1600&q=85"
    : "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?w=1600&q=85";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-[55vh] flex items-end overflow-hidden">
        <img src={heroImg} alt={category} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="relative z-10 pb-16 px-8 md:px-16 max-w-7xl w-full mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-3"
          >
            Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-6xl md:text-8xl"
          >
            {category === 'homme' ? (
              <>Pour <span className="italic text-[#c9a84c]">Lui</span></>
            ) : (
              <>Pour <span className="italic text-[#c9a84c]">Elle</span></>
            )}
          </motion.h1>
        </div>
      </div>

      <MarqueeStrip />

      {/* Filters & sort */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3 flex-wrap">
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
              className={`text-[9px] tracking-[0.3em] uppercase px-4 py-2 border transition-all duration-300 ${
                filter === f.key
                  ? 'border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/5'
                  : 'border-[rgba(255,255,255,0.1)] text-foreground/40 hover:border-[rgba(255,255,255,0.2)] hover:text-foreground/70'
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
          className="bg-transparent border border-[rgba(255,255,255,0.1)] text-foreground/50 text-[9px] tracking-[0.2em] uppercase px-4 py-2 focus:outline-none focus:border-[#c9a84c]/40"
        >
          <option value="default">Par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom</option>
        </select>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-28">
        {sorted.length === 0 ? (
          <div className="text-center py-28 text-foreground/30 font-serif text-2xl">Aucun résultat</div>
        ) : (
          <motion.div
            key={`${category}-${filter}-${sort}`}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sorted.map(product => (
              <motion.div key={product.id} variants={fadeUp}>
                <Link href={`/produit/${product.id}`} data-testid={`card-product-${product.id}`}>
                  <div className="group border border-[rgba(255,255,255,0.06)] bg-card product-card-hover cursor-pointer overflow-hidden">
                    <div className="aspect-square bg-[#0f0f0f] overflow-hidden relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.isNew && (
                          <span className="text-[8px] tracking-[0.3em] uppercase bg-[#c9a84c] text-black px-2 py-1">
                            Nouveau
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="text-[8px] tracking-[0.3em] uppercase bg-red-700 text-white px-2 py-1">
                            Rupture
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl mb-1 group-hover:text-[#c9a84c] transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-foreground/40 text-xs leading-relaxed mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p data-testid={`text-price-${product.id}`} className="text-[#c9a84c] text-sm tracking-wider">
                          {formatPrice(product.price)}
                        </p>
                        <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/30 group-hover:text-[#c9a84c]/60 transition-colors">
                          Voir
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
