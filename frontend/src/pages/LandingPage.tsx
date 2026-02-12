import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  IconArrowRight,
  IconBrain,
  IconUsers,
  IconChartBar,
  IconShieldLock,
  IconCircleCheck,
  IconStar,
  IconSparkles,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAThH8ZlSEQ3ij-ciG6WBPo_-6E8bLfaJIJ9iudYpn7vwrILktXElieHVx8U-F-rvE_-EzSZmNQay6GkvrtGm36M3_oq97rEsx8e9P5h0K06fQKjP-JEie7ms-aiwq_zdBypP9zFbKq9JPsycjiopYAAh8tXIll3hA1l-v-eCv1jgqfXDsmMfmwA9Gfcmw6sabOh2-kscDIYaG2LLHDnDyrBHJB1YvcLycz6oqLAfMwS9eUgUucKVl2UHdgXARIS42I1qCAUt8FPScu",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDdDnPDwxrVY6qJRPG_nl0Lrl-hYBcw87qf5C-YdOaertpZyIEcaNo-H0q_dAQRoQeoSQFixkd_FyJS9y8hjLpkE3kDcUpHpYrNQG3ID6oue4z26KFd7-XVKplmzVc-wCX4ubDHTnB84VJy1HP8hSc0LxLr2hvFru8fozvJV1dF4WXkSsfB0gPL0u_1nwDDblHResA2t7XVCPNMaa8InIFzqzFIQWjBhf6-LXTiCTDdg2QxZsI6SiYPScvCfqdxoeXegUQgiZ3sdGon",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJPB5QDWmuFzKI9KWJEqrtmqRWTQol_TWwp7QvQXPb2E4rTuNPPnQ8tYXeRNSizRuGYWkIywxlGxjPf0bhb5j6MZBBBagI9AISVpokJvtNptDKl3EDWDPclTO3NuBTe3_XItpE0upBwuKBpIomrg4_Wq-uCEaFtL_8YwepITx9GQz-J3eEHlzFAPNagVesF7mmALX_Mr0MQAKgunrtY_5pPTZ08bzI0-OOhR_viVf_3yZyQdfnOJFQKAeEF-wEmwdDN6BWgwQZowHV",
];

const HERO_IMG = "/landing-hero.png";

const CLINICS_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDAbIirFqjtHXcOu6MquUcl_zF8OY-mF-Ehhl0FbZQi_gES7dObUJz3LZWNvSJL0DdvrvNhONFYRTr50jqAyzvcmedA-uJ33hPE0XWot24avwEfEaW2sK6j_BGY4MstupSk3ZkY1wPa1XPGoCQLhU8Em-0fLFiZRuGML_YAUxmB20kVSO7PazHyaR_Amicopw5b8lz-oM2jLgQEXfX5fmOF010xBdkfb9Z3HVFho02iJfZ4Zz1DCILdcTjXpw-kaOFRDQDF4GwlJ8Zg";

const PATIENTS_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCfxq-R1mT6L4u1-uIBop37D3B6Evmg0LLhTJM_XbrZDd5tuh3njwkybH4jmnxiV75k0nGkJ8ofunODyq3m_7EAfwH6Huk2tkCKkdWXYA621kQVG0WdPWrJXH4RC3b5Wb_i3kG__acLcKlS8F9sdvpzE20yw-2qfIcK26g1LU40Y4sQVZADFe-fqmNbjCaM8xv17JntOfVSTxLR56M0Q-sAqNlieHy1IuVjDxgcg_fKmJdkKJzrgzGjKBCbhDfNkFHpeQMEOF2HRUSe";

const features = [
  {
    icon: IconBrain,
    title: "Neural Diagnostics",
    description:
      "Deep learning algorithms that analyze patient data to surface critical insights faster than ever.",
    offset: false,
  },
  {
    icon: IconUsers,
    title: "Patient Hub",
    description:
      "A unified 360° view of patient health journeys, from first visit to long-term recovery metrics.",
    offset: false,
  },
  {
    icon: IconChartBar,
    title: "Live Analytics",
    description:
      "Real-time dashboards providing clinic-wide performance metrics and population health trends.",
    offset: false,
  },
  {
    icon: IconShieldLock,
    title: "Vault Security",
    description:
      "Military-grade encryption and HIPAA compliance baked into every byte of data transmitted.",
    offset: false,
  },
];

const partners = ["MEDCORE", "HEALTHLINK", "LIFECARE", "CURETECH", "PHARMAOS"];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-bg">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2.5">
              <img
                src="/brand-logo.png"
                alt="Tandarust AI"
                className="h-12 w-auto"
              />
            </div>
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
              <Button size="sm" className="rounded-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
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
                  {AVATARS.map((src, i) => (
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
                  src={HERO_IMG}
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

      {/* ─── Features ─── */}
      <section className="py-32" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-24"
          >
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">
              Precision Capabilities
            </h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-navy mb-6">
              Designed for the next generation of patient care.
            </h3>
            <p className="text-lg text-slate-500 font-light">
              Our modular platform adapts to your workflow, providing the
              perfect balance between automation and human empathy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/10 transition-all group duration-500 ${
                  f.offset ? "lg:translate-y-8" : ""
                }`}
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  <f.icon size={28} />
                </div>
                <h4 className="text-xl font-bold mb-4">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Solutions ─── */}
      <section className="py-32 bg-white relative" id="solutions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Clinics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-navy rounded-3xl p-10 text-white overflow-hidden flex flex-col"
            >
              <h3 className="text-2xl font-extrabold mb-4 font-inter">
                For Clinics
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Empower your medical staff with tools that eliminate paperwork
                and enhance care quality.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <IconCircleCheck
                    size={20}
                    className="text-primary shrink-0"
                  />
                  <span className="text-slate-300 text-sm font-medium">
                    90% Reduction in administrative overhead
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <IconCircleCheck
                    size={20}
                    className="text-primary shrink-0"
                  />
                  <span className="text-slate-300 text-sm font-medium">
                    Enhanced diagnostic accuracy via AI-assistance
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <IconCircleCheck
                    size={20}
                    className="text-primary shrink-0"
                  />
                  <span className="text-slate-300 text-sm font-medium">
                    Automated appointment scheduling &amp; follow-ups
                  </span>
                </li>
              </ul>
              <img
                alt="Clinics"
                className="w-full h-108 object-cover rounded-2xl mt-auto"
                src={CLINICS_IMG}
              />
            </motion.div>

            {/* For Patients */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-[#DEF0F0] border  border-slate-200 rounded-3xl p-10 overflow-hidden flex flex-col"
            >
              <h3 className="text-2xl font-extrabold  mb-4 font-inter">
                For Patients
              </h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Take control of your health journey with a personal assistant in
                your pocket.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <IconCircleCheck
                    size={20}
                    className="text-primary shrink-0"
                  />
                  <span className="text-slate-600 text-sm font-medium">
                    24/7 Access to personal health records
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <IconCircleCheck
                    size={20}
                    className="text-primary shrink-0"
                  />
                  <span className="text-slate-600 text-sm font-medium">
                    AI-assisted symptom tracking &amp; alerts
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <IconCircleCheck
                    size={20}
                    className="text-primary shrink-0"
                  />
                  <span className="text-slate-600 text-sm font-medium">
                    Easy one-tap appointment booking
                  </span>
                </li>
              </ul>
              <img
                alt="Patients"
                className="w-full h-108 object-cover rounded-2xl mt-auto"
                src={PATIENTS_IMG}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 bg-white relative" id="cta">
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
                Experience the future of medical care with our 14-day free
                trial. No credit card required.
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

      {/* ─── Footer ─── */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-8">
                <img
                  src="/brand-logo.png"
                  alt="Tandarust AI"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
                Pioneering the intersection of clinical excellence and
                artificial intelligence for a healthier world.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
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
