import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  IconUser,
  IconBell,
  IconPalette,
  IconLanguage,
  IconMoon,
  IconSun,
  IconDeviceFloppy,
  IconLoader2,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type SettingsTab = "profile" | "notifications" | "appearance" | "language";

const tabs: { key: SettingsTab; labelKey: string; icon: React.ElementType }[] =
  [
    { key: "profile", labelKey: "profile", icon: IconUser },
    { key: "notifications", labelKey: "notifications", icon: IconBell },
    { key: "appearance", labelKey: "appearance", icon: IconPalette },
    { key: "language", labelKey: "language", icon: IconLanguage },
  ];

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    newPatients: true,
    prescriptionUpdates: false,
    email: true,
  });

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    specialization: "",
    clinic: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        specialization: user.specialization || "",
        clinic: user.clinic || "",
      });
    }
  }, [user]);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLanguageChange = (lng: "en" | "ur") => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        full_name: formData.full_name,
        specialization: formData.specialization,
        clinic: formData.clinic,
      });
      toast.success(t("settings_updated", "Settings updated successfully"));
    } catch (err) {
      toast.error(t("update_failed", "Failed to update profile"));
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1">{t("settings")}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t("manage_preferences")}
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
                {t(tab.labelKey)}
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
                  {t("profile_info")}
                </h2>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {user ? getInitials(user.full_name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.full_name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user?.role}{" "}
                      {user?.specialization && `• ${user.specialization}`}
                    </p>
                  </div>
                </div>
                <Separator className="mb-6" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">{t("full_name")}</Label>
                    <Input
                      id="full-name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          full_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settings-email">{t("email")}</Label>
                    <Input
                      id="settings-email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">
                      {t("specialization")}
                    </Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specialization: e.target.value,
                        }))
                      }
                      placeholder="e.g. Cardiology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic">{t("clinic")}</Label>
                    <Input
                      id="clinic"
                      value={formData.clinic}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clinic: e.target.value,
                        }))
                      }
                      placeholder="e.g. City Health Center"
                    />
                  </div>
                </div>
                <Button
                  className="mt-6 gap-2"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <IconLoader2 size={16} className="animate-spin" />
                  ) : (
                    <IconDeviceFloppy size={16} />
                  )}
                  {t("save_changes")}
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
                  {t("notification_prefs")}
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      key: "criticalAlerts" as const,
                      label: t("critical_alerts"),
                      desc: t("critical_alerts_desc"),
                    },
                    {
                      key: "newPatients" as const,
                      label: t("new_patient_alerts"),
                      desc: t("new_patient_alerts_desc"),
                    },
                    {
                      key: "prescriptionUpdates" as const,
                      label: t("prescription_updates_notif"),
                      desc: t("prescription_updates_desc"),
                    },
                    {
                      key: "email" as const,
                      label: t("email_notifications"),
                      desc: t("email_notifications_desc"),
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
                <h2 className="font-semibold text-lg mb-6">
                  {t("appearance")}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? (
                      <IconMoon size={20} className="text-primary" />
                    ) : (
                      <IconSun size={20} className="text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{t("dark_mode")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("dark_mode_desc")}
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
                <h2 className="font-semibold text-lg mb-6">{t("language")}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      code: "en" as const,
                      label: t("english"),
                      native: "English",
                    },
                    { code: "ur" as const, label: t("urdu"), native: "اردو" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        i18n.language === lang.code
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
