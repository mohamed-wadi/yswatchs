import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { FiTrash2, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-32 pb-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-3">Votre sélection</p>
              <h1 className="font-serif font-light text-5xl md:text-6xl">
                Panier{" "}
                {totalItems > 0 && (
                  <span className="text-foreground/30 text-3xl">({totalItems})</span>
                )}
              </h1>
            </div>
            <Link
              href="/"
              data-testid="link-continue-shopping"
              className="hidden md:inline-flex items-center gap-2 text-foreground/40 hover:text-[#c9a84c] transition-colors text-xs tracking-[0.25em] uppercase"
            >
              <FiArrowLeft />
              Continuer les achats
            </Link>
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-28"
            >
              <p className="font-serif text-3xl text-foreground/20 mb-6">Votre panier est vide</p>
              <p className="text-foreground/30 text-xs tracking-widest mb-10">Découvrez nos collections exceptionnelles</p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/montres/homme"
                  data-testid="link-empty-homme"
                  className="border border-[#c9a84c]/40 text-[#c9a84c]/80 text-xs tracking-[0.3em] uppercase px-8 py-4 hover:bg-[#c9a84c]/10 transition-colors"
                >
                  Collection Homme
                </Link>
                <Link
                  href="/montres/femme"
                  data-testid="link-empty-femme"
                  className="border border-[rgba(255,255,255,0.1)] text-foreground/50 text-xs tracking-[0.3em] uppercase px-8 py-4 hover:border-[rgba(255,255,255,0.2)] transition-colors"
                >
                  Collection Femme
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="border-t border-[rgba(255,255,255,0.06)]">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        data-testid={`cart-item-${item.product.id}`}
                        className="flex gap-6 py-8 border-b border-[rgba(255,255,255,0.06)]"
                      >
                        <Link href={`/produit/${item.product.id}`} className="flex-shrink-0">
                          <div className="w-24 h-24 bg-[#0f0f0f] overflow-hidden">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a84c]/50 mb-1">
                                {item.product.category === 'homme' ? 'Homme' : item.product.category === 'femme' ? 'Femme' : item.product.category}
                              </p>
                              <h3 className="font-serif text-xl">{item.product.name}</h3>
                            </div>
                            <button
                              data-testid={`button-remove-${item.product.id}`}
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-foreground/20 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-[rgba(255,255,255,0.1)]">
                              <button
                                data-testid={`button-minus-${item.product.id}`}
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="px-3 py-2 text-foreground/40 hover:text-foreground transition-colors text-sm"
                              >
                                −
                              </button>
                              <span data-testid={`text-qty-${item.product.id}`} className="px-3 text-sm min-w-[1.5rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                data-testid={`button-plus-${item.product.id}`}
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="px-3 py-2 text-foreground/40 hover:text-foreground transition-colors text-sm"
                              >
                                +
                              </button>
                            </div>
                            <p data-testid={`text-subtotal-${item.product.id}`} className="text-[#c9a84c] text-sm tracking-wider">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="pt-6">
                  <button
                    data-testid="button-clear-cart"
                    onClick={clearCart}
                    className="text-foreground/25 hover:text-foreground/50 transition-colors text-[9px] tracking-[0.3em] uppercase"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div>
                <div className="bg-card border border-[rgba(255,255,255,0.06)] p-8 sticky top-28">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c]/70 mb-8">Récapitulatif</p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm text-foreground/50">
                      <span>Sous-total</span>
                      <span data-testid="text-subtotal">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/50">
                      <span>Livraison</span>
                      <span>Offerte</span>
                    </div>
                    <div className="h-[1px] bg-[rgba(255,255,255,0.06)]" />
                    <div className="flex justify-between">
                      <span className="font-serif text-lg">Total</span>
                      <span data-testid="text-total" className="text-[#c9a84c] text-lg tracking-wider">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <button
                    data-testid="button-checkout"
                    className="w-full bg-[#c9a84c] text-black text-xs tracking-[0.3em] uppercase py-4 hover:bg-[#e6c875] transition-colors flex items-center justify-center gap-3 font-medium"
                  >
                    Commander
                    <FiArrowRight />
                  </button>

                  <p className="text-center text-[9px] text-foreground/25 tracking-widest mt-5">
                    Paiement sécurisé · Livraison offerte
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
