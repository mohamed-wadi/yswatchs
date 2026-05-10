import { useState, useEffect, useCallback } from "react";

const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

function getHandAngles(date: Date) {
  const s = date.getSeconds() + date.getMilliseconds() / 1000;
  const m = date.getMinutes() + s / 60;
  const h = (date.getHours() % 12) + m / 60;
  return {
    second: s * 6,
    minute: m * 6,
    hour: h * 30,
  };
}

export default function VictorianClock({ size = 220 }: { size?: number }) {
  const [angles, setAngles] = useState(() => getHandAngles(new Date()));

  const tick = useCallback(() => {
    setAngles(getHandAngles(new Date()));
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const hand = (angleDeg: number, length: number, width: number, color: string, tail = 0) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    const tailRad = (angleDeg - 90 + 180) * (Math.PI / 180);
    return {
      x2: cx + length * Math.cos(rad),
      y2: cy + length * Math.sin(rad),
      x1: cx + tail * Math.cos(tailRad),
      y1: cy + tail * Math.sin(tailRad),
      width,
      color,
    };
  };

  const hourH = hand(angles.hour, r * 0.52, 2.8, "#E8D080");
  const minH = hand(angles.minute, r * 0.72, 2, "#E2C87A", r * 0.12);
  const secH = hand(angles.second, r * 0.78, 1, "#C9A84C", r * 0.18);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ filter: "drop-shadow(0 0 24px rgba(201,168,76,0.25)) drop-shadow(0 8px 32px rgba(0,0,0,0.5))" }}
    >
      {/* Outer decorative ring */}
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="6" />

      {/* Gold bezel gradient */}
      <defs>
        <radialGradient id="bezel" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#E8D080" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#C9A84C" stopOpacity="1" />
          <stop offset="100%" stopColor="#7A5C18" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="face" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1E1810" />
          <stop offset="60%" stopColor="#120E08" />
          <stop offset="100%" stopColor="#0A0806" />
        </radialGradient>
        <radialGradient id="face-light" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#F0E6CC" />
          <stop offset="60%" stopColor="#E8D8B4" />
          <stop offset="100%" stopColor="#D8C898" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Bezel */}
      <circle cx={cx} cy={cy} r={r} fill="url(#bezel)" />

      {/* Tick marks on bezel */}
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 - 90) * (Math.PI / 180);
        const isMajor = i % 5 === 0;
        const r1 = r - (isMajor ? 10 : 5);
        const r2 = r - 2;
        return (
          <line key={i}
            x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
            x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
            stroke={isMajor ? "rgba(10,8,6,0.8)" : "rgba(10,8,6,0.4)"}
            strokeWidth={isMajor ? 1.5 : 0.8}
          />
        );
      })}

      {/* Dial face */}
      <circle cx={cx} cy={cy} r={r - 12} fill="url(#face)" className="clock-face" />

      {/* Inner decorative ring */}
      <circle cx={cx} cy={cy} r={r - 13} fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 22} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="0.7" />

      {/* Subtle radial glow on face */}
      <circle cx={cx * 0.85} cy={cy * 0.8} r={r * 0.3} fill="rgba(201,168,76,0.04)" />

      {/* Roman numerals */}
      {ROMAN.map((numeral, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const nr = r - 30;
        const x = cx + nr * Math.cos(angle);
        const y = cy + nr * Math.sin(angle);
        const isXII = i === 0;
        return (
          <text key={i}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: isXII ? `${size * 0.068}px` : `${size * 0.058}px`,
              fill: "rgba(201,168,76,0.85)",
              fontWeight: isXII ? "500" : "400",
              letterSpacing: "-0.02em",
            }}
          >
            {numeral}
          </text>
        );
      })}

      {/* Minute dots between numerals */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null;
        const a = (i * 6 - 90) * (Math.PI / 180);
        const dr = r - 30;
        return (
          <circle key={`dot-${i}`}
            cx={cx + dr * Math.cos(a)} cy={cy + dr * Math.sin(a)}
            r={0.8} fill="rgba(201,168,76,0.3)" />
        );
      })}

      {/* "YsWatchs" inscription */}
      <text x={cx} y={cy - r * 0.28}
        textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: "'Jost', sans-serif", fontSize: `${size * 0.044}px`, fill: "rgba(201,168,76,0.55)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
        YsWatchs
      </text>

      {/* Sub-seconds indicator circle (decorative) */}
      <circle cx={cx} cy={cy + r * 0.38} r={r * 0.1} fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8" />
      <circle cx={cx} cy={cy + r * 0.38} r={r * 0.07} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="0.6" />
      {/* Sub-second hand */}
      {(() => {
        const a = (angles.second * 6 - 90) * (Math.PI / 180);
        return (
          <line
            x1={cx} y1={cy + r * 0.38}
            x2={cx + r * 0.085 * Math.cos(a)}
            y2={cy + r * 0.38 + r * 0.085 * Math.sin(a)}
            stroke="#C9A84C" strokeWidth="0.8" strokeLinecap="round"
          />
        );
      })()}

      {/* Hour hand */}
      <line x1={hourH.x1} y1={hourH.y1} x2={hourH.x2} y2={hourH.y2}
        stroke={hourH.color} strokeWidth={hourH.width} strokeLinecap="round"
        filter="url(#glow)" />

      {/* Minute hand */}
      <line x1={minH.x1} y1={minH.y1} x2={minH.x2} y2={minH.y2}
        stroke={minH.color} strokeWidth={minH.width} strokeLinecap="round"
        filter="url(#glow)" />

      {/* Second hand */}
      <line x1={secH.x1} y1={secH.y1} x2={secH.x2} y2={secH.y2}
        stroke={secH.color} strokeWidth={secH.width} strokeLinecap="round"
        style={{ transition: "none" }} />

      {/* Center cap */}
      <circle cx={cx} cy={cy} r={4} fill="#C9A84C" />
      <circle cx={cx} cy={cy} r={2} fill="#E8D080" />

      {/* Crown at top */}
      <rect x={cx - 3} y={4} width={6} height={8} rx={2} fill="url(#bezel)" />
      <rect x={cx - 5} y={7} width={10} height={4} rx={1.5} fill="url(#bezel)" />

      {/* Outer rim glint */}
      <path d={`M ${cx - r * 0.5} ${cy - r * 0.85} Q ${cx} ${cy - r * 1.05} ${cx + r * 0.5} ${cy - r * 0.85}`}
        stroke="rgba(255,245,200,0.18)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
