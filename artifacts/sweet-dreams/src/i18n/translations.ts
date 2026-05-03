import { useLang } from "../context/LangContext";

const T = {
  en: {
    nav: {
      home:      "Home",
      gallery:   "Gallery",
      orderNow:  "Order Now",
      navy:      "Navy",
      chocolate: "Chocolate",
    },
    hero: {
      tagline:       "Handcrafted With Love",
      title1:        "Your Dream Cake",
      title2:        "Starts Here",
      order:         "Order Your Cake",
      seeWork:       "See Our Work",
      scrollExplore: "Scroll to explore",
      chooseFlavor:  "Choose a flavor",
      vanilla:       "Vanilla",
      goldenBean:    "Golden Bean",
      chocolateFl:   "Chocolate",
      darkRich:      "Dark & Rich",
      badge1:        "Custom Design",
      badge2:        "Fresh Baked",
      badge3:        "Love In Every Slice",
    },
    category: {
      subtitle:   "What We Do Best",
      title:      "Our Specialties",
      explore:    "Explore",
      designs:    (n: number) => `${n} Design${n !== 1 ? "s" : ""}`,
      customMade: "Custom made",
    },
    featured: {
      subtitle: "Fresh From The Oven",
      title:    "Featured Cakes",
    },
    delivered: {
      subtitle: "Happy Customers, Happy Hearts",
      title:    "Delivered With Love",
      seeAll:   "See All Works",
    },
    howToOrder: {
      subtitle: "Simple Process",
      title:    "How To Order",
      steps: [
        {
          title:       "Browse & Pick",
          description: "Browse our gallery and pick the cake design you love — hundreds of styles for every occasion.",
        },
        {
          title:       "Place Your Order",
          description: "Message us on WhatsApp or Facebook with your design, size, flavour, and delivery date.",
        },
        {
          title:       "Receive & Enjoy",
          description: "Your fresh handcrafted cake is delivered straight to your door — boxed with love.",
        },
      ],
    },
    testimonials: {
      subtitle:  "What Our Customers Say",
      title:     "Loved By Many",
      occasions: ["Birthday Cake", "Wedding Cake", "Anniversary Cake"],
    },
    cta: {
      title:       "Ready To Order Your Dream Cake?",
      desc:        "Get your custom handcrafted cake made with love and delivered fresh. Reach out to us today and let's make something magical together!",
      whatsapp:    "Order on WhatsApp",
      facebook:    "Message on Facebook",
      recommended: "Recommended",
    },
    footer: {
      quickLinks:  "Quick Links",
      contact:     "Contact",
      facebookPage:"Facebook Page",
      orderNow:    "Order Now",
      madeBy:      "Made with ❤️ by TECHELY",
    },
    gallery: {
      home:     "Home",
      label:    "Gallery",
      title:    "Our Cake Gallery",
      subtitle: "Every cake is a masterpiece",
    },
    filterBar: {
      all:         "All",
      chocolate:   "Chocolate",
      vanilla:     "Vanilla",
      anniversary: "Anniversary",
      birthday:    "Birthday",
      wedding:     "Wedding",
      customize:   "Customize",
    },
    products: {
      home:       "Home",
      label:      "Our Menu",
      title:      "Our Menu",
      subtitle:   "Find your perfect cake",
      all:        "All",
      noItems:    "No items here yet",
      noItemsDesc:"Check back soon or browse another category",
    },
  },

  bn: {
    nav: {
      home:      "হোম",
      gallery:   "গ্যালারি",
      orderNow:  "অর্ডার করুন",
      navy:      "নেভি",
      chocolate: "চকোলেট",
    },
    hero: {
      tagline:       "ভালোবাসায় তৈরি",
      title1:        "আপনার স্বপ্নের কেক",
      title2:        "এখানেই শুরু",
      order:         "কেক অর্ডার করুন",
      seeWork:       "আমাদের কাজ দেখুন",
      scrollExplore: "স্ক্রল করুন",
      chooseFlavor:  "ফ্লেভার বেছে নিন",
      vanilla:       "ভ্যানিলা",
      goldenBean:    "গোল্ডেন বিন",
      chocolateFl:   "চকোলেট",
      darkRich:      "ডার্ক ও রিচ",
      badge1:        "কাস্টম ডিজাইন",
      badge2:        "তাজা বেকড",
      badge3:        "প্রতিটি টুকরায় ভালোবাসা",
    },
    category: {
      subtitle:   "আমরা যা সেরা করি",
      title:      "আমাদের বিশেষত্ব",
      explore:    "দেখুন",
      designs:    (n: number) => `${n} ডিজাইন`,
      customMade: "কাস্টম তৈরি",
    },
    featured: {
      subtitle: "তাজা বেকড কেক",
      title:    "বিশেষ কেকসমূহ",
    },
    delivered: {
      subtitle: "খুশি গ্রাহক, খুশি হৃদয়",
      title:    "ভালোবাসায় ডেলিভারি",
      seeAll:   "সব কাজ দেখুন",
    },
    howToOrder: {
      subtitle: "সহজ প্রক্রিয়া",
      title:    "কীভাবে অর্ডার করবেন",
      steps: [
        {
          title:       "ব্রাউজ করুন ও বেছে নিন",
          description: "আমাদের গ্যালারি ব্রাউজ করুন এবং পছন্দের ডিজাইন বেছে নিন — প্রতিটি উপলক্ষের জন্য শত শত স্টাইল।",
        },
        {
          title:       "অর্ডার দিন",
          description: "হোয়াটসঅ্যাপ বা ফেসবুকে ডিজাইন, সাইজ, ফ্লেভার ও ডেলিভারির তারিখ জানিয়ে মেসেজ করুন।",
        },
        {
          title:       "গ্রহণ করুন ও উপভোগ করুন",
          description: "আপনার তাজা হাতে তৈরি কেক সরাসরি দরজায় পৌঁছে দেওয়া হবে — ভালোবাসায় প্যাক করা।",
        },
      ],
    },
    testimonials: {
      subtitle:  "আমাদের গ্রাহকরা কী বলছেন",
      title:     "অনেকের প্রিয়",
      occasions: ["জন্মদিনের কেক", "বিবাহের কেক", "বার্ষিকীর কেক"],
    },
    cta: {
      title:       "আপনার স্বপ্নের কেক অর্ডার করতে প্রস্তুত?",
      desc:        "ভালোবাসায় তৈরি কাস্টম কেক পান, তাজা ডেলিভারি করা হবে। আজই আমাদের সাথে যোগাযোগ করুন!",
      whatsapp:    "হোয়াটসঅ্যাপে অর্ডার করুন",
      facebook:    "ফেসবুকে মেসেজ করুন",
      recommended: "প্রস্তাবিত",
    },
    footer: {
      quickLinks:  "দ্রুত লিংক",
      contact:     "যোগাযোগ",
      facebookPage:"ফেসবুক পেজ",
      orderNow:    "অর্ডার করুন",
      madeBy:      "TECHELY-এর সাথে ❤️ দিয়ে তৈরি",
    },
    gallery: {
      home:     "হোম",
      label:    "গ্যালারি",
      title:    "আমাদের কেক গ্যালারি",
      subtitle: "প্রতিটি কেক একটি শিল্পকর্ম",
    },
    filterBar: {
      all:         "সব",
      chocolate:   "চকোলেট",
      vanilla:     "ভ্যানিলা",
      anniversary: "বার্ষিকী",
      birthday:    "জন্মদিন",
      wedding:     "বিবাহ",
      customize:   "কাস্টমাইজ",
    },
    products: {
      home:       "হোম",
      label:      "আমাদের মেনু",
      title:      "আমাদের মেনু",
      subtitle:   "আপনার পছন্দের কেক খুঁজুন",
      all:        "সব",
      noItems:    "এখনো কোনো আইটেম নেই",
      noItemsDesc:"শীঘ্রই আসছে বা অন্য ক্যাটাগরি দেখুন",
    },
  },
} as const;

export type Translations = typeof T.en;
export function useT(): Translations {
  const { lang } = useLang();
  return T[lang] as Translations;
}
