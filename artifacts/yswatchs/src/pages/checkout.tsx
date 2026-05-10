import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheck, FiPackage } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, getDiscountedPrice, MOROCCAN_CITIES } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

interface FormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  complement: string;
  codePostal: string;
  ville: string;
}

const initialForm: FormData = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  adresse: "",
  complement: "",
  codePostal: "",
  ville: "",
};

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.prenom.trim()) newErrors.prenom = "Requis";
    if (!form.nom.trim()) newErrors.nom = "Requis";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) newErrors.email = "Email invalide";
    if (!form.telephone.trim()) newErrors.telephone = "Requis";
    if (!form.adresse.trim()) newErrors.adresse = "Requis";
    if (!form.codePostal.trim()) newErrors.codePostal = "Requis";
    if (!form.ville.trim()) newErrors.ville = "Veuillez choisir une ville";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    clearCart();
  };

  const effectiveTotalPrice = items.reduce((sum, item) => {
    const price = item.product.discount
      ? getDiscountedPrice(item.product.price, item.product.discount)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="font-serif text-3xl text-foreground/30 mb-6">Votre panier est vide</p>
          <Link href="/collections" className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase border-b border-[#c9a84c]/40 pb-1">
            Voir les collections
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-8">
            <FiCheck className="text-3xl text-[#c9a84c]" />
          </div>
          <div className="w-12 h-[1px] bg-[#c9a84c]/40 mx-auto mb-8" />
          <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c] mb-5 font-medium">Commande confirmée</p>
          <h1 className="font-serif font-light text-4xl sm:text-5xl mb-6 text-foreground">Merci, {form.prenom} !</h1>
          <p className="text-foreground/55 text-sm leading-relaxed mb-4">
            Votre commande a été enregistrée avec succès. Vous recevrez une confirmation à <strong className="text-foreground/70">{form.email}</strong>.
          </p>
          <p className="text-foreground/40 text-xs leading-relaxed mb-10">
            Livraison prévue sous 2 à 4 jours ouvrés à :<br />
            <span className="text-foreground/60">{form.adresse}, {form.codePostal} {form.ville}, Maroc</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background text-[10px] tracking-[0.3em] uppercase px-8 py-4 hover:bg-[#c9a84c] hover:text-white transition-all duration-400"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground/55 text-[10px] tracking-[0.3em] uppercase px-8 py-4 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all duration-400"
            >
              Continuer les achats
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = (field: keyof FormData) =>
    `w-full bg-white border ${errors[field] ? 'border-red-400' : 'border-border'} px-4 py-3 text-sm text-foreground placeholder-foreground/35 focus:outline-none focus:border-[#c9a84c]/60 transition-colors`;

  const labelClass = "block text-[8px] tracking-[0.35em] uppercase text-foreground/50 mb-2 font-medium";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <Link
              href="/panier"
              className="inline-flex items-center gap-2 text-foreground/40 hover:text-[#c9a84c] transition-colors text-[10px] tracking-[0.3em] uppercase mb-8"
            >
              <FiArrowLeft />
              Retour au panier
            </Link>
            <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c] mb-3 font-medium">Finaliser</p>
            <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-foreground">Votre Commande</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-14">
            {/* ─── Form ─── */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
              {/* Identity */}
              <div>
                <h2 className="font-serif text-2xl mb-6 pb-3 border-b border-border text-foreground">Vos coordonnées</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Prénom *</label>
                    <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Mohammed" className={inputClass('prenom')} />
                    {errors.prenom && <p className="text-red-500 text-[9px] mt-1">{errors.prenom}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Nom *</label>
                    <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Alaoui" className={inputClass('nom')} />
                    {errors.nom && <p className="text-red-500 text-[9px] mt-1">{errors.nom}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="vous@exemple.ma" className={inputClass('email')} />
                    {errors.email && <p className="text-red-500 text-[9px] mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Téléphone *</label>
                    <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+212 6 00 00 00 00" className={inputClass('telephone')} />
                    {errors.telephone && <p className="text-red-500 text-[9px] mt-1">{errors.telephone}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h2 className="font-serif text-2xl mb-6 pb-3 border-b border-border text-foreground">Adresse de livraison</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Adresse *</label>
                    <input type="text" name="adresse" value={form.adresse} onChange={handleChange} placeholder="123 Boulevard Mohammed V" className={inputClass('adresse')} />
                    {errors.adresse && <p className="text-red-500 text-[9px] mt-1">{errors.adresse}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Complément d'adresse</label>
                    <input type="text" name="complement" value={form.complement} onChange={handleChange} placeholder="Appartement, étage, quartier..." className={inputClass('complement')} />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Code postal *</label>
                      <input type="text" name="codePostal" value={form.codePostal} onChange={handleChange} placeholder="20000" className={inputClass('codePostal')} />
                      {errors.codePostal && <p className="text-red-500 text-[9px] mt-1">{errors.codePostal}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Ville *</label>
                      <select
                        name="ville"
                        value={form.ville}
                        onChange={handleChange}
                        className={`w-full bg-white border ${errors.ville ? 'border-red-400' : 'border-border'} px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#c9a84c]/60 transition-colors`}
                      >
                        <option value="">Choisir une ville</option>
                        {MOROCCAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.ville && <p className="text-red-500 text-[9px] mt-1">{errors.ville}</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/35 bg-[#F8F5EF] border border-border px-4 py-3">
                      🇲🇦 Livraison au Maroc uniquement
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-foreground text-background text-[10px] tracking-[0.35em] uppercase py-5 hover:bg-[#c9a84c] hover:text-white transition-all duration-400 flex items-center justify-center gap-3 font-medium"
                >
                  <FiPackage />
                  Confirmer la commande — {formatPrice(effectiveTotalPrice)}
                </button>
                <p className="text-center text-[8px] text-foreground/30 tracking-widest mt-4">
                  Commande sans prépaiement · Notre équipe vous contactera pour finaliser
                </p>
              </div>
            </form>

            {/* ─── Order summary ─── */}
            <div className="lg:col-span-2">
              <div className="bg-[#F8F5EF] border border-border p-6 sm:p-8 sticky top-28">
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c] mb-7 font-medium">
                  Récapitulatif · {totalItems} article{totalItems > 1 ? 's' : ''}
                </p>

                <div className="space-y-5 mb-7">
                  {items.map(item => {
                    const effPrice = item.product.discount
                      ? getDiscountedPrice(item.product.price, item.product.discount)
                      : item.product.price;
                    return (
                      <div key={item.product.id} className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white border border-border flex-shrink-0 flex items-center justify-center p-1.5">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-sm truncate text-foreground">{item.product.name}</p>
                          <p className="text-[9px] text-foreground/45 tracking-wider">Qté : {item.quantity}</p>
                          {item.product.discount && (
                            <p className="text-[8px] text-[#c9a84c] tracking-wider">-{item.product.discount}% appliqué</p>
                          )}
                        </div>
                        <p className="text-sm text-foreground/70 flex-shrink-0">
                          {formatPrice(effPrice * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-5 space-y-3">
                  <div className="flex justify-between text-sm text-foreground/50">
                    <span>Sous-total</span>
                    <span>{formatPrice(effectiveTotalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground/50">
                    <span>Livraison</span>
                    <span className="text-green-600">Offerte</span>
                  </div>
                  <div className="h-[1px] bg-border" />
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg text-foreground">Total</span>
                    <span className="text-[#c9a84c] text-xl tracking-wider font-medium">
                      {formatPrice(effectiveTotalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
