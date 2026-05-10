import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { FiSearch, FiX } from "react-icons/fi";
import { products, formatPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

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

      <div className="pt-32 pb-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-6">Recherche</p>
            <h1 className="font-serif font-light text-5xl mb-10">Trouver une pièce</h1>

            <div className="relative border-b border-[rgba(255,255,255,0.15)] focus-within:border-[#c9a84c]/60 transition-colors">
              <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/30 text-xl" />
              <input
                data-testid="input-search"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Nom, collection, catégorie..."
                className="w-full bg-transparent pl-8 pr-10 py-5 text-xl font-serif text-foreground placeholder-foreground/20 focus:outline-none"
                autoFocus
              />
              {query && (
                <button
                  data-testid="button-clear-search"
                  onClick={() => setQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/70 transition-colors"
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
                <p className="text-[9px] tracking-[0.4em] uppercase text-foreground/30 mb-8">
                  {results.length} résultat{results.length > 1 ? 's' : ''} pour "{query}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map(product => (
                    <Link key={product.id} href={`/produit/${product.id}`} data-testid={`result-product-${product.id}`}>
                      <div className="group flex gap-5 border border-[rgba(255,255,255,0.06)] bg-card p-4 product-card-hover cursor-pointer">
                        <div className="w-20 h-20 bg-[#0f0f0f] overflow-hidden flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[8px] tracking-[0.35em] uppercase text-[#c9a84c]/50 mb-1">
                            {product.category}
                          </p>
                          <h3 className="font-serif text-xl group-hover:text-[#c9a84c] transition-colors">{product.name}</h3>
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
                  Essayez "Obsidian", "Lumière", "Chronos"...
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/montres/homme" className="border border-[rgba(255,255,255,0.1)] text-foreground/40 text-xs tracking-[0.3em] uppercase px-6 py-3 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]/70 transition-colors">
                    Homme
                  </Link>
                  <Link href="/montres/femme" className="border border-[rgba(255,255,255,0.1)] text-foreground/40 text-xs tracking-[0.3em] uppercase px-6 py-3 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]/70 transition-colors">
                    Femme
                  </Link>
                </div>
              </motion.div>
            )}

            {!query && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4">
                <p className="text-[9px] tracking-[0.4em] uppercase text-foreground/25 mb-6">Suggestions</p>
                <div className="flex flex-wrap gap-3">
                  {["Obsidian", "Lumière", "Atlas", "Chronos", "Céleste", "Saphir"].map(suggestion => (
                    <button
                      key={suggestion}
                      data-testid={`suggestion-${suggestion.toLowerCase()}`}
                      onClick={() => setQuery(suggestion)}
                      className="border border-[rgba(255,255,255,0.08)] text-foreground/40 text-xs tracking-[0.2em] uppercase px-5 py-3 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]/70 transition-colors"
                    >
                      {suggestion}
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
