export default function MarqueeStrip() {
  const text = "YsWatchs · Montres de Prestige · L'Art du Temps · Depuis 2024 · Savoir-Faire Exceptionnel · ";
  const repeated = text.repeat(6);

  return (
    <div className="overflow-hidden border-y border-[rgba(201,168,76,0.15)] py-3 bg-black/40">
      <div className="marquee-track flex gap-0">
        <span className="text-[10px] tracking-[0.35em] uppercase text-[#c9a84c]/60 font-light whitespace-nowrap">
          {repeated}
        </span>
        <span className="text-[10px] tracking-[0.35em] uppercase text-[#c9a84c]/60 font-light whitespace-nowrap" aria-hidden="true">
          {repeated}
        </span>
      </div>
    </div>
  );
}
