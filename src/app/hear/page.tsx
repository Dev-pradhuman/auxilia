"use client";

import { useState, useEffect, useRef } from "react";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { soundDetectionService, ttsService } from "@/services/ai";
import { Ear, ArrowLeft, Mic, MicOff, BellRing, Pause, Play, Save } from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/useProfileStore";

export default function HearModePage() {
  const [isListening, setIsListening] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [soundAlert, setSoundAlert] = useState<{ sound: string, confidence: string } | null>(null);
  const { profile } = useProfileStore();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup Web Speech API for live captions if available
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCaptions(prev => [...prev, finalTranscript.trim()]);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setCaptions([]);
      recognitionRef.current?.start();
      setIsListening(true);

      // Also start sound detection for demo
      soundDetectionService.startListening((sound, confidence) => {
        setSoundAlert({ sound, confidence });
        if (profile.voiceFeedback) {
          ttsService.synthesizeSpeech(`${confidence} ${sound} detected.`);
        }
      });
    }
  };

  const handleSpeakAlert = () => {
    ttsService.synthesizeSpeech("Could you please repeat that?");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] px-4 pt-4 pb-6 max-w-2xl mx-auto">
      <header className="flex items-center gap-4 mb-4">
        <Link href="/">
          <AccessibleButton variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft size={28} />
          </AccessibleButton>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">Hear</h1>
      </header>

      {soundAlert && (
        <div className="bg-destructive/10 border-2 border-destructive p-4 rounded-2xl mb-4 flex items-center gap-4">
          <div className="bg-destructive text-destructive-foreground p-3 rounded-full animate-bounce">
            <BellRing size={24} />
          </div>
          <div>
            <p className="font-bold text-lg text-destructive">{soundAlert.confidence} {soundAlert.sound}</p>
            <p className="text-muted-foreground text-sm">Environmental sound detected</p>
          </div>
          <AccessibleButton 
            variant="ghost" 
            size="sm" 
            className="ml-auto text-destructive"
            onClick={() => setSoundAlert(null)}
          >
            Dismiss
          </AccessibleButton>
        </div>
      )}

      <div className="flex-1 bg-card border-2 border-border rounded-3xl p-6 shadow-sm overflow-y-auto flex flex-col gap-4 relative">
        {!isListening && captions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
            <Ear size={64} className="mb-4 opacity-50" />
            <p className="text-xl font-medium">Tap Start to begin live captioning</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {captions.map((cap, i) => (
              <p key={i} className="text-2xl font-medium leading-relaxed bg-secondary/50 p-4 rounded-2xl">
                {cap}
              </p>
            ))}
            {isListening && (
              <p className="text-xl text-muted-foreground italic animate-pulse p-4">Listening...</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 shrink-0">
        <AccessibleButton 
          variant={isListening ? "secondary" : "default"} 
          size="xl" 
          className="w-full gap-3 col-span-2"
          onClick={toggleListening}
        >
          {isListening ? (
            <><Pause size={28} /> Pause Captions</>
          ) : (
            <><Mic size={28} /> Start Captions</>
          )}
        </AccessibleButton>

        <AccessibleButton 
          variant="outline" 
          className="h-16 gap-2"
          onClick={handleSpeakAlert}
        >
          <Ear size={24} />
          Say "Repeat that"
        </AccessibleButton>

        <AccessibleButton 
          variant="outline" 
          className="h-16 gap-2"
          disabled={captions.length === 0}
        >
          <Save size={24} />
          Save Transcript
        </AccessibleButton>
      </div>
    </div>
  );
}
