import React from "react";
import AnimatedSection from "../shared/AnimatedSection";

const STEPS = [
  {
    number: "01",
    emoji: "🔍",
    title: "Browse & Pick",
    description:
      "Browse our gallery, pick the cake you love. We have hundreds of designs for every occasion.",
  },
  {
    number: "02",
    emoji: "💬",
    title: "Place Your Order",
    description:
      "Send us a message via WhatsApp or Facebook. Tell us your design, size, and delivery date.",
  },
  {
    number: "03",
    emoji: "🎂",
    title: "Receive & Enjoy",
    description:
      "Get your fresh handcrafted cake delivered right to your door. Enjoy every bite!",
  },
];

export default function HowToOrderSection() {
  return (
    <section
      className="py-20 bg-choco-900 relative overflow-hidden"
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #d4a574 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="section-title">How To Order</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-rose-cake mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="flex flex-col md:flex-row items-start gap-6">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.number}>
              <AnimatedSection delay={i * 120} className="flex-1">
                <div className="card-glass p-6 rounded-3xl h-full flex flex-col gap-4">
                  <p className="font-playfair font-black text-6xl md:text-8xl text-gradient opacity-80 leading-none">
                    {step.number}
                  </p>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
                    style={{
                      background: "rgba(212,165,116,0.20)",
                      borderColor: "rgba(212,165,116,0.40)",
                    }}
                  >
                    {step.emoji}
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="font-poppins text-sm text-caramel-200 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Dashed connector (desktop only, not after last) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex items-center flex-shrink-0 mt-20 self-start">
                  <div className="w-10 border-t-2 border-dashed border-caramel-700/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
