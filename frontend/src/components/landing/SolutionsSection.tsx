import { motion } from "motion/react";
import { IconCircleCheck } from "@tabler/icons-react";
import { ASSETS } from "@/lib/assets";

export function SolutionsSection() {
  return (
    <section className="py-32 bg-white relative scroll-mt-20" id="solutions">
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
            <p className="text-slate-300 text-md mb-8 leading-relaxed">
              Empower your medical staff with tools that eliminate paperwork and
              enhance care quality.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <IconCircleCheck size={20} className="text-primary shrink-0" />
                <span className="text-slate-100 text-sm font-medium">
                  90% Reduction in administrative overhead
                </span>
              </li>
              <li className="flex items-center gap-3">
                <IconCircleCheck size={20} className="text-primary shrink-0" />
                <span className="text-slate-301000 text-sm font-medium">
                  Enhanced diagnostic accuracy via AI-assistance
                </span>
              </li>
              <li className="flex items-center gap-3">
                <IconCircleCheck size={20} className="text-primary shrink-0" />
                <span className="text-slate-100 text-sm font-medium">
                  Automated appointment scheduling &amp; follow-ups
                </span>
              </li>
            </ul>
            <img
              alt="Clinics"
              className="w-full h-108 object-cover rounded-2xl mt-auto"
              src={ASSETS.IMAGES.CLINICS}
            />
          </motion.div>

          {/* For Patients */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-[#DEF0F0] border  border-primary/30 rounded-3xl p-10 overflow-hidden flex flex-col"
          >
            <h3 className="text-2xl font-extrabold  mb-4 font-inter">
              For Patients
            </h3>
            <p className="text-slate-600 text-md mb-8 leading-relaxed">
              Take control of your health journey with a personal assistant in
              your pocket.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <IconCircleCheck size={20} className="text-primary shrink-0" />
                <span className="text-slate-700 text-sm font-medium">
                  24/7 Access to personal health records
                </span>
              </li>
              <li className="flex items-center gap-3">
                <IconCircleCheck size={20} className="text-primary shrink-0" />
                <span className="text-slate-700 text-sm font-medium">
                  AI-assisted symptom tracking &amp; alerts
                </span>
              </li>
              <li className="flex items-center gap-3">
                <IconCircleCheck size={20} className="text-primary shrink-0" />
                <span className="text-slate-700 text-sm font-medium">
                  Easy one-tap appointment booking
                </span>
              </li>
            </ul>
            <img
              alt="Patients"
              className="w-full h-108 object-cover rounded-2xl mt-auto"
              src={ASSETS.IMAGES.PATIENTS}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
