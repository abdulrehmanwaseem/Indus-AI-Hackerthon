import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-32 bg-white relative scroll-mt-20" id="cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-navy rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden bg-grid-pattern"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8 tracking-tight">
              Ready to elevate your practice?
            </h2>
            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the future of medical care with our 14-day free trial.
              No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-[#0C8F8D] text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/40 h-auto"
                >
                  Request Access
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-12 py-5 rounded-2xl font-bold text-lg h-auto hover:text-white"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
