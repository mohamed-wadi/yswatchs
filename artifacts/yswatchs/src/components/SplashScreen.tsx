import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logoPath from "@assets/LOGO_YS_1778428531681.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setExiting(true), 2800);
    const t4 = setTimeout(() => {
      sessionStorage.setItem("ys_intro_seen", "1");
      onComplete();
    }, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      style={{ background: '#08060400' }}
    >
      {/* Deep dark bg */}
      <div className="absolute inset-0" style={{ background: '#08060A' }} />

      {/* Ambient gold glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Decorative horizontal lines */}
      <motion.div
        className="absolute"
        style={{ width: '300px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)',
          marginBottom: '200px'
        }} />
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)',
        }} />
      </motion.div>

      {/* Logo */}
      <div className="relative flex flex-col items-center z-10">
        <motion.img
          src={logoPath}
          alt="YsWatchs"
          className="object-contain"
          style={{
            width: '140px',
            height: '140px',
            filter: 'invert(1) brightness(0.9)',
          }}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: phase >= 1
              ? [
                  'invert(1) brightness(0.9) drop-shadow(0 0 15px rgba(201,168,76,0.4))',
                  'invert(1) brightness(1.05) drop-shadow(0 0 35px rgba(201,168,76,0.85))',
                  'invert(1) brightness(0.92) drop-shadow(0 0 20px rgba(201,168,76,0.55))',
                ]
              : 'invert(1) brightness(0.9)',
          }}
          transition={{ duration: phase >= 1 ? 1.4 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Gold underline */}
        <motion.div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
            marginTop: '1.5rem',
          }}
          initial={{ width: 0 }}
          animate={{ width: phase >= 1 ? 120 : 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        />

        {/* Tagline */}
        <motion.p
          style={{
            marginTop: '1.25rem',
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.55rem',
            letterSpacing: '0.6em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.65)',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Maison d'Horlogerie · Maroc
        </motion.p>
      </div>

      {/* Corner ornaments */}
      {[['top-8 left-8', ''], ['top-8 right-8', 'rotate-90'], ['bottom-8 left-8', '-rotate-90'], ['bottom-8 right-8', 'rotate-180']].map(([pos, rot], i) => (
        <motion.div
          key={i}
          className={`absolute ${pos}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 0.4 : 0 }}
          transition={{ delay: 0.1 * i }}
        >
          <div className={`w-8 h-8 ${rot}`} style={{
            borderTop: '1px solid rgba(201,168,76,0.5)',
            borderLeft: '1px solid rgba(201,168,76,0.5)',
          }} />
        </motion.div>
      ))}
    </motion.div>
  );
}
