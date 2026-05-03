import React, { createContext, useContext, useReducer, useEffect } from "react";
import { DEMO_GALLERY, DEMO_CAROUSEL, DEMO_PRODUCT_CATEGORIES, DEMO_PRODUCTS } from "../data/demoData";

export interface CakeItem {
  id: string;
  caption: string;
  category: string;
  imageUrl: string;
  featured?: boolean;
  type?: string;
  review?: string;
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
const DEMO_KEY = "cake-demo-loaded";
const PRODUCTS_DEMO_KEY = "cake-products-loaded-v4";

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
      // Force-replace demo products with fresh images on version bump
      if (categories.length === 0) categories = DEMO_PRODUCT_CATEGORIES;
      products = DEMO_PRODUCTS;
    }

    return {
      settings: { ...defaultSettings, ...(base.settings ?? {}) },
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
    case "LOAD_STATE": return action.payload;
    case "SET_SETTINGS": return { ...state, settings: { ...state.settings, ...action.payload } };
    case "SET_GALLERY": return { ...state, gallery: action.payload };
    case "ADD_GALLERY_ITEM": return { ...state, gallery: [...state.gallery, action.payload] };
    case "UPDATE_GALLERY_ITEM":
      return { ...state, gallery: state.gallery.map((i) => i.id === action.payload.id ? action.payload : i) };
    case "DELETE_GALLERY_ITEM":
      return { ...state, gallery: state.gallery.filter((i) => i.id !== action.payload) };
    case "SET_CAROUSEL": return { ...state, carousel: action.payload };
    case "ADD_CAROUSEL_SLIDE": return { ...state, carousel: [...state.carousel, action.payload] };
    case "UPDATE_CAROUSEL_SLIDE":
      return { ...state, carousel: state.carousel.map((s) => s.id === action.payload.id ? action.payload : s) };
    case "DELETE_CAROUSEL_SLIDE":
      return { ...state, carousel: state.carousel.filter((s) => s.id !== action.payload) };
    case "SET_CATEGORIES": return { ...state, categories: action.payload };
    case "ADD_CATEGORY": return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return { ...state, categories: state.categories.map((c) => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter((c) => c.id !== action.payload) };
    case "SET_PRODUCTS": return { ...state, products: action.payload };
    case "ADD_PRODUCT": return { ...state, products: [...state.products, action.payload] };
    case "UPDATE_PRODUCT":
      return { ...state, products: state.products.map((p) => p.id === action.payload.id ? action.payload : p) };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };
    case "SET_AUTHENTICATED": return { ...state, isAuthenticated: action.payload };
    default: return state;
  }
}

interface StoreContextValue {
  state: StoreState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState, loadFromStorage);

  // Persist to localStorage on every state change
  useEffect(() => {
    const { isAuthenticated: _, ...persistable } = state;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable)); } catch {}
  }, [state]);

  // On startup: try to fetch /sweet-dreams-data.json from the server.
  // When the owner uploads this file to Hostinger, ALL visitors automatically
  // load the published content instead of the default demo data.
  useEffect(() => {
    let cancelled = false;
    fetch("/sweet-dreams-data.json", { cache: "no-cache" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: null | (Omit<StoreState, "isAuthenticated"> & { publishedAt?: number })) => {
        if (cancelled) return;
        if (data && data.settings) {
          dispatch({
            type: "LOAD_STATE",
            payload: { ...data, isAuthenticated: false },
          });
        }
      })
      .catch(() => {
        // File doesn't exist yet — silently fall back to localStorage/demo data
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
