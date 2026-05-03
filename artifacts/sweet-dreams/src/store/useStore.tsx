import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from "react";
import { DEMO_GALLERY, DEMO_CAROUSEL, DEMO_PRODUCT_CATEGORIES, DEMO_PRODUCTS } from "../data/demoData";
import { isBackendConfigured, fetchShopData, saveShopData } from "../lib/api";

export interface CakeItem {
  id: string;
  caption: string;
  category: string;
  imageUrl: string;
  featured?: boolean;
  type?: string;
  review?: string;
  youtubeUrl?: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  gradient?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  caption: string;
  imageUrl: string;
  price?: string;
}

export interface Settings {
  shopName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  facebookPageUrl: string;
  orderChannel: "whatsapp" | "facebook";
  instagramUrl: string;
  youtubeChannelUrl: string;
  accentColor: string;
  defaultTheme: "navy" | "chocolate";
  showPrices: boolean;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface StoreState {
  settings: Settings;
  gallery: CakeItem[];
  carousel: CarouselSlide[];
  categories: ProductCategory[];
  products: Product[];
  isAuthenticated: boolean;
}

type Action =
  | { type: "SET_SETTINGS"; payload: Partial<Settings> }
  | { type: "SET_GALLERY"; payload: CakeItem[] }
  | { type: "ADD_GALLERY_ITEM"; payload: CakeItem }
  | { type: "UPDATE_GALLERY_ITEM"; payload: CakeItem }
  | { type: "DELETE_GALLERY_ITEM"; payload: string }
  | { type: "SET_CAROUSEL"; payload: CarouselSlide[] }
  | { type: "ADD_CAROUSEL_SLIDE"; payload: CarouselSlide }
  | { type: "UPDATE_CAROUSEL_SLIDE"; payload: CarouselSlide }
  | { type: "DELETE_CAROUSEL_SLIDE"; payload: string }
  | { type: "SET_CATEGORIES"; payload: ProductCategory[] }
  | { type: "ADD_CATEGORY"; payload: ProductCategory }
  | { type: "UPDATE_CATEGORY"; payload: ProductCategory }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "LOAD_STATE"; payload: StoreState };

const defaultSettings: Settings = {
  shopName: "Sweet Dreams Cakes",
  tagline: "Every cake tells a story of love",
  heroTitle: "Your Dream Cake Starts Here",
  heroSubtitle: "Handcrafted custom cakes for every occasion",
  whatsappNumber: "8801700000000",
  facebookPageUrl: "https://facebook.com/yourpage",
  orderChannel: "whatsapp",
  instagramUrl: "",
  youtubeChannelUrl: "",
  accentColor: "#d4a574",
  defaultTheme: "navy",
  showPrices: true,
};

const defaultState: StoreState = {
  settings: defaultSettings,
  gallery: [],
  carousel: [],
  categories: [],
  products: [],
  isAuthenticated: false,
};

const STORAGE_KEY = "sweet_dreams_store";
const DEMO_KEY = "cake-demo-loaded-v2";
const PRODUCTS_DEMO_KEY = "cake-products-loaded-v4";
const LOCAL_MODIFIED_KEY = "sd_last_modified";

function loadFromStorage(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const demoLoaded = localStorage.getItem(DEMO_KEY);
    const productsLoaded = localStorage.getItem(PRODUCTS_DEMO_KEY);

    const base: Partial<StoreState> = raw ? (JSON.parse(raw) as Partial<StoreState>) : {};

    let gallery = base.gallery ?? [];
    let carousel = base.carousel ?? [];

    if (!demoLoaded) {
      localStorage.setItem(DEMO_KEY, "true");
      if (gallery.length === 0 && carousel.length === 0) {
        gallery = DEMO_GALLERY;
        carousel = DEMO_CAROUSEL;
      }
    }

    let categories = base.categories ?? [];
    let products = base.products ?? [];

    if (!productsLoaded) {
      localStorage.setItem(PRODUCTS_DEMO_KEY, "true");
      if (categories.length === 0) categories = DEMO_PRODUCT_CATEGORIES;
      products = DEMO_PRODUCTS;
    }

    const mergedSettings = { ...defaultSettings, ...(base.settings ?? {}) };
    if (mergedSettings.heroSubtitle === "Handcrafted custom cakess for every occasion") {
      mergedSettings.heroSubtitle = defaultSettings.heroSubtitle;
    }

    return {
      settings: mergedSettings,
      gallery,
      carousel,
      categories,
      products,
      isAuthenticated: false,
    };
  } catch {
    return {
      ...defaultState,
      gallery: DEMO_GALLERY,
      carousel: DEMO_CAROUSEL,
      categories: DEMO_PRODUCT_CATEGORIES,
      products: DEMO_PRODUCTS,
    };
  }
}

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "LOAD_STATE": return {
      ...defaultState,
      ...action.payload,
      settings: { ...defaultSettings, ...(action.payload.settings ?? {}) },
      gallery:    Array.isArray(action.payload.gallery)    ? action.payload.gallery    : defaultState.gallery,
      carousel:   Array.isArray(action.payload.carousel)   ? action.payload.carousel   : defaultState.carousel,
      categories: Array.isArray(action.payload.categories) ? action.payload.categories : defaultState.categories,
      products:   Array.isArray(action.payload.products)   ? action.payload.products   : defaultState.products,
    };
    case "SET_SETTINGS": return { ...state, settings: { ...state.settings, ...action.payload } };
    case "SET_GALLERY": return { ...state, gallery: action.payload };
    case "ADD_GALLERY_ITEM": return { ...state, gallery: [action.payload, ...state.gallery] };
    case "UPDATE_GALLERY_ITEM":
      return { ...state, gallery: state.gallery.map((i) => i.id === action.payload.id ? action.payload : i) };
    case "DELETE_GALLERY_ITEM":
      return { ...state, gallery: state.gallery.filter((i) => i.id !== action.payload) };
    case "SET_CAROUSEL": return { ...state, carousel: action.payload };
    case "ADD_CAROUSEL_SLIDE": return { ...state, carousel: [action.payload, ...state.carousel] };
    case "UPDATE_CAROUSEL_SLIDE":
      return { ...state, carousel: state.carousel.map((s) => s.id === action.payload.id ? action.payload : s) };
    case "DELETE_CAROUSEL_SLIDE":
      return { ...state, carousel: state.carousel.filter((s) => s.id !== action.payload) };
    case "SET_CATEGORIES": return { ...state, categories: action.payload };
    case "ADD_CATEGORY": return { ...state, categories: [action.payload, ...state.categories] };
    case "UPDATE_CATEGORY":
      return { ...state, categories: state.categories.map((c) => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter((c) => c.id !== action.payload) };
    case "SET_PRODUCTS": return { ...state, products: action.payload };
    case "ADD_PRODUCT": return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE_PRODUCT":
      return { ...state, products: state.products.map((p) => p.id === action.payload.id ? action.payload : p) };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };
    case "SET_AUTHENTICATED": return { ...state, isAuthenticated: action.payload };
    default: return state;
  }
}

export type SyncStatus = "idle" | "syncing" | "ok" | "error" | "waking";

interface StoreContextValue {
  state: StoreState;
  dispatch: React.Dispatch<Action>;
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  syncError: string | null;
  manualSync: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState, loadFromStorage);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);
  const isLoadingFromBackend = useRef(false);

  /* ── Persist to localStorage on every state change ── */
  useEffect(() => {
    const { isAuthenticated: _, ...persistable } = state;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable)); } catch {}
  }, [state]);

  /* ── On startup: fetch live data from backend ── */
  useEffect(() => {
    let cancelled = false;
    const configured = isBackendConfigured();

    isLoadingFromBackend.current = true;
    if (configured) setSyncStatus("waking");

    async function tryFetch(retries = configured ? 1 : 0): Promise<void> {
      try {
        const result = await fetchShopData();
        if (cancelled) return;

        if (result && result.data["settings"]) {
          /*
           * Only overwrite local state if the backend version is newer than
           * the last time the admin made a local change. This prevents a hard
           * refresh from reverting unsaved edits back to stale backend data.
           */
          const backendTs = result.updatedAt ? new Date(result.updatedAt).getTime() : 0;
          const localModifiedRaw = localStorage.getItem(LOCAL_MODIFIED_KEY);
          const localTs = localModifiedRaw ? new Date(localModifiedRaw).getTime() : 0;

          if (backendTs >= localTs) {
            isLoadingFromBackend.current = true;
            dispatch({
              type: "LOAD_STATE",
              payload: {
                ...(result.data as Omit<StoreState, "isAuthenticated">),
                isAuthenticated: false,
              },
            });
          }

          setLastSyncedAt(Date.now());
          setSyncStatus("ok");
        } else if (configured) {
          setSyncStatus("idle");
        }
      } catch {
        if (cancelled) return;
        if (retries > 0) {
          setSyncStatus("waking");
          await new Promise((r) => setTimeout(r, 8000));
          if (!cancelled) return tryFetch(retries - 1);
        } else if (configured) {
          setSyncStatus("error");
          setSyncError("Could not reach backend. Using local data.");
        }
      } finally {
        isLoadingFromBackend.current = false;
      }
    }

    tryFetch();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Auto-save to backend after admin changes (debounced 1.5s) ── */
  useEffect(() => {
    if (isInitialLoad.current) { isInitialLoad.current = false; return; }
    if (isLoadingFromBackend.current) return;
    if (!state.isAuthenticated) return;
    if (!isBackendConfigured()) return;

    /* Record the local modification time so startup fetch doesn't revert it */
    localStorage.setItem(LOCAL_MODIFIED_KEY, new Date().toISOString());

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      setSyncStatus("syncing");
      const { isAuthenticated: _, ...payload } = stateRef.current;
      const result = await saveShopData(payload as Record<string, unknown>);
      if (result.ok) {
        setSyncStatus("ok");
        setLastSyncedAt(Date.now());
        setSyncError(null);
        /* Backend is now up-to-date — reset the local-modified marker */
        localStorage.removeItem(LOCAL_MODIFIED_KEY);
      } else {
        setSyncStatus("error");
        setSyncError(result.error ?? "Sync failed");
      }
    }, 1500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  /* ── Manual sync ── */
  async function manualSync() {
    if (!isBackendConfigured()) return;
    setSyncStatus("syncing");
    const { isAuthenticated: _, ...payload } = stateRef.current;
    const result = await saveShopData(payload as Record<string, unknown>);
    if (result.ok) {
      setSyncStatus("ok");
      setLastSyncedAt(Date.now());
      setSyncError(null);
      localStorage.removeItem(LOCAL_MODIFIED_KEY);
    } else {
      setSyncStatus("error");
      setSyncError(result.error ?? "Sync failed");
    }
  }

  return (
    <StoreContext.Provider value={{ state, dispatch, syncStatus, lastSyncedAt, syncError, manualSync }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
