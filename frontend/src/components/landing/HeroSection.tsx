import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { IconArrowRight, IconStar, IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/assets";

export function HeroSection() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden hero-gradient bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:flex lg:items-center lg:gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-primary ring-1 ring-inset ring-primary/30 bg-primary/5 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Now with AI Diagnostics 2.0
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-navy leading-[1.05] mb-8 tracking-tight">
              Healthcare, <br />
              <span className="text-primary italic font-medium">
                intelligently
              </span>{" "}
              refined.
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl leading-relaxed font-light">
              The premium PWA platform bridging the gap between clinical
              precision and patient experience with AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-[#0C8F8D] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 h-auto gap-3"
                >
                  Get Started Free <IconArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg text-navy hover:bg-slate-50 shadow-sm h-auto"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>
            {/* Social proof */}
            <div className="mt-12 flex items-center gap-5">
              <div className="flex -space-x-3">
                {ASSETS.IMAGES.SOCIAL_AVATARS.map((src, i) => (
                  <img
                    key={i}
                    alt="User"
                    className="w-12 h-12 rounded-full border-4 border-white shadow-sm object-cover"
                    src={src}
                  />
                ))}
              </div>
              <div>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm font-bold text-navy">
                  Trusted by 500+ clinics
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 mt-20 lg:mt-0 relative"
          >
            <div className="relative z-10 glass-panel p-4 rounded-[2.5rem] rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                alt="Medical AI Illustration"
                className="rounded-[2rem] w-full aspect-square object-cover shadow-inner"
                src={ASSETS.IMAGES.HERO}
              />
              {/* Floating AI Insight card */}
              <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <IconSparkles size={16} />
                  </div>
                  <span className="text-xs font-bold text-navy uppercase tracking-wider">
                    AI Insight
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-snug font-medium">
                  Diagnostic accuracy achieved in latest clinical trials.
                </p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[120px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
