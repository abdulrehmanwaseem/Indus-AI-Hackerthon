import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/assets";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
import { CTASection } from "@/components/landing/CTASection";
import { IconBrandLinkedinFilled, IconBrandX } from "@tabler/icons-react";

const partners = ["MEDCORE", "HEALTHLINK", "LIFECARE", "CURETECH", "PHARMAOS"];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-bg">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="#home" className="flex items-center gap-2.5">
              <img
                src={ASSETS.IMAGES.BRAND_LOGO}
                alt="Tandarust AI"
                className="h-12 w-auto"
              />
            </a>
            <div className="hidden md:flex items-center space-x-10">
              <a
                href="#features"
                className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#solutions"
                className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                Solutions
              </a>
              <a
                href="#cta"
                className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                How it Works
              </a>
              <Link to="/register">
                <Button className="bg-navy h-10 hover:bg-slate-800 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md">
                  Get Started
                </Button>
              </Link>
            </div>
            {/* mobile */}
            <Link to="/register" className="md:hidden">
              <Button size="sm" className="rounded-full h-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Sections ─── */}
      <HeroSection />

      {/* ─── Partners ─── */}
      <div className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">
            Integrated with world-class medical institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0">
            {partners.map((name) => (
              <span
                key={name}
                className="text-xl font-black text-slate-900 tracking-tighter"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <FeaturesSection />
      <SolutionsSection />
      <CTASection />

      {/* ─── Footer ─── */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <a href="#home" className="flex items-center gap-2.5 mb-8">
                <img
                  src={ASSETS.IMAGES.BRAND_LOGO}
                  alt="Tandarust AI"
                  className="h-10 w-auto"
                />
              </a>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
                Pioneering the intersection of clinical excellence and
                artificial intelligence for a healthier world.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                >
                  <IconBrandX />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                >
                  <IconBrandLinkedinFilled />
                </a>
              </div>
            </div>
            <div>
              <h6 className="font-bold text-navy mb-8">Platform</h6>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    Neural Insights
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="hover:text-primary transition-colors"
                  >
                    Security Core
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API Access
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing Plans
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-navy mb-8">Solutions</h6>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Small Clinics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Hospital Networks
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Patient Apps
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    PWA Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-navy mb-8">Company</h6>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-medium text-slate-400">
              © 2026 Tandarust AI. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-navy">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-navy">
                Terms of Service
              </a>
              <a href="#" className="hover:text-navy">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
