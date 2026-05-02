import { useMemo } from "react";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";

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

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function SparkleField() {
  const { siteTheme } = useTheme();
  const colors = THEME_TOKENS[siteTheme].sparkles;

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
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [siteTheme]); // re-generate in correct palette on every theme switch

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
