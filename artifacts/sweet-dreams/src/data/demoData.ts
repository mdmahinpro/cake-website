import type { CakeItem, CarouselSlide, ProductCategory, Product } from "../store/useStore";

export const DEMO_GALLERY: CakeItem[] = [
  { id: "1", type: undefined, category: "Chocolate", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format", caption: "Rich triple chocolate layer cake with ganache drip and fresh berries", featured: true },
  { id: "2", type: undefined, category: "Vanilla", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format", caption: "Classic vanilla buttercream cake with floral decoration", featured: true },
  { id: "3", type: "delivered", category: "Birthday", imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format", caption: "Birthday surprise for little Rafa — delivered fresh to Dhaka! 🎈", featured: true, review: "Little Rafa couldn't believe his eyes! The cake was absolutely perfect — thank you so much!" },
  { id: "4", type: undefined, category: "Others", imageUrl: "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=600&auto=format", caption: "Loaded chocolate fantasy for the true chocoholic", featured: true },
  { id: "5", type: "delivered", category: "Wedding", imageUrl: "https://images.unsplash.com/photo-1547414368-ac947d00b91d?w=600&auto=format", caption: "Elegant 4-tier wedding cake delivered to the venue on time 💍", featured: false, review: "Guests couldn't stop talking about the cake. The perfect start to our new chapter!" },
  { id: "6", type: undefined, category: "Custom", imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format", caption: "Custom drip cake with gold accents and macarons", featured: true },
  { id: "7", type: undefined, category: "Vanilla", imageUrl: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600&auto=format", caption: "Dreamy pink rose vanilla cake for a princess birthday", featured: false },
  { id: "8", type: "delivered", category: "Birthday", imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format", caption: "Surprise delivery complete — Nadia loved every layer! ❤️", featured: false, review: "Nadia cried happy tears! The taste was as beautiful as the design. Will definitely order again!" },
  { id: "9", type: undefined, category: "Chocolate", imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format", caption: "Dark chocolate drip with salted caramel and crunch", featured: true },
  { id: "10", type: undefined, category: "Custom", imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&auto=format", caption: "Hand-painted watercolor cake — truly one of a kind", featured: false },
  { id: "11", type: "delivered", category: "Custom", imageUrl: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format", caption: "On-time delivery in Dinajpur — customer was speechless! 🎉", featured: false, review: "Ordered from far away and it arrived perfectly fresh. Completely speechless at the quality!" },
  { id: "12", type: undefined, category: "Wedding", imageUrl: "https://images.unsplash.com/photo-1616690248468-e4f544a71e5b?w=600&auto=format", caption: "White elegance wedding cake with gold leaf details", featured: false },
];

export const DEMO_CAROUSEL: CarouselSlide[] = [
  { id: "c1", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format", title: "Sweet Dreams Cakes", subtitle: "Handcrafted with Love", ctaText: "Every cake tells a story" },
  { id: "c2", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format", title: "Custom Designs", subtitle: "Made Just For You", ctaText: "Your dream cake awaits" },
  { id: "c3", imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format", title: "Fresh Daily", subtitle: "Baked With Heart", ctaText: "Order yours today" },
];

export const DEMO_PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: "cat1", name: "Chocolate",     slug: "chocolate", gradient: "from-choco-800 to-choco-600" },
  { id: "cat2", name: "Vanilla",       slug: "vanilla",   gradient: "from-amber-900 to-yellow-800" },
  { id: "cat3", name: "Custom Design", slug: "custom",    gradient: "from-rose-900 to-pink-900" },
  { id: "cat4", name: "Others",        slug: "others",    gradient: "from-stone-900 to-choco-800" },
];

export const DEMO_PRODUCTS: Product[] = [
  { id: "p1", name: "Triple Chocolate Layer Cake", categoryId: "cat1", caption: "Rich triple chocolate layer cake with ganache drip and fresh berries", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format" },
  { id: "p2", name: "Dark Chocolate Drip Cake", categoryId: "cat1", caption: "Dark chocolate drip with salted caramel and crunchy praline", imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format" },
  { id: "p3", name: "Classic Vanilla Buttercream", categoryId: "cat2", caption: "Classic vanilla buttercream cake with delicate floral decoration", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format" },
  { id: "p4", name: "Dreamy Pink Rose Vanilla", categoryId: "cat2", caption: "Dreamy pink rose vanilla cake, perfect for a princess birthday", imageUrl: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600&auto=format" },
  { id: "p5", name: "Gold Drip Custom Cake", categoryId: "cat3", caption: "Custom drip cake with gold accents and macarons — your vision, our craft", imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format" },
  { id: "p6", name: "Hand-Painted Watercolor", categoryId: "cat3", caption: "Hand-painted watercolor cake — a wearable art piece you can eat", imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&auto=format" },
  { id: "p7", name: "White Elegance Wedding Cake", categoryId: "cat4", caption: "White elegance wedding cake with gold leaf details for your special day", imageUrl: "https://images.unsplash.com/photo-1616690248468-e4f544a71e5b?w=600&auto=format" },
  { id: "p8", name: "Loaded Chocolate Fantasy", categoryId: "cat4", caption: "Over-the-top chocolate fantasy loaded with treats for the true chocoholic", imageUrl: "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=600&auto=format" },
];
