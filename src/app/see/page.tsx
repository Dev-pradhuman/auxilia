"use client";

import { useState } from "react";
import { CameraOverlay } from "@/components/ui/CameraOverlay";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { visionService, ttsService } from "@/services/ai";
import { Eye, BookOpen, Volume2, Search, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/useProfileStore";

export default function SeeModePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { profile } = useProfileStore();

  const handleAction = async (prompt?: string) => {
    setLoading(true);
    setResult(null);
    try {
      const description = await visionService.analyzeImage("mock-image-data", prompt);
      setResult(description);
      if (profile.voiceFeedback) {
        ttsService.synthesizeSpeech(description);
      }
    } catch (err) {
      setResult("Unable to process the image at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] px-4 pt-4 pb-6 max-w-2xl mx-auto">
      <header className="flex items-center gap-4 mb-4">
        <Link href="/">
          <AccessibleButton variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft size={28} />
          </AccessibleButton>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">See</h1>
      </header>

      <div className="flex-1 relative flex flex-col gap-4">
        <CameraOverlay className="flex-1 w-full" />
        
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-3xl">
             <Loader2 size={48} className="animate-spin text-primary mb-4" />
             <p className="text-xl font-medium animate-pulse">Analyzing surroundings...</p>
          </div>
        )}

        {result && !loading && (
          <div className="absolute bottom-24 left-4 right-4 bg-background border-2 border-border p-6 rounded-2xl shadow-xl z-10">
            <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-2">Description</h2>
            <p className="text-xl font-medium leading-relaxed">{result}</p>
            <div className="mt-6 flex gap-3">
              <AccessibleButton 
                variant="secondary" 
                size="sm" 
                className="flex-1 text-base py-6"
                onClick={() => ttsService.synthesizeSpeech(result)}
              >
                <Volume2 className="mr-2" /> Read Aloud
              </AccessibleButton>
              <AccessibleButton 
                variant="outline" 
                size="sm" 
                className="flex-1 text-base py-6"
                onClick={() => setResult(null)}
              >
                Dismiss
              </AccessibleButton>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 shrink-0">
        <AccessibleButton 
          variant="secondary" 
          className="flex-col gap-2 h-24"
          onClick={() => handleAction()}
          disabled={loading}
        >
          <Eye size={28} />
          <span>Describe</span>
        </AccessibleButton>
        <AccessibleButton 
          variant="secondary" 
          className="flex-col gap-2 h-24"
          onClick={() => handleAction("Read text")}
          disabled={loading}
        >
          <BookOpen size={28} />
          <span>Read Text</span>
        </AccessibleButton>
        <AccessibleButton 
          variant="secondary" 
          className="flex-col gap-2 h-24"
          onClick={() => handleAction("What is near me?")}
          disabled={loading}
        >
          <Search size={28} />
          <span>Near Me</span>
        </AccessibleButton>
      </div>
    </div>
  );
}
