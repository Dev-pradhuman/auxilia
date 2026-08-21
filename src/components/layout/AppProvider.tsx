"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const profile = useProfileStore((state) => state.profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    if (profile.highContrast) {
      body.classList.add("high-contrast");
    } else {
      body.classList.remove("high-contrast");
    }

    if (profile.largeText) {
      body.classList.add("large-text");
    } else {
      body.classList.remove("large-text");
    }

    if (profile.reducedMotion) {
      body.classList.add("reduced-motion");
    } else {
      body.classList.remove("reduced-motion");
    }
  }, [profile, mounted]);

  // Don't render until mounted to avoid hydration mismatch with persistent store
  if (!mounted) return <div className="min-h-screen bg-background" />;

  return <>{children}</>;
}
