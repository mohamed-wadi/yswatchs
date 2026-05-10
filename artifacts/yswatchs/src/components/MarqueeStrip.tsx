export default function MarqueeStrip() {
  const items = [
    "Maison YsWatchs",
    "✦",
    "L'Art du Temps",
    "✦",
    "Horlogerie de Prestige",
    "✦",
    "Mécanique d'Exception",
    "✦",
    "Savoir-Faire Artisanal",
    "✦",
    "Collection 2025",
    "✦",
    "Livraison au Maroc",
    "✦",
  ];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden py-3" style={{ background: '#0A0806' }}>
      <div className="marquee-track flex items-center whitespace-nowrap gap-0">
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontSize: item === '✦' ? '0.55rem' : '0.6rem',
            letterSpacing: item === '✦' ? '0' : '0.35em',
            textTransform: 'uppercase',
            color: item === '✦' ? 'rgba(201,168,76,0.5)' : 'rgba(245,240,232,0.25)',
            fontFamily: "'Jost', sans-serif",
            padding: item === '✦' ? '0 1.5rem' : '0 0.75rem',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
