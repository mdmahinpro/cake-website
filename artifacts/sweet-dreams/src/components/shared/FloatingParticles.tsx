import { useMemo } from "react";

interface Particle {
  id: number;
  top: string;
  left: string;
  size: string;
  color: string;
  delay: string;
}

const COLORS = [
  "rgba(212,165,116,0.10)",
  "rgba(244,167,185,0.10)",
  "rgba(255,255,255,0.05)",
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FloatingParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      top: `${rand(0, 100)}%`,
      left: `${rand(0, 100)}%`,
      size: `${rand(4, 16)}px`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: `${rand(0, 4)}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-slow"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
