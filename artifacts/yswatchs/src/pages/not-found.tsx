import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ys-bg)', color: 'var(--ys-text)', transition: 'background 0.45s, color 0.45s' }}>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center relative" style={{ maxWidth: '480px' }}>
          {[['top-0 left-0', '1px 0 0 1px'], ['top-0 right-0', '1px 1px 0 0'], ['bottom-0 left-0', '0 0 1px 1px'], ['bottom-0 right-0', '0 1px 1px 0']].map(([pos, bw], i) => (
            <div key={i} className={`absolute ${pos}`} style={{ width: '16px', height: '16px', borderWidth: bw, borderStyle: 'solid', borderColor: 'var(--ys-border)' }} />
          ))}
          <p className="label-victorian mb-5" style={{ display: 'block', fontSize: '0.55rem' }}>
            ✦ &nbsp; Page introuvable &nbsp; ✦
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(5rem, 15vw, 10rem)',
            fontWeight: 300,
            letterSpacing: '0.08em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--ys-gold) 0%, var(--ys-gold-light, #E2C87A) 40%, var(--ys-gold) 70%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}>404</h1>
          <div className="ornament-divider mb-6">◆</div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.4rem',
            fontWeight: 300,
            letterSpacing: '0.03em',
            color: 'var(--ys-text)',
            marginBottom: '0.75rem',
          }}>Cette page est introuvable</p>
          <p style={{
            fontSize: '0.72rem',
            color: 'var(--ys-text-muted)',
            letterSpacing: '0.12em',
            lineHeight: 1.8,
            fontFamily: "'Jost', sans-serif",
            marginBottom: '2.5rem',
          }}>
            La pièce que vous cherchez a peut-être été déplacée ou n'existe plus.
          </p>
          <Link href="/">
            <button className="btn-victorian-filled">Retour à la boutique</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
