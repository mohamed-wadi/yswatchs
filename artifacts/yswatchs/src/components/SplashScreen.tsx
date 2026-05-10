import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logoPath from "@assets/LOGO_YS_1778428531681.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [shimmer, setShimmer] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShimmer(true), 1400);
    const t2 = setTimeout(() => setExiting(true), 2600);
    const t3 = setTimeout(() => {
      sessionStorage.setItem("ys_intro_seen", "1");
      onComplete();
    }, 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: shimmer ? 1 : 0 }}
        transition={{ duration: 1.0 }}
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(201,168,76,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.78 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={logoPath}
          alt="YsWatchs"
          className="w-40 h-40 md:w-52 md:h-52 object-contain"
          animate={{
            filter: shimmer
              ? [
                  'invert(1) brightness(0.85) drop-shadow(0 0 20px rgba(201,168,76,0.5))',
                  'invert(1) brightness(1.1) drop-shadow(0 0 40px rgba(201,168,76,1))',
                  'invert(1) brightness(0.9) drop-shadow(0 0 25px rgba(201,168,76,0.6))',
                ]
              : 'invert(1) brightness(0.85) drop-shadow(0 0 16px rgba(201,168,76,0.4))',
          }}
          transition={{ duration: shimmer ? 1.2 : 0.5 }}
        />

        <motion.div
          className="mt-8 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: shimmer ? 100 : 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        <motion.p
          className="mt-5 text-[10px] tracking-[0.6em] uppercase text-[#c9a84c]/70 font-light"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: shimmer ? 1 : 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          L'Art du Temps
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
