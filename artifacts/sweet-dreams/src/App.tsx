import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider, useStore } from "./store/useStore";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LangProvider } from "./context/LangContext";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import ProductsPage from "./pages/ProductsPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

/* Watches store's defaultTheme and syncs to ThemeContext whenever admin changes it */
function ThemeSyncer() {
  const { state } = useStore();
  const { setTheme } = useTheme();
  const dt = state.settings.defaultTheme;
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (dt === "navy" || dt === "chocolate") setTheme(dt);
  }, [dt]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function Router() {
  return (
    <>
      <ThemeSyncer />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/gallery"  element={<GalleryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/control"  element={<AdminPage />} />
        <Route path="*"         element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <LangProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Router />
          </BrowserRouter>
        </LangProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
