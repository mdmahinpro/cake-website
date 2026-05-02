import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./store/useStore";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/control" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Router />
        </BrowserRouter>
      </StoreProvider>
    </ThemeProvider>
  );
}
