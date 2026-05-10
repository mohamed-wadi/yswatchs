import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { FiSearch, FiX } from "react-icons/fi";
import { products, formatPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

const suggestions = ["Herbelin", "Tissot", "Or", "Acier", "Bleu", "Homme", "Femme"];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = query.trim().length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 sm:mb-16"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-5">Recherche</p>
            <h1 className="font-serif font-light text-4xl sm:text-5xl mb-8 sm:mb-10">Trouver une pièce</h1>

            <div className="relative border-b-2 border-border focus-within:border-[#c9a84c]/50 transition-colors">
              <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/30 text-xl" />
              <input
                data-testid="input-search"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Nom, collection, catégorie..."
                className="w-full bg-transparent pl-8 pr-10 py-4 sm:py-5 text-lg sm:text-xl font-serif text-foreground placeholder-foreground/20 focus:outline-none"
                autoFocus
              />
              {query && (
                <button
                  data-testid="button-clear-search"
                  onClick={() => setQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  <FiX />
                </button>
              )}
            </div>
          </motion.div>

          {query.trim().length > 0 && query.trim().length < 2 && (
            <p className="text-foreground/30 text-xs tracking-widest">Continuez à taper...</p>
          )}

          <AnimatePresence mode="wait">
            {results.length > 0 && (
              <motion.div
                key={query}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-[9px] tracking-[0.4em] uppercase text-foreground/30 mb-7">
                  {results.length} résultat{results.length > 1 ? 's' : ''} pour "{query}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {results.map(product => (
                    <Link key={product.id} href={`/produit/${product.id}`} data-testid={`result-product-${product.id}`}>
                      <div className="group flex gap-4 sm:gap-5 border border-border bg-white p-4 product-card-hover cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 bg-[#F5F2EC] border border-border overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <p className="text-[8px] tracking-[0.35em] uppercase text-[#c9a84c]/60 mb-1">
                            {product.category === 'homme' ? 'Homme' : product.category === 'femme' ? 'Femme' : product.category}
                          </p>
                          <h3 className="font-serif text-lg sm:text-xl group-hover:text-[#c9a84c] transition-colors truncate">{product.name}</h3>
                          <p className="text-[#c9a84c] text-sm mt-1">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {query.trim().length >= 2 && results.length === 0 && (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="font-serif text-3xl text-foreground/20 mb-4">Aucun résultat</p>
                <p className="text-foreground/30 text-xs tracking-widest mb-10">
                  Essayez "Herbelin", "Tissot", "Or"...
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/montres/homme" className="border border-border text-foreground/40 text-[10px] tracking-[0.3em] uppercase px-6 py-3 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors">
                    Homme
                  </Link>
                  <Link href="/montres/femme" className="border border-border text-foreground/40 text-[10px] tracking-[0.3em] uppercase px-6 py-3 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors">
                    Femme
                  </Link>
                </div>
              </motion.div>
            )}

            {!query && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                <p className="text-[9px] tracking-[0.4em] uppercase text-foreground/25 mb-5">Suggestions</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      data-testid={`suggestion-${s.toLowerCase()}`}
                      onClick={() => setQuery(s)}
                      className="border border-border text-foreground/40 text-xs tracking-[0.2em] uppercase px-4 sm:px-5 py-2 sm:py-3 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors bg-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
