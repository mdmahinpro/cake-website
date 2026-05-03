import type { CakeItem, CarouselSlide, ProductCategory, Product } from "../store/useStore";

export const DEMO_GALLERY: CakeItem[] = [
  {
    id: "1", type: "delivered", category: "Chocolate", featured: true,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format",
    caption: "Rich triple chocolate layer cake with ganache drip and fresh berries",
    review: "Absolutely stunning! The ganache drip was perfect and it tasted even better than it looked.",
  },
  {
    id: "2", type: "delivered", category: "Vanilla", featured: true,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format",
    caption: "Classic vanilla buttercream cake with floral decoration",
    review: "The floral details were breathtaking. Everyone at the party was asking where we got it from!",
  },
  {
    id: "3", type: "delivered", category: "Birthday", featured: true,
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format",
    caption: "Birthday surprise for little Rafa — delivered fresh to Dhaka! 🎈",
    review: "Little Rafa couldn't believe his eyes! The cake was absolutely perfect — thank you so much!",
  },
  {
    id: "4", type: "delivered", category: "Chocolate", featured: true,
    imageUrl: "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=600&auto=format",
    caption: "Loaded chocolate fantasy for the true chocoholic",
    review: "Every bite was pure heaven. Rich, moist, and not too sweet — exactly what I asked for.",
  },
  {
    id: "5", type: "delivered", category: "Wedding", featured: false,
    imageUrl: "https://images.unsplash.com/photo-1547414368-ac947d00b91d?w=600&auto=format",
    caption: "Elegant 4-tier wedding cake delivered to the venue on time 💍",
    review: "Guests couldn't stop talking about the cake. The perfect start to our new chapter!",
  },
  {
    id: "6", type: "delivered", category: "Custom", featured: true,
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format",
    caption: "Custom drip cake with gold accents and macarons",
    review: "The gold detailing was beyond what I imagined. Absolutely show-stopping at our event!",
  },
  {
    id: "7", type: "delivered", category: "Vanilla", featured: false,
    imageUrl: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600&auto=format",
    caption: "Dreamy pink rose vanilla cake for a princess birthday",
    review: "My daughter was over the moon! The roses looked so real and the sponge was so fluffy.",
  },
  {
    id: "8", type: "delivered", category: "Birthday", featured: false,
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format",
    caption: "Surprise delivery complete — Nadia loved every layer! ❤️",
    review: "Nadia cried happy tears! The taste was as beautiful as the design. Will definitely order again!",
  },
  {
    id: "9", type: "delivered", category: "Chocolate", featured: true,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format",
    caption: "Dark chocolate drip with salted caramel and crunch",
    review: "The salted caramel hit was incredible. Hands-down the best cake I've ever tasted.",
  },
  {
    id: "10", type: "delivered", category: "Custom", featured: false,
    imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&auto=format",
    caption: "Hand-painted watercolor cake — truly one of a kind",
    review: "This was a piece of edible art! Every guest took a photo before we cut it.",
  },
  {
    id: "11", type: "delivered", category: "Custom", featured: false,
    imageUrl: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format",
    caption: "On-time delivery in Dinajpur — customer was speechless! 🎉",
    review: "Ordered from far away and it arrived perfectly fresh. Completely speechless at the quality!",
  },
  {
    id: "12", type: "delivered", category: "Wedding", featured: false,
    imageUrl: "https://images.unsplash.com/photo-1616690248468-e4f544a71e5b?w=600&auto=format",
    caption: "White elegance wedding cake with gold leaf details",
    review: "The gold leaf was applied with such precision. Our wedding photos look like a magazine spread!",
  },
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
  {
    id: "p1", name: "Red Velvet Cupcake Box", categoryId: "cat1",
    caption: "Velvety red cupcakes with cream cheese swirls — perfect as a gift box",
    imageUrl: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format",
  },
  {
    id: "p2", name: "Dark Chocolate Drip Cake", categoryId: "cat1",
    caption: "Dark chocolate drip with salted caramel and crunchy praline topping",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format",
  },
  {
    id: "p3", name: "Sprinkle Funfetti Cupcakes", categoryId: "cat2",
    caption: "Cheerful vanilla cupcakes loaded with rainbow sprinkles and pastel frosting",
    imageUrl: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&auto=format",
  },
  {
    id: "p4", name: "Classic Vanilla Buttercream", categoryId: "cat2",
    caption: "Timeless vanilla buttercream cake with delicate floral decoration",
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format",
  },
  {
    id: "p5", name: "Macaron Tower Cake", categoryId: "cat3",
    caption: "Custom celebration cake crowned with a tower of hand-made French macarons",
    imageUrl: "https://images.unsplash.com/photo-1553025934-296397db4010?w=600&auto=format",
  },
  {
    id: "p6", name: "Hand-Painted Watercolor Cake", categoryId: "cat3",
    caption: "Artistic hand-painted watercolor finish — a truly one-of-a-kind edible masterpiece",
    imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&auto=format",
  },
  {
    id: "p7", name: "Elegant Tiered Wedding Cake", categoryId: "cat4",
    caption: "Classic multi-tier wedding cake with ivory fondant and gold leaf accents",
    imageUrl: "https://images.unsplash.com/photo-1547414368-ac947d00b91d?w=600&auto=format",
  },
  {
    id: "p8", name: "Birthday Candle Cake", categoryId: "cat4",
    caption: "Joyful layered birthday cake with lit candles — makes every moment magical",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format",
  },
];
