import { createContext, useContext, useState, type ReactNode } from "react";

export type SiteLang = "en" | "bn";

interface LangCtx { lang: SiteLang; toggleLang: () => void; }

const LangContext = createContext<LangCtx>({ lang: "en", toggleLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<SiteLang>(() => {
    try { return (localStorage.getItem("site-lang") as SiteLang) || "en"; }
    catch { return "en"; }
  });

  function toggleLang() {
    setLang((l) => {
      const next: SiteLang = l === "en" ? "bn" : "en";
      try { localStorage.setItem("site-lang", next); } catch {}
      return next;
    });
  }

  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>;
}

export function useLang() { return useContext(LangContext); }
