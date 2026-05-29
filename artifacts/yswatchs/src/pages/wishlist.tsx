import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, getDiscountedPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div style={{ minHeight: "100vh", background: "var(--ys-bg)", color: "var(--ys-text)", transition: "background 0.45s, color 0.45s" }}>
      <Navbar />

      <div className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <p className="label-victorian mb-3" style={{ fontSize: "0.58rem" }}>Vos coups de cœur</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "0.03em", color: "var(--ys-text)" }}>
                Liste de Souhaits{" "}
                {items.length > 0 && (
                  <span style={{ color: "var(--ys-text-dim)", fontSize: "0.5em" }}>({items.length})</span>
                )}
              </h1>
            </div>
            <Link href="/"
              className="inline-flex items-center gap-2 hover:text-[var(--ys-gold)] transition-colors"
              style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "'Jost', sans-serif", color: "var(--ys-text-muted)" }}>
              <FiArrowLeft />
              Continuer les achats
            </Link>
          </div>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 sm:py-32">
              <div className="w-16 h-[1px] mx-auto mb-10" style={{ background: "var(--ys-border)" }} />
              <FiHeart style={{ fontSize: "2.5rem", color: "var(--ys-border)", margin: "0 auto 1.5rem" }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "var(--ys-text-dim)", marginBottom: "1rem" }}>
                Votre liste est vide
              </p>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--ys-text-muted)", fontFamily: "'Jost', sans-serif", marginBottom: "3rem" }}>
                Ajoutez des pièces qui vous inspirent
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/montres/homme">
                  <button className="btn-victorian-filled">Collection Homme</button>
                </Link>
                <Link href="/collections">
                  <button className="btn-victorian">Toutes les collections</button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <div style={{ borderTop: "1px solid var(--ys-border)" }}>
                <AnimatePresence>
                  {items.map(product => {
                    const disc = product.discount ? getDiscountedPrice(product.price, product.discount) : null;
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, overflow: "hidden" }}
                        className="flex gap-4 sm:gap-6 py-6 sm:py-8"
                        style={{ borderBottom: "1px solid var(--ys-border)" }}
                      >
                        <Link href={`/produit/${product.id}`} className="flex-shrink-0">
                          <div className="watch-display flex items-center justify-center p-2"
                            style={{ width: "88px", height: "88px", border: "1px solid var(--ys-border)" }}>
                            <img src={product.images[0]} alt={product.name}
                              className="w-full h-full object-contain" style={{ filter: "var(--ys-img-filter)" }} />
                          </div>
                        </Link>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="label-victorian mb-1" style={{ fontSize: "0.52rem" }}>
                                {product.category === "homme" ? "Collection Homme" : "Collection Femme"}
                              </p>
                              <Link href={`/produit/${product.id}`}>
                                <h3 className="hover:text-[var(--ys-gold)] transition-colors"
                                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 400, letterSpacing: "0.02em", color: "var(--ys-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {product.name}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="gold-text" style={{ fontSize: "0.95rem", letterSpacing: "0.05em" }}>
                                  {disc ? formatPrice(disc) : formatPrice(product.price)}
                                </span>
                                {disc && (
                                  <span style={{ fontSize: "0.75rem", color: "var(--ys-text-dim)", textDecoration: "line-through" }}>
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="hover:text-red-500 transition-colors flex-shrink-0 mt-1"
                              style={{ color: "var(--ys-text-dim)" }}
                              title="Retirer de la liste"
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <div className="mt-3">
                            {product.inStock ? (
                              <button
                                onClick={() => { addToCart(product, 1); removeFromWishlist(product.id); }}
                                className="btn-victorian flex items-center gap-2"
                                style={{ padding: "0.55rem 1.2rem", fontSize: "0.55rem" }}
                              >
                                <FiShoppingCart style={{ fontSize: "0.75rem" }} />
                                Ajouter au panier
                              </button>
                            ) : (
                              <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--ys-text-dim)", fontFamily: "'Jost', sans-serif" }}>
                                Rupture de stock
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="pt-5">
                <button onClick={clearWishlist}
                  className="hover:text-[var(--ys-gold)] transition-colors"
                  style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ys-text-dim)", fontFamily: "'Jost', sans-serif", background: "none", border: "none", cursor: "pointer" }}>
                  Vider la liste
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
