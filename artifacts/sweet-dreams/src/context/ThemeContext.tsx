import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type SiteTheme = "navy" | "chocolate";

interface ThemeCtx {
  siteTheme: SiteTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ siteTheme: "navy", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [siteTheme, setSiteTheme] = useState<SiteTheme>(() => {
    try { return (localStorage.getItem("site-theme") as SiteTheme) || "navy"; }
    catch { return "navy"; }
  });

  /* Apply data-theme attribute whenever theme changes */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", siteTheme);
    try { localStorage.setItem("site-theme", siteTheme); } catch {}
  }, [siteTheme]);

  function toggleTheme() {
    setSiteTheme((t) => (t === "navy" ? "chocolate" : "navy"));
  }

  return (
    <ThemeContext.Provider value={{ siteTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/* Convenience token helper — avoids repeating magic strings in components */
export const THEME_TOKENS = {
  navy: {
    accentRgb:    "0,190,255",
    accentHex:    "#00beff",
    bgDeep:       "#010d1e",
    bgMid:        "#051e36",
    radialGlow:   "rgba(0,190,255,0.12)",
    gridLine:     "rgba(0,190,255,0.9)",
    ctaBg:        "linear-gradient(135deg,#010d1e 0%,#051e36 40%,#010d1e 100%)",
    ctaGlow:      "radial-gradient(ellipse at center,rgba(0,190,255,0.08) 0%,transparent 70%)",
    sparkles:     ["#00beff","#4dd9ff","#80e0ff","#b3efff","#e0f8ff","#f4a7b9"],
  },
  chocolate: {
    accentRgb:    "212,160,60",
    accentHex:    "#d4a03c",
    bgDeep:       "#120602",
    bgMid:        "#2a1006",
    radialGlow:   "rgba(212,160,60,0.12)",
    gridLine:     "rgba(212,160,60,0.55)",
    ctaBg:        "linear-gradient(135deg,#120602 0%,#2a1006 40%,#120602 100%)",
    ctaGlow:      "radial-gradient(ellipse at center,rgba(212,160,60,0.08) 0%,transparent 70%)",
    sparkles:     ["#d4a03c","#e8c060","#f0d080","#c87040","#f4a7b9","#ffd93d"],
  },
} as const satisfies Record<SiteTheme, object>;
