export default function MarqueeStrip() {
  const text = "YsWatchs · Montres de Prestige · L'Art du Temps · Savoir-Faire Exceptionnel · Collection 2025 · ";
  const repeated = text.repeat(6);

  return (
    <div className="overflow-hidden border-y border-[#c9a84c]/20 py-3 bg-[#c9a84c]/5">
      <div className="marquee-track flex gap-0">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c]/70 font-light whitespace-nowrap">
          {repeated}
        </span>
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c]/70 font-light whitespace-nowrap" aria-hidden="true">
          {repeated}
        </span>
      </div>
    </div>
  );
}
