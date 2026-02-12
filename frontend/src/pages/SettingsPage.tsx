import { useState } from "react";
import { motion } from "motion/react";
import {
  IconUser,
  IconBell,
  IconPalette,
  IconLanguage,
  IconMoon,
  IconSun,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type SettingsTab = "profile" | "notifications" | "appearance" | "language";

const tabs: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: IconUser },
  { key: "notifications", label: "Notifications", icon: IconBell },
  { key: "appearance", label: "Appearance", icon: IconPalette },
  { key: "language", label: "Language", icon: IconLanguage },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    newPatients: true,
    prescriptionUpdates: false,
    email: true,
  });

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Manage your account and preferences
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <Card className="p-2 border-border/60 h-fit lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 border-border/60">
                <h2 className="font-semibold text-lg mb-6">
                  Profile Information
                </h2>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16" size="lg">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      DR
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Dr. Saeed Ahmed</p>
                    <p className="text-sm text-muted-foreground">
                      Cardiologist
                    </p>
                  </div>
                </div>
                <Separator className="mb-6" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" defaultValue="Dr. Saeed Ahmed" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settings-email">Email</Label>
                    <Input
                      id="settings-email"
                      type="email"
                      defaultValue="dr.saeed@clinic.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" defaultValue="Cardiology" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic">Clinic</Label>
                    <Input id="clinic" defaultValue="City Heart Clinic" />
                  </div>
                </div>
                <Button className="mt-6 gap-2">
                  <IconDeviceFloppy size={16} /> Save Changes
                </Button>
              </Card>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 border-border/60">
                <h2 className="font-semibold text-lg mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      key: "criticalAlerts" as const,
                      label: "Critical Patient Alerts",
                      desc: "Get notified when a critical patient enters the queue",
                    },
                    {
                      key: "newPatients" as const,
                      label: "New Patient Arrivals",
                      desc: "Receive alerts for new patient registrations",
                    },
                    {
                      key: "prescriptionUpdates" as const,
                      label: "Prescription Updates",
                      desc: "Notify when prescriptions are digitized or verified",
                    },
                    {
                      key: "email" as const,
                      label: "Email Notifications",
                      desc: "Receive daily summary via email",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <Switch
                        checked={notifications[item.key]}
                        onCheckedChange={(checked: boolean) =>
                          setNotifications((n) => ({
                            ...n,
                            [item.key]: checked,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 border-border/60">
                <h2 className="font-semibold text-lg mb-6">Appearance</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? (
                      <IconMoon size={20} className="text-primary" />
                    ) : (
                      <IconSun size={20} className="text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={toggleDark} />
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "language" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 border-border/60">
                <h2 className="font-semibold text-lg mb-6">Language</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      code: "en" as const,
                      label: "English",
                      native: "English",
                    },
                    { code: "ur" as const, label: "Urdu", native: "اردو" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        language === lang.code
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                    >
                      <p className="font-medium text-sm">{lang.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lang.native}
                      </p>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
