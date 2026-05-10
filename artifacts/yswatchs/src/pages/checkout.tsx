import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheck, FiPackage } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, getDiscountedPrice, MOROCCAN_CITIES } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

type Step = "informations" | "livraison" | "paiement" | "confirmation";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>("informations");
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    adresse: '', ville: '', codePostal: '',
    methodeLivraison: 'standard',
    methodePaiement: 'carte',
    carteNumero: '', carteExpiry: '', carteCvv: '', carteNom: '',
  });

  const steps: Step[] = ["informations", "livraison", "paiement", "confirmation"];
  const stepLabels: Record<Step, string> = {
    informations: "Informations",
    livraison: "Livraison",
    paiement: "Paiement",
    confirmation: "Confirmation",
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    const idx = steps.indexOf(currentStep);
    if (idx < steps.length - 1) {
      if (currentStep === "paiement") {
        clearCart();
      }
      setCurrentStep(steps[idx + 1]);
    }
  };
  const handleBack = () => {
    const idx = steps.indexOf(currentStep);
    if (idx > 0) setCurrentStep(steps[idx - 1]);
  };

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discount
      ? getDiscountedPrice(item.product.price, item.product.discount)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const livraison = form.methodeLivraison === 'express' ? 150 : 0;
  const total = subtotal + livraison;

  if (items.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0C0A08' }}>
        <Navbar />
        <div className="text-center px-6">
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: 'rgba(245,240,232,0.25)', marginBottom: '1.5rem' }}>
            Votre panier est vide
          </p>
          <Link href="/montres/homme">
            <button className="btn-victorian">Explorer la collection</button>
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle = {
    background: '#0E0C08',
    border: '1px solid rgba(201,168,76,0.22)',
    color: '#F5F0E8',
    fontFamily: "'Jost', sans-serif",
    fontSize: '0.875rem',
    fontWeight: 300,
    padding: '0.75rem 1rem',
    width: '100%',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.6rem',
    letterSpacing: '0.4em',
    textTransform: 'uppercase' as const,
    color: 'rgba(201,168,76,0.6)',
    marginBottom: '0.5rem',
    fontFamily: "'Jost', sans-serif",
  };

  return (
    <div style={{ background: '#0C0A08', color: '#F5F0E8', minHeight: '100vh' }}>
      <Navbar />

      <div className="pt-24 sm:pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <Link href="/panier" className="inline-flex items-center gap-2 mb-10 hover:text-[#C9A84C] transition-colors"
            style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif", color: 'rgba(245,240,232,0.3)' }}>
            <FiArrowLeft /> Retour au panier
          </Link>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-0 mb-12 overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 flex items-center justify-center transition-all duration-400"
                    style={{
                      border: `1px solid ${step === currentStep ? '#C9A84C' : steps.indexOf(currentStep) > i ? 'rgba(201,168,76,0.4)' : 'rgba(245,240,232,0.12)'}`,
                      background: step === currentStep ? 'rgba(201,168,76,0.12)' : 'transparent',
                      color: step === currentStep ? '#C9A84C' : steps.indexOf(currentStep) > i ? 'rgba(201,168,76,0.5)' : 'rgba(245,240,232,0.2)',
                      fontSize: '0.7rem',
                    }}>
                    {steps.indexOf(currentStep) > i ? <FiCheck /> : (i + 1)}
                  </div>
                  <span style={{
                    fontSize: '0.5rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    marginTop: '0.4rem',
                    color: step === currentStep ? '#C9A84C' : 'rgba(245,240,232,0.25)',
                    fontFamily: "'Jost', sans-serif",
                    display: 'block',
                  }}>
                    {stepLabels[step]}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: '40px', height: '1px', background: steps.indexOf(currentStep) > i ? 'rgba(201,168,76,0.4)' : 'rgba(245,240,232,0.1)', margin: '0 8px 20px' }} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ─── Form ─── */}
            <div className="lg:col-span-2">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>

                {currentStep === "informations" && (
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Informations personnelles
                    </h2>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.35)', letterSpacing: '0.1em', marginBottom: '2rem', fontFamily: "'Jost', sans-serif" }}>
                      🇲🇦 Livraison au Maroc uniquement
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {[
                        { name: 'prenom', label: 'Prénom' },
                        { name: 'nom', label: 'Nom' },
                      ].map(f => (
                        <div key={f.name}>
                          <label style={labelStyle}>{f.label}</label>
                          <input name={f.name} value={form[f.name as keyof typeof form]} onChange={handleInput} style={inputStyle} className="input-victorian" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {[
                        { name: 'email', label: 'Email', type: 'email' },
                        { name: 'telephone', label: 'Téléphone (+212)', type: 'tel' },
                      ].map(f => (
                        <div key={f.name}>
                          <label style={labelStyle}>{f.label}</label>
                          <input name={f.name} type={f.type} value={form[f.name as keyof typeof form]} onChange={handleInput} style={inputStyle} className="input-victorian" />
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <label style={labelStyle}>Adresse</label>
                      <input name="adresse" value={form.adresse} onChange={handleInput} style={inputStyle} className="input-victorian" placeholder="Rue, numéro, appartement..." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Ville</label>
                        <select name="ville" value={form.ville} onChange={handleInput} style={{ ...inputStyle, cursor: 'pointer' }} className="input-victorian">
                          <option value="">Sélectionner une ville</option>
                          {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Code postal</label>
                        <input name="codePostal" value={form.codePostal} onChange={handleInput} style={inputStyle} className="input-victorian" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "livraison" && (
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '2rem' }}>
                      Mode de livraison
                    </h2>
                    {[
                      { id: 'standard', label: 'Standard', desc: '3–5 jours ouvrables', price: 'Offerte' },
                      { id: 'express', label: 'Express', desc: '1–2 jours ouvrables', price: '150 DH' },
                    ].map(opt => (
                      <label key={opt.id} className="flex items-center gap-4 p-5 mb-3 cursor-pointer transition-all"
                        style={{
                          border: `1px solid ${form.methodeLivraison === opt.id ? '#C9A84C' : 'rgba(201,168,76,0.18)'}`,
                          background: form.methodeLivraison === opt.id ? 'rgba(201,168,76,0.06)' : '#0E0C08',
                        }}>
                        <input type="radio" name="methodeLivraison" value={opt.id} checked={form.methodeLivraison === opt.id} onChange={handleInput} style={{ accentColor: '#C9A84C' }} />
                        <div className="flex-1">
                          <p style={{ fontSize: '0.9rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, letterSpacing: '0.03em', color: form.methodeLivraison === opt.id ? '#C9A84C' : '#F5F0E8' }}>
                            {opt.label}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.35)', letterSpacing: '0.1em', fontFamily: "'Jost', sans-serif" }}>
                            {opt.desc}
                          </p>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#C9A84C', letterSpacing: '0.05em' }}>{opt.price}</span>
                      </label>
                    ))}
                    <div className="mt-4 p-4" style={{ background: '#0A0806', border: '1px solid rgba(201,168,76,0.12)' }}>
                      <div className="flex items-start gap-2">
                        <FiPackage style={{ color: 'rgba(201,168,76,0.5)', marginTop: '2px', flexShrink: 0 }} />
                        <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.1em', lineHeight: 1.7, fontFamily: "'Jost', sans-serif" }}>
                          Livraison sécurisée dans un écrin signature YsWatchs, avec certificat d'authenticité et carte de garantie.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "paiement" && (
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '2rem' }}>
                      Paiement sécurisé
                    </h2>
                    <div className="mb-6">
                      <label style={labelStyle}>Numéro de carte</label>
                      <input name="carteNumero" value={form.carteNumero} onChange={handleInput} placeholder="0000 0000 0000 0000" maxLength={19} style={inputStyle} className="input-victorian" />
                    </div>
                    <div className="mb-6">
                      <label style={labelStyle}>Nom sur la carte</label>
                      <input name="carteNom" value={form.carteNom} onChange={handleInput} style={inputStyle} className="input-victorian" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Expiration</label>
                        <input name="carteExpiry" value={form.carteExpiry} onChange={handleInput} placeholder="MM/AA" maxLength={5} style={inputStyle} className="input-victorian" />
                      </div>
                      <div>
                        <label style={labelStyle}>CVV</label>
                        <input name="carteCvv" value={form.carteCvv} onChange={handleInput} placeholder="• • •" maxLength={4} style={inputStyle} className="input-victorian" />
                      </div>
                    </div>
                    <div className="mt-6 p-4 flex items-center gap-3" style={{ background: '#0A0806', border: '1px solid rgba(201,168,76,0.12)' }}>
                      <span style={{ color: 'rgba(201,168,76,0.6)', fontSize: '1rem' }}>🔒</span>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.35)', letterSpacing: '0.1em', fontFamily: "'Jost', sans-serif", lineHeight: 1.6 }}>
                        Paiement sécurisé par chiffrement SSL 256-bit. Vos données bancaires ne sont jamais stockées.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === "confirmation" && (
                  <div className="text-center py-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                      className="w-20 h-20 mx-auto mb-8 flex items-center justify-center"
                      style={{ border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.08)' }}>
                      <FiCheck style={{ fontSize: '2rem', color: '#C9A84C' }} />
                    </motion.div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '1rem' }}>
                      Commande <em className="gold-text" style={{ fontStyle: 'italic' }}>Confirmée</em>
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.12em', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '420px', margin: '0 auto 2.5rem', fontFamily: "'Jost', sans-serif" }}>
                      Merci pour votre confiance, {form.prenom || 'cher client'}.<br/>
                      Un email de confirmation a été envoyé à {form.email || 'votre adresse'}.<br/>
                      Votre montre sera livrée dans un écrin signature YsWatchs.
                    </p>
                    <div className="ornament-divider max-w-xs mx-auto mb-8">◆</div>
                    <Link href="/">
                      <button className="btn-victorian-filled">Retour à la boutique</button>
                    </Link>
                  </div>
                )}

                {currentStep !== "confirmation" && (
                  <div className="flex items-center gap-4 mt-8">
                    {currentStep !== "informations" && (
                      <button onClick={handleBack} className="btn-victorian flex items-center gap-2"
                        style={{ padding: '0.8rem 1.5rem' }}>
                        <FiArrowLeft /> Retour
                      </button>
                    )}
                    <button onClick={handleNext} className="btn-victorian-filled flex-1 sm:flex-none sm:min-w-[200px]">
                      {currentStep === "paiement" ? 'Confirmer la commande' : 'Continuer'}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* ─── Order summary ─── */}
            {currentStep !== "confirmation" && (
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6"
                  style={{ background: '#0E0C08', border: '1px solid rgba(201,168,76,0.18)', position: 'relative' }}>
                  {[['top-2 left-2', '1px 0 0 1px'], ['top-2 right-2', '1px 1px 0 0'], ['bottom-2 left-2', '0 0 1px 1px'], ['bottom-2 right-2', '0 1px 1px 0']].map(([pos, bw], i) => (
                    <div key={i} className={`absolute ${pos}`} style={{ width: '10px', height: '10px', borderWidth: bw, borderStyle: 'solid', borderColor: 'rgba(201,168,76,0.3)' }} />
                  ))}
                  <p className="label-victorian mb-5" style={{ fontSize: '0.6rem' }}>Récapitulatif</p>
                  <div className="space-y-4 mb-5">
                    {items.map(item => {
                      const price = item.product.discount
                        ? getDiscountedPrice(item.product.price, item.product.discount)
                        : item.product.price;
                      return (
                        <div key={item.product.id} className="flex gap-3 items-center">
                          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center p-1" style={{ background: '#0A0806', border: '1px solid rgba(201,168,76,0.15)' }}>
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', fontWeight: 400 }}>
                              {item.product.name}
                            </p>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.3)', fontFamily: "'Jost', sans-serif", letterSpacing: '0.1em' }}>
                              Qté : {item.quantity}
                            </p>
                          </div>
                          <p className="gold-text flex-shrink-0" style={{ fontSize: '0.85rem' }}>
                            {formatPrice(price * item.quantity)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="vr-gold mb-4" />
                  <div className="space-y-2 mb-4">
                    {[
                      { label: 'Sous-total', value: formatPrice(subtotal) },
                      { label: 'Livraison', value: livraison === 0 ? 'Offerte' : formatPrice(livraison) },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between">
                        <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', fontFamily: "'Jost', sans-serif", letterSpacing: '0.1em' }}>{row.label}</span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.6)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="vr-gold mb-4" />
                  <div className="flex justify-between items-center">
                    <span className="label-victorian" style={{ fontSize: '0.6rem' }}>Total</span>
                    <span className="gold-text" style={{ fontSize: '1.2rem', letterSpacing: '0.05em' }}>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
