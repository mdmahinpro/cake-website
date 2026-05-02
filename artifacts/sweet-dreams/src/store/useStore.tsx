import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface CakeItem {
  id: string;
  caption: string;
  category: string;
  imageUrl: string;
  featured?: boolean;
  type?: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
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
}

export interface StoreState {
  settings: Settings;
  gallery: CakeItem[];
  carousel: CarouselSlide[];
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
};

const defaultState: StoreState = {
  settings: defaultSettings,
  gallery: [],
  carousel: [],
  isAuthenticated: false,
};

const STORAGE_KEY = "sweet_dreams_store";

function loadFromStorage(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return {
      settings: { ...defaultSettings, ...parsed.settings },
      gallery: parsed.gallery ?? [],
      carousel: parsed.carousel ?? [],
      isAuthenticated: false,
    };
  } catch {
    return defaultState;
  }
}

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "LOAD_STATE":
      return action.payload;
    case "SET_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "SET_GALLERY":
      return { ...state, gallery: action.payload };
    case "ADD_GALLERY_ITEM":
      return { ...state, gallery: [...state.gallery, action.payload] };
    case "UPDATE_GALLERY_ITEM":
      return {
        ...state,
        gallery: state.gallery.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case "DELETE_GALLERY_ITEM":
      return {
        ...state,
        gallery: state.gallery.filter((item) => item.id !== action.payload),
      };
    case "SET_CAROUSEL":
      return { ...state, carousel: action.payload };
    case "ADD_CAROUSEL_SLIDE":
      return { ...state, carousel: [...state.carousel, action.payload] };
    case "UPDATE_CAROUSEL_SLIDE":
      return {
        ...state,
        carousel: state.carousel.map((slide) =>
          slide.id === action.payload.id ? action.payload : slide
        ),
      };
    case "DELETE_CAROUSEL_SLIDE":
      return {
        ...state,
        carousel: state.carousel.filter(
          (slide) => slide.id !== action.payload
        ),
      };
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    default:
      return state;
  }
}

interface StoreContextValue {
  state: StoreState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState, loadFromStorage);

  useEffect(() => {
    const { isAuthenticated: _, ...persistable } = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
    }
  }, [state]);

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
