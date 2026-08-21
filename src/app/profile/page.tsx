"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { SignOutButton, SignedIn, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => setMounted(true), []);

  const toggleSetting = (key: keyof typeof profile) => {
    updateProfile({ [key]: !profile[key] });
  };

  const settings = [
    { key: 'largeText', label: 'Large Text', desc: 'Increases the size of all text' },
    { key: 'highContrast', label: 'High Contrast', desc: 'Maximizes contrast between text and background' },
    { key: 'reducedMotion', label: 'Reduced Motion', desc: 'Disables animations and transitions' },
    { key: 'voiceFeedback', label: 'Voice Feedback', desc: 'Reads important actions and results aloud' },
    { key: 'captions', label: 'Always Show Captions', desc: 'Provides text for audio events' },
    { key: 'simplifiedLanguage', label: 'Simplified Language', desc: 'Automatically simplifies complex information' },
    { key: 'hapticFeedback', label: 'Haptic Feedback', desc: 'Provides physical feedback on interactions' },
  ] as const;

  return (
    <div className="flex flex-col px-6 pt-12 pb-32 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Profile</h1>
        <p className="text-xl text-muted-foreground font-medium">Customize Auxilia to work best for you.</p>
      </header>

      {mounted && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
          <div className="bg-card border border-border/50 rounded-3xl p-2 flex shadow-sm">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl font-semibold transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              <Sun size={20} /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl font-semibold transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              <Moon size={20} /> Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl font-semibold transition-all ${theme === 'system' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              <Monitor size={20} /> System
            </button>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Accessibility Features</h2>
        <div className="space-y-3">
          {settings.map(({ key, label, desc }, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={key} 
              className={`flex items-center justify-between p-5 border border-border/50 rounded-3xl transition-all cursor-pointer ${profile[key] ? 'bg-primary/5 border-primary/30' : 'bg-card hover:border-primary/50'}`}
              onClick={() => toggleSetting(key)}
              role="switch"
              aria-checked={profile[key]}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSetting(key);
                }
              }}
            >
              <div className="pr-4">
                <h3 className="font-bold text-lg">{label}</h3>
                <p className="text-muted-foreground text-sm mt-1">{desc}</p>
              </div>
              <div 
                className={`shrink-0 w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${profile[key] ? 'bg-primary' : 'bg-secondary border border-border'}`}
              >
                <motion.div 
                  layout
                  className={`w-6 h-6 bg-background rounded-full shadow-sm`} 
                  animate={{ x: profile[key] ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <SignedIn>
        <section className="pt-4">
          <SignOutButton>
            <AccessibleButton variant="destructive" size="lg" className="w-full text-lg gap-3">
              <LogOut size={24} />
              Sign Out
            </AccessibleButton>
          </SignOutButton>
        </section>
      </SignedIn>
    </div>
  );
}
