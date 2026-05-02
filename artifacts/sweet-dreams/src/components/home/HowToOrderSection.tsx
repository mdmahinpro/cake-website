import { motion } from "framer-motion";
import { FiSearch, FiSend, FiGift } from "react-icons/fi";
import AnimatedSection from "../shared/AnimatedSection";

const STEPS = [
  {
    number: "01",
    Icon: FiSearch,
    title: "Browse & Pick",
    description:
      "Browse our gallery, pick the cake you love. We have hundreds of designs for every occasion.",
  },
  {
    number: "02",
    Icon: FiSend,
    title: "Place Your Order",
    description:
      "Send us a message via WhatsApp or Facebook. Tell us your design, size, and delivery date.",
  },
  {
    number: "03",
    Icon: FiGift,
    title: "Receive & Enjoy",
    description:
      "Get your fresh handcrafted cake delivered right to your door. Enjoy every bite!",
  },
];

export default function HowToOrderSection() {
  return (
    <section className="py-24 bg-choco-900 relative overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #00beff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="section-subtitle mb-2">Simple Process</p>
          <h2 className="section-title">How To Order</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-caramel-300 mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        {/* ── Desktop horizontal timeline ── */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute top-[30px] left-[calc(16.66%)] right-[calc(16.66%)] h-px"
              style={{
                background: "linear-gradient(to right, transparent, rgba(0,190,255,0.5) 20%, rgba(0,190,255,0.5) 80%, transparent)",
              }}
            />

            <div className="grid grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <AnimatedSection key={step.number} delay={i * 140}>
                  <div className="flex flex-col items-center gap-5 text-center">
                    {/* Circle on timeline */}
                    <motion.div
                      className="relative z-10 w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #031525, #051e36)",
                        border: "2px solid #00beff",
                        boxShadow: "0 0 24px rgba(0,190,255,0.35), inset 0 0 12px rgba(0,190,255,0.08)",
                      }}
                      whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(0,190,255,0.55)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="font-playfair font-bold text-caramel-400 text-lg leading-none">
                        {step.number}
                      </span>
                    </motion.div>

                    {/* Down connector */}
                    <div
                      className="w-px h-8"
                      style={{ background: "linear-gradient(to bottom, rgba(0,190,255,0.4), transparent)" }}
                    />

                    {/* Card */}
                    <motion.div
                      className="card-glass p-7 rounded-3xl w-full"
                      whileHover={{ y: -6, boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,190,255,0.12)" }}
                      transition={{ type: "spring", stiffness: 250, damping: 22 }}
                    >
                      <div className="flex justify-center mb-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, rgba(0,190,255,0.15), rgba(0,190,255,0.05))",
                            border: "1px solid rgba(0,190,255,0.25)",
                          }}
                        >
                          <step.Icon size={24} className="text-caramel-400" />
                        </div>
                      </div>
                      <h3 className="font-playfair text-xl font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="font-poppins text-sm text-caramel-200 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile vertical timeline ── */}
        <div className="md:hidden flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 100}>
              <div className="flex gap-4 items-stretch">
                {/* Left: circle + vertical line */}
                <div className="flex flex-col items-center flex-shrink-0 w-12">
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                    style={{
                      background: "linear-gradient(135deg, #031525, #051e36)",
                      border: "2px solid #00beff",
                      boxShadow: "0 0 18px rgba(0,190,255,0.3)",
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="font-playfair font-bold text-caramel-400 text-sm">
                      {step.number}
                    </span>
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 w-px mt-2 mb-0 min-h-[40px]"
                      style={{ background: "linear-gradient(to bottom, rgba(0,190,255,0.35), rgba(0,190,255,0.05))" }}
                    />
                  )}
                </div>

                {/* Right: card */}
                <div className={`flex-1 ${i < STEPS.length - 1 ? "mb-6" : ""}`}>
                  <motion.div
                    className="card-glass p-5 rounded-2xl h-full"
                    whileHover={{ x: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(0,190,255,0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(0,190,255,0.12)",
                          border: "1px solid rgba(0,190,255,0.2)",
                        }}
                      >
                        <step.Icon size={18} className="text-caramel-400" />
                      </div>
                      <h3 className="font-playfair text-lg font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="font-poppins text-sm text-caramel-200 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
