"use client";

import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { ArrowLeft, Phone, MapPin, BadgeInfo, UserRound, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ttsService } from "@/services/ai";

export default function HelpModePage() {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = (action: string, spokenText: string) => {
    setActiveAction(action);
    ttsService.synthesizeSpeech(spokenText);
  };

  return (
    <div className="flex flex-col px-4 pt-4 pb-24 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Link href="/">
          <AccessibleButton variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft size={28} />
          </AccessibleButton>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">Help</h1>
      </header>

      <div className="bg-destructive/10 border-2 border-destructive/20 p-6 rounded-3xl">
        <div className="flex items-center gap-3 text-destructive mb-2">
          <ShieldAlert size={28} />
          <h2 className="text-xl font-bold">Emergency Assistance</h2>
        </div>
        <p className="text-lg mb-6">These actions will connect you with help. They will not silently call emergency services without your explicit confirmation.</p>
        
        <AccessibleButton 
          variant="destructive" 
          size="xl" 
          className="w-full gap-4 justify-start text-xl"
          onClick={() => handleAction('CALL', "Opening phone dialer for emergency services.")}
        >
          <Phone size={32} />
          Call Local Emergency
        </AccessibleButton>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Quick Help Actions</h2>
        
        <AccessibleButton 
          variant="secondary" 
          size="xl" 
          className="w-full gap-4 justify-start text-xl"
          onClick={() => handleAction('LOCATION', "Sharing your current location with trusted contacts.")}
        >
          <MapPin size={32} className="text-primary" />
          Share My Location
        </AccessibleButton>

        <AccessibleButton 
          variant="secondary" 
          size="xl" 
          className="w-full gap-4 justify-start text-xl"
          onClick={() => handleAction('CARD', "Showing accessibility card.")}
        >
          <BadgeInfo size={32} className="text-primary" />
          Show Accessibility Card
        </AccessibleButton>

        <AccessibleButton 
          variant="secondary" 
          size="xl" 
          className="w-full gap-4 justify-start text-xl"
          onClick={() => handleAction('CONTACT', "Calling trusted person.")}
        >
          <UserRound size={32} className="text-primary" />
          Contact Trusted Person
        </AccessibleButton>
      </div>

      {activeAction && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-6">
          <div className="bg-card border-2 border-border rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <ShieldAlert size={64} className="mx-auto text-primary" />
            <h3 className="text-2xl font-bold">Simulating Action</h3>
            <p className="text-lg text-muted-foreground">
              In the real application, this would trigger the {activeAction} action.
            </p>
            <AccessibleButton 
              variant="default" 
              size="lg" 
              className="w-full"
              onClick={() => setActiveAction(null)}
            >
              Close
            </AccessibleButton>
          </div>
        </div>
      )}
    </div>
  );
}
