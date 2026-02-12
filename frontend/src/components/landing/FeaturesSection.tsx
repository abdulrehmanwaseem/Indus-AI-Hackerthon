import { motion } from "motion/react";
import {
  IconBrain,
  IconUsers,
  IconChartBar,
  IconShieldLock,
} from "@tabler/icons-react";

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

export function FeaturesSection() {
  return (
    <section className="py-32 scroll-mt-20" id="features">
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
            Our modular platform adapts to your workflow, providing the perfect
            balance between automation and human empathy.
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
              className={`p-10 bg-white border hover:border-primary hover:cursor-pointer border-slate-100 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/10 transition-all group duration-500 ${
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
  );
}
