import { useMemo } from "react";

interface Sparkle {
  id: number;
  char: string;
  top: string;
  left: string;
  size: string;
  opacity: number;
  delay: string;
  duration: string;
  color: string;
}

const CHARS = ["✦", "✧", "★", "◆"];
const COLORS = ["#00beff", "#4dd9ff", "#80e0ff", "#b3efff", "#e0f8ff", "#f4a7b9"];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function SparkleField() {
  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      top: `${rand(0, 100)}%`,
      left: `${rand(0, 100)}%`,
      size: `${rand(7, 20)}px`,
      opacity: rand(0.06, 0.32),
      delay: `${rand(0, 4)}s`,
      duration: `${rand(2, 5)}s`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute animate-sparkle select-none"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            opacity: s.opacity,
            animationDelay: s.delay,
            animationDuration: s.duration,
            color: s.color,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
