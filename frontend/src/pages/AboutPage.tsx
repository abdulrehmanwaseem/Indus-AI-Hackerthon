import { motion } from "motion/react";
import {
  IconStethoscope,
  IconHeartbeat,
  IconBrain,
  IconUsers,
  IconCode,
  IconMail,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const team = [
  {
    name: "Abdul",
    role: "Lead Developer",
    avatar: "AB",
  },
];

const techStack = [
  { name: "React 19", desc: "Frontend framework" },
  { name: "Tailwind CSS v4", desc: "Utility-first styling" },
  { name: "shadcn/ui", desc: "Component library" },
  { name: "Python FastAPI", desc: "Backend engine" },
  { name: "Gemini / GPT", desc: "LLM agents" },
  { name: "Tesseract OCR", desc: "Prescription digitization" },
];

export function AboutPage() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1">About Tandarust AI</h1>
        <p className="text-sm text-muted-foreground mb-8">
          AI-powered healthcare for clinics, doctors, and patients
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 border-border/60 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <IconStethoscope size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Tandarust AI</strong>{" "}
                reduces clinic bottlenecks, helps doctors focus on critical
                patients, digitizes prescriptions for accuracy, predicts health
                risks, and provides patient-friendly guidance in Urdu and
                English — all with a clear AI-driven workflow that is{" "}
                <strong className="text-foreground">
                  explainable, actionable, and scalable
                </strong>
                .
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* What We Do */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="p-6 border-border/60 mb-6">
          <h2 className="font-semibold text-lg mb-4">What We Do</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: IconHeartbeat,
                title: "Patient Prioritization",
                desc: "AI-driven urgency scoring ensures critical patients are seen first",
              },
              {
                icon: IconBrain,
                title: "Health Risk Prediction",
                desc: "Proactive risk analysis based on symptoms, history, and data",
              },
              {
                icon: IconUsers,
                title: "Doctor Dashboard",
                desc: "Real-time queue management with AI summaries and alerts",
              },
              {
                icon: IconCode,
                title: "Prescription OCR",
                desc: "Handwritten prescriptions digitized into structured data",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 border-border/60 mb-6">
          <h2 className="font-semibold text-lg mb-4">Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="p-3 rounded-lg bg-muted/30 border border-border/40"
              >
                <p className="text-sm font-medium">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="p-6 border-border/60 mb-6">
          <h2 className="font-semibold text-lg mb-4">Team</h2>
          <div className="flex flex-wrap gap-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                  {member.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 border-border/60">
          <h2 className="font-semibold text-lg mb-2">Contact</h2>
          <Separator className="mb-4" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconMail size={16} />
            <span>Built for Indus AI Hackathon 2026</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
