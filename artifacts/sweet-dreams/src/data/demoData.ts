import type { CakeItem, CarouselSlide } from "../store/useStore";

export const DEMO_GALLERY: CakeItem[] = [
  { id: "1", type: undefined, category: "Chocolate", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format", caption: "Rich triple chocolate layer cake with ganache drip and fresh berries", featured: true },
  { id: "2", type: undefined, category: "Vanilla", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format", caption: "Classic vanilla buttercream cake with floral decoration", featured: true },
  { id: "3", type: "delivered", category: "Birthday", imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format", caption: "Delivered fresh to Dhaka! Birthday surprise for little Rafa 🎈", featured: true },
  { id: "4", type: undefined, category: "Overloaded Chocolate", imageUrl: "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=600&auto=format", caption: "Overloaded chocolate fantasy for the true chocoholic", featured: true },
  { id: "5", type: "delivered", category: "Wedding", imageUrl: "https://images.unsplash.com/photo-1547414368-ac947d00b91d?w=600&auto=format", caption: "Elegant 4-tier wedding cake delivered to the venue 💍", featured: false },
  { id: "6", type: undefined, category: "Custom", imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format", caption: "Custom drip cake with gold accents and macarons", featured: true },
  { id: "7", type: undefined, category: "Vanilla", imageUrl: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600&auto=format", caption: "Dreamy pink rose vanilla cake for a princess birthday", featured: false },
  { id: "8", type: "delivered", category: "Birthday", imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format", caption: "Surprise delivery complete! Nadia loved her cake ❤️", featured: false },
  { id: "9", type: undefined, category: "Chocolate", imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format", caption: "Dark chocolate drip with salted caramel and crunch", featured: true },
  { id: "10", type: undefined, category: "Custom", imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&auto=format", caption: "Hand-painted watercolor cake - truly one of a kind", featured: false },
  { id: "11", type: "delivered", category: "Custom", imageUrl: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format", caption: "On-time delivery in Dinajpur - customer was speechless!", featured: false },
  { id: "12", type: undefined, category: "Wedding", imageUrl: "https://images.unsplash.com/photo-1616690248468-e4f544a71e5b?w=600&auto=format", caption: "White elegance wedding cake with gold leaf details", featured: false },
];

export const DEMO_CAROUSEL: CarouselSlide[] = [
  { id: "c1", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format", title: "Sweet Dreams Cakes", subtitle: "Handcrafted with Love", ctaText: "Every cake tells a story" },
  { id: "c2", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format", title: "Custom Designs", subtitle: "Made Just For You", ctaText: "Your dream cake awaits" },
  { id: "c3", imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format", title: "Fresh Daily", subtitle: "Baked With Heart", ctaText: "Order yours today" },
];
