"use client";

import { useState } from "react";
import { CameraOverlay } from "@/components/ui/CameraOverlay";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { ocrService, ttsService } from "@/services/ai";
import { BookOpen, Volume2, ArrowLeft, Loader2, SquareSquare, Brain } from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/useProfileStore";
import { useRouter } from "next/navigation";

export default function ReadModePage() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const { profile } = useProfileStore();
  const router = useRouter();

  const handleScan = async () => {
    setLoading(true);
    setText(null);
    try {
      const extractedText = await ocrService.extractText("mock-image-data");
      setText(extractedText);
      if (profile.voiceFeedback) {
        ttsService.synthesizeSpeech("Text extracted. Ready to read.");
      }
    } catch (err) {
      setText("Unable to read text.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnderstand = () => {
    if (text) {
      // Pass the text to understand mode
      sessionStorage.setItem('aura_understand_text', text);
      router.push('/understand');
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
        <h1 className="text-2xl font-bold tracking-tight flex-1">Read</h1>
      </header>

      <div className="flex-1 relative flex flex-col gap-4 overflow-hidden rounded-3xl">
        {!text && !loading && (
          <CameraOverlay className="flex-1 w-full h-full" />
        )}
        
        {loading && (
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-muted/30 border-2 border-border rounded-3xl">
             <Loader2 size={48} className="animate-spin text-primary mb-4" />
             <p className="text-xl font-medium animate-pulse">Scanning document...</p>
          </div>
        )}

        {text && !loading && (
          <div className="flex-1 w-full h-full bg-card border-2 border-border p-6 rounded-3xl shadow-sm overflow-y-auto">
            <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-4">Extracted Text</h2>
            <p className="text-2xl font-medium leading-relaxed whitespace-pre-wrap">{text}</p>
          </div>
        )}
      </div>

      <div className="mt-4 shrink-0">
        {!text ? (
          <AccessibleButton 
            variant="default" 
            size="xl" 
            className="w-full gap-3"
            onClick={handleScan}
            disabled={loading}
          >
            <BookOpen size={28} />
            Scan Document
          </AccessibleButton>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <AccessibleButton 
              variant="default" 
              className="flex-col gap-2 h-24"
              onClick={() => ttsService.synthesizeSpeech(text)}
            >
              <Volume2 size={28} />
              <span>Read Aloud</span>
            </AccessibleButton>
            <AccessibleButton 
              variant="secondary" 
              className="flex-col gap-2 h-24"
              onClick={handleUnderstand}
            >
              <Brain size={28} />
              <span>Understand</span>
            </AccessibleButton>
            <AccessibleButton 
              variant="outline" 
              className="col-span-2 gap-2 h-16"
              onClick={() => setText(null)}
            >
              <SquareSquare size={24} />
              Scan Another
            </AccessibleButton>
          </div>
        )}
      </div>
    </div>
  );
}
