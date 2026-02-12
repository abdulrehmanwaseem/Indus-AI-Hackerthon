import { useRegisterSW } from "virtual:pwa-register/react";

export function PWARegister() {
  useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log("SW Registered: ", r);
    },
    onRegisterError(error: unknown) {
      console.log("SW registration error", error);
    },
  });

  return null;
}
