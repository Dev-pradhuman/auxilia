"use client";

import { useState, useRef, useEffect } from "react";
import { CameraOverlay, CameraOverlayRef } from "@/components/ui/CameraOverlay";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { ocrService, ttsService } from "@/services/ai";
import { BookOpen, Volume2, ArrowLeft, Loader2, SquareSquare, Brain, Upload } from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/useProfileStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ReadModePage() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useProfileStore();
  const router = useRouter();
  const cameraRef = useRef<CameraOverlayRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  const processImageSource = async (source: string | File | HTMLVideoElement) => {
    setLoading(true);
    setText(null);
    setError(null);
    try {
      if (profile.voiceFeedback) ttsService.synthesizeSpeech("Scanning document. Please wait.");
      const extractedText = await ocrService.extractText(source);
      setText(extractedText);
      if (profile.voiceFeedback) {
        ttsService.synthesizeSpeech("Text extracted. Ready to read.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to read text.";
      setError(msg);
      if (profile.voiceFeedback) ttsService.synthesizeSpeech(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = () => {
    const video = cameraRef.current?.getVideoElement();
    if (video) {
      processImageSource(video);
    } else {
      setError("Camera not ready.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageSource(file);
    }
  };

  const handleUnderstand = () => {
    if (text) {
      sessionStorage.setItem('auxilia_understand_text', text);
      router.push('/understand');
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6">
      <header className="flex items-center gap-4 mb-4 shrink-0">
        <Link href="/">
          <AccessibleButton variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft size={28} />
          </AccessibleButton>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">Read</h1>
      </header>

      <div className="flex-1 relative flex flex-col gap-4 overflow-hidden rounded-3xl min-h-[300px]">
        {!text && !loading && (
          <CameraOverlay ref={cameraRef} className="flex-1 w-full h-full shadow-lg" />
        )}
        
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md rounded-3xl z-10 border border-border"
            >
               <Loader2 size={48} className="animate-spin text-primary mb-6" />
               <p className="text-xl font-bold">Scanning document...</p>
               <p className="text-muted-foreground mt-2">Running local optical character recognition</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && !loading && (
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-destructive/10 border-2 border-destructive rounded-3xl p-6 text-center">
            <p className="text-xl font-bold text-destructive mb-4">{error}</p>
            <AccessibleButton variant="outline" onClick={() => setError(null)}>Try Again</AccessibleButton>
          </div>
        )}

        {text && !loading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex-1 w-full h-full bg-card border border-border/50 p-6 rounded-3xl shadow-xl overflow-y-auto"
          >
            <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-4 flex items-center justify-between">
              Extracted Text
            </h2>
            <p className="text-2xl font-medium leading-relaxed whitespace-pre-wrap">{text}</p>
          </motion.div>
        )}
      </div>

      <div className="mt-4 shrink-0 space-y-3">
        {!text ? (
          <>
            <AccessibleButton 
              variant="default" 
              size="xl" 
              className="w-full gap-3 text-xl shadow-xl"
              onClick={handleScan}
              disabled={loading}
            >
              <BookOpen size={28} />
              Scan Camera
            </AccessibleButton>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <AccessibleButton 
              variant="secondary" 
              size="lg" 
              className="w-full gap-3 text-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload size={24} />
              Upload Image
            </AccessibleButton>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
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
              className="flex-col gap-2 h-24 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-transparent"
              onClick={handleUnderstand}
            >
              <Brain size={28} />
              <span>Understand</span>
            </AccessibleButton>
            <AccessibleButton 
              variant="outline" 
              className="col-span-2 gap-2 h-16"
              onClick={() => { setText(null); ttsService.stop(); }}
            >
              <SquareSquare size={24} />
              Scan Another
            </AccessibleButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
