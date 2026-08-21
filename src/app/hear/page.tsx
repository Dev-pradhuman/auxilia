"use client";

import { useState, useEffect, useRef } from "react";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { soundDetectionService, ttsService } from "@/services/ai";
import { Ear, ArrowLeft, Mic, Pause, Save, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/useProfileStore";
import { motion, AnimatePresence } from "framer-motion";

export default function HearModePage() {
  const [isListening, setIsListening] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [soundAlert, setSoundAlert] = useState<{ sound: string, confidence: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useProfileStore();
  
  const recognitionRef = useRef<any>(null);
  const soundCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
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
        if (event.error === 'not-allowed') {
          setError("Microphone permission denied.");
          stopListening();
        }
      };
      
      recognition.onend = () => {
        // Auto-restart if we are supposed to be listening (handles silent timeouts)
        if (isListening) {
          try { recognition.start(); } catch(e) {}
        }
      };

      recognitionRef.current = recognition;
    } else {
      setError("Speech recognition is not supported in this browser.");
    }

    return () => stopListening();
  }, [isListening]);

  const startListening = async () => {
    setError(null);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      const cleanup = await soundDetectionService.startListening((sound, confidence) => {
        setSoundAlert({ sound, confidence });
        if (profile.voiceFeedback) {
          ttsService.synthesizeSpeech(`${confidence} ${sound} detected.`);
        }
        // Auto dismiss alert after 5s
        setTimeout(() => setSoundAlert(null), 5000);
      });
      soundCleanupRef.current = cleanup;
      setIsListening(true);
    } catch (err) {
      setError("Could not access microphone for live captions and sound detection.");
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    if (soundCleanupRef.current) {
      soundCleanupRef.current();
      soundCleanupRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearCaptions = () => setCaptions([]);

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6">
      <header className="flex items-center gap-4 mb-4 shrink-0">
        <Link href="/">
          <AccessibleButton variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft size={28} />
          </AccessibleButton>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">Hear</h1>
      </header>

      <AnimatePresence>
        {soundAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-destructive/10 border-2 border-destructive p-4 rounded-3xl mb-4 flex items-center gap-4 shadow-xl z-50"
          >
            <div className="bg-destructive text-destructive-foreground p-3 rounded-2xl animate-pulse">
              <AlertTriangle size={28} />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-xl text-destructive uppercase tracking-wide">{soundAlert.sound}</p>
              <p className="text-destructive/80 font-medium text-sm">Environmental sound detected</p>
            </div>
            <AccessibleButton 
              variant="outline" 
              size="sm" 
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setSoundAlert(null)}
            >
              Dismiss
            </AccessibleButton>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 bg-card border border-border/50 rounded-3xl p-6 shadow-sm overflow-y-auto custom-scrollbar flex flex-col gap-4 relative">
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-destructive">
            <AlertTriangle size={48} className="mb-4 opacity-80" />
            <p className="text-xl font-bold">{error}</p>
            <p className="text-muted-foreground mt-2">Check browser permissions.</p>
          </div>
        ) : !isListening && captions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
            <div className="p-8 bg-secondary/50 rounded-full mb-6 border border-border/50">
              <Ear size={64} className="opacity-50" />
            </div>
            <p className="text-2xl font-bold text-foreground">Live Captions</p>
            <p className="text-lg mt-2">Tap Start to begin transcribing speech and detecting loud sounds.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {captions.map((cap, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                key={i} 
                className="bg-secondary/50 border border-border/50 p-5 rounded-2xl"
              >
                <p className="text-2xl font-medium leading-relaxed">{cap}</p>
              </motion.div>
            ))}
            {isListening && (
              <div className="flex items-center gap-3 text-muted-foreground p-4">
                <div className="flex gap-1">
                  <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 bg-primary/50 rounded-full" />
                  <motion.div animate={{ height: [8, 20, 8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 bg-primary/50 rounded-full" />
                  <motion.div animate={{ height: [8, 12, 8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 bg-primary/50 rounded-full" />
                </div>
                <p className="text-lg italic font-medium">Listening...</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 shrink-0">
        <AccessibleButton 
          variant={isListening ? "secondary" : "default"} 
          size="xl" 
          className={`w-full gap-3 col-span-2 shadow-xl ${isListening ? 'bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20' : ''}`}
          onClick={toggleListening}
        >
          {isListening ? (
            <><Pause size={28} /> Stop Listening</>
          ) : (
            <><Mic size={28} /> Start Captions</>
          )}
        </AccessibleButton>

        <AccessibleButton 
          variant="outline" 
          className="h-16 gap-2"
          onClick={clearCaptions}
          disabled={captions.length === 0}
        >
          <Trash2 size={24} />
          Clear
        </AccessibleButton>

        <AccessibleButton 
          variant="outline" 
          className="h-16 gap-2"
          disabled={captions.length === 0}
          onClick={() => {
            const blob = new Blob([captions.join("\n")], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "captions.txt";
            a.click();
          }}
        >
          <Save size={24} />
          Save TXT
        </AccessibleButton>
      </div>
    </div>
  );
}
