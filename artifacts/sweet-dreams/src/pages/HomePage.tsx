import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import FloatingOrderButton from "../components/shared/FloatingOrderButton";
import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import FeaturedCarousel from "../components/home/FeaturedCarousel";
import DeliveredSection from "../components/home/DeliveredSection";
import HowToOrderSection from "../components/home/HowToOrderSection";
import YouTubeSection from "../components/home/YouTubeSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedCarousel />
        <DeliveredSection />
        <HowToOrderSection />
        <YouTubeSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingOrderButton />
    </>
  );
}
