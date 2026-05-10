import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { FiTrash2, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/70 mb-3">Votre sélection</p>
              <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl">
                Panier{" "}
                {totalItems > 0 && (
                  <span className="text-foreground/25 text-2xl sm:text-3xl">({totalItems})</span>
                )}
              </h1>
            </div>
            <Link
              href="/"
              data-testid="link-continue-shopping"
              className="inline-flex items-center gap-2 text-foreground/35 hover:text-[#c9a84c] transition-colors text-[10px] tracking-[0.25em] uppercase"
            >
              <FiArrowLeft />
              Continuer les achats
            </Link>
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 sm:py-32"
            >
              <div className="w-16 h-[1px] bg-[#c9a84c]/30 mx-auto mb-10" />
              <p className="font-serif text-3xl text-foreground/25 mb-5">Votre panier est vide</p>
              <p className="text-foreground/30 text-xs tracking-widest mb-12">Découvrez nos collections exceptionnelles</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/montres/homme"
                  data-testid="link-empty-homme"
                  className="border border-foreground/20 text-foreground/60 text-[10px] tracking-[0.3em] uppercase px-8 py-4 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                >
                  Collection Homme
                </Link>
                <Link
                  href="/montres/femme"
                  data-testid="link-empty-femme"
                  className="border border-border text-foreground/40 text-[10px] tracking-[0.3em] uppercase px-8 py-4 hover:border-foreground/30 transition-colors"
                >
                  Collection Femme
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="border-t border-border">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, overflow: 'hidden' }}
                        data-testid={`cart-item-${item.product.id}`}
                        className="flex gap-4 sm:gap-6 py-6 sm:py-8 border-b border-border"
                      >
                        <Link href={`/produit/${item.product.id}`} className="flex-shrink-0">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F5F2EC] border border-border overflow-hidden flex items-center justify-center p-2">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-[8px] tracking-[0.35em] uppercase text-[#c9a84c]/60 mb-1">
                                {item.product.category === 'homme' ? 'Homme' : item.product.category === 'femme' ? 'Femme' : item.product.category}
                              </p>
                              <h3 className="font-serif text-lg sm:text-xl truncate">{item.product.name}</h3>
                            </div>
                            <button
                              data-testid={`button-remove-${item.product.id}`}
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-foreground/20 hover:text-red-500 transition-colors flex-shrink-0 mt-1"
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center border border-border bg-white">
                              <button
                                data-testid={`button-minus-${item.product.id}`}
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="px-3 py-2 text-foreground/35 hover:text-foreground transition-colors text-sm"
                              >
                                −
                              </button>
                              <span data-testid={`text-qty-${item.product.id}`} className="px-3 text-sm min-w-[1.5rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                data-testid={`button-plus-${item.product.id}`}
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="px-3 py-2 text-foreground/35 hover:text-foreground transition-colors text-sm"
                              >
                                +
                              </button>
                            </div>
                            <p data-testid={`text-subtotal-${item.product.id}`} className="text-[#c9a84c] text-sm tracking-wider font-medium">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="pt-5">
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
                <div className="bg-[#F5F2EC] border border-border p-6 sm:p-8 sticky top-28">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c]/70 mb-7">Récapitulatif</p>

                  <div className="space-y-4 mb-7">
                    <div className="flex justify-between text-sm text-foreground/45">
                      <span>Sous-total</span>
                      <span data-testid="text-subtotal">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/45">
                      <span>Livraison</span>
                      <span className="text-green-600">Offerte</span>
                    </div>
                    <div className="h-[1px] bg-border" />
                    <div className="flex justify-between">
                      <span className="font-serif text-lg">Total</span>
                      <span data-testid="text-total" className="text-[#c9a84c] text-lg tracking-wider font-medium">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <button
                    data-testid="button-checkout"
                    onClick={() => navigate('/commande')}
                    className="w-full bg-foreground text-background text-[10px] tracking-[0.3em] uppercase py-4 hover:bg-[#c9a84c] hover:text-white transition-all duration-400 flex items-center justify-center gap-3 font-medium"
                  >
                    Passer la commande
                    <FiArrowRight />
                  </button>

                  <p className="text-center text-[8px] text-foreground/25 tracking-widest mt-4">
                    Livraison offerte · Retour 14 jours
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
