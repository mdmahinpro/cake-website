import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type SiteTheme = "navy" | "chocolate";

interface ThemeCtx {
  siteTheme: SiteTheme;
  toggleTheme: () => void;
  setTheme: (t: SiteTheme) => void;
}

const ThemeContext = createContext<ThemeCtx>({ siteTheme: "navy", toggleTheme: () => {}, setTheme: () => {} });

function readInitialTheme(): SiteTheme {
  try {
    const userPref = localStorage.getItem("site-theme") as SiteTheme;
    if (userPref === "navy" || userPref === "chocolate") return userPref;
    const stored = JSON.parse(localStorage.getItem("sweet_dreams_store") || "{}");
    const dt = stored?.settings?.defaultTheme;
    return dt === "navy" || dt === "chocolate" ? dt : "navy";
  } catch { return "navy"; }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [siteTheme, setSiteTheme] = useState<SiteTheme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", siteTheme);
    try { localStorage.setItem("site-theme", siteTheme); } catch {}
  }, [siteTheme]);

  function toggleTheme() { setSiteTheme((t) => (t === "navy" ? "chocolate" : "navy")); }
  function setTheme(t: SiteTheme) { setSiteTheme(t); }

  return (
    <ThemeContext.Provider value={{ siteTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() { return useContext(ThemeContext); }

export const THEME_TOKENS = {
  navy: {
    accentRgb:  "0,190,255",
    accentHex:  "#00beff",
    bgDeep:     "#010d1e",
    bgMid:      "#051e36",
    radialGlow: "rgba(0,190,255,0.12)",
    gridLine:   "rgba(0,190,255,0.9)",
    ctaBg:      "linear-gradient(135deg,#010d1e 0%,#051e36 40%,#010d1e 100%)",
    ctaGlow:    "radial-gradient(ellipse at center,rgba(0,190,255,0.08) 0%,transparent 70%)",
    sparkles:   ["#00beff","#4dd9ff","#80e0ff","#b3efff","#e0f8ff","#f4a7b9"],
  },
  chocolate: {
    accentRgb:  "240,217,168",
    accentHex:  "#f0d9a8",
    bgDeep:     "#120602",
    bgMid:      "#2a1006",
    radialGlow: "rgba(240,217,168,0.1)",
    gridLine:   "rgba(240,217,168,0.35)",
    ctaBg:      "linear-gradient(135deg,#120602 0%,#2a1006 40%,#120602 100%)",
    ctaGlow:    "radial-gradient(ellipse at center,rgba(240,217,168,0.06) 0%,transparent 70%)",
    sparkles:   ["#f0d9a8","#f5e6c0","#faf2e4","#d8bc88","#f4a7b9","#ffd93d"],
  },
} as const satisfies Record<SiteTheme, object>;
