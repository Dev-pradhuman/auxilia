"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { AccessibleButton } from "@/components/ui/AccessibleButton";

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore();

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
    <div className="flex flex-col px-6 pt-12 pb-24 max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Accessibility Profile</h1>
        <p className="text-xl text-muted-foreground font-medium">Customize Auxilia to work best for you.</p>
      </header>

      <div className="space-y-4">
        {settings.map(({ key, label, desc }) => (
          <div 
            key={key} 
            className="flex items-center justify-between p-4 border-2 border-border rounded-2xl bg-card transition-colors hover:border-primary/50 cursor-pointer"
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
              <h3 className="font-semibold text-xl">{label}</h3>
              <p className="text-muted-foreground mt-1">{desc}</p>
            </div>
            <div 
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${profile[key] ? 'bg-primary' : 'bg-muted'}`}
            >
              <div 
                className={`w-6 h-6 bg-background rounded-full shadow-md transform transition-transform ${profile[key] ? 'translate-x-6' : 'translate-x-0'}`} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
         <AccessibleButton variant="secondary" size="lg" className="w-full text-lg">
           Save and Return
         </AccessibleButton>
      </div>
    </div>
  );
}
