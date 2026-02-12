import { useState, useEffect } from "react";
import { IconDownload, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log("PWAInstallPrompt: Hook registered");

    // Check if we are on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    // Force show for testing if ?pwa-test=true is in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("pwa-test") === "true") {
      console.log("PWAInstallPrompt: Test mode enabled via URL");
      // Use a timeout to avoid synchronous setState inside useEffect warning
      setTimeout(() => setIsVisible(true), 0);
    }

    const handler = (e: Event) => {
      console.log("PWAInstallPrompt: beforeinstallprompt event fired!");
      // Prevent the default browser prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show our custom banner
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Debugging: If app is already installed
    window.addEventListener("appinstalled", () => {
      console.log("PWAInstallPrompt: App was installed successfully");
      setIsVisible(false);
    });

    // iOS Safari Handling (manual instructions)
    if (isIOS && !isStandalone) {
      console.log(
        "PWAInstallPrompt: iOS Safari detected. You might want to show manual instructions here.",
      );
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const dismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-4 right-4 z-[100] md:left-auto md:right-6 md:w-80"
        >
          <div className="bg-navy text-white p-5 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
            {/* Background sparkle effect */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0">
                <img
                  src="/brand-logo.png"
                  alt="App Icon"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Install Tandarust AI</h3>
                <p className="text-white/60 text-xs mt-1 leading-relaxed">
                  Access diagnostics and your patient dashboard directly from
                  your home screen.
                </p>
              </div>
              <button
                onClick={dismiss}
                className="text-white/40 hover:text-white transition-colors"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleInstallClick}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-10 rounded-xl text-xs gap-2"
              >
                <IconDownload size={16} /> Install Now
              </Button>
              <Button
                variant="ghost"
                onClick={dismiss}
                className="text-white/60 hover:text-white hover:bg-white/5 text-xs font-medium"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
