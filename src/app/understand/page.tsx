"use client";

import { useState, useEffect } from "react";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { simplificationService, ttsService } from "@/services/ai";
import { Brain, ArrowLeft, Loader2, FileText, List, Sparkles } from "lucide-react";
import Link from "next/link";

export default function UnderstandModePage() {
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'SIMPLE' | 'STEP_BY_STEP' | 'KEY_POINTS'>('SIMPLE');

  useEffect(() => {
    // Check if we came from READ mode with text
    const savedText = sessionStorage.getItem('aura_understand_text');
    if (savedText) {
      setOriginalText(savedText);
      sessionStorage.removeItem('aura_understand_text');
    }
  }, []);

  const handleSimplify = async (selectedMode: 'SIMPLE' | 'STEP_BY_STEP' | 'KEY_POINTS') => {
    if (!originalText) return;
    
    setMode(selectedMode);
    setLoading(true);
    try {
      const simplified = await simplificationService.simplifyText(originalText, selectedMode);
      setResult(simplified);
    } catch (err) {
      setResult("Unable to simplify text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-4 pt-4 pb-24 max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/">
          <AccessibleButton variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft size={28} />
          </AccessibleButton>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">Understand</h1>
      </header>

      {!result && !loading && (
        <div className="space-y-4">
          <label className="block text-xl font-semibold">What do you want to understand?</label>
          <textarea 
            className="w-full h-48 p-4 rounded-2xl border-2 border-border bg-card text-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary resize-none"
            placeholder="Type or paste complex text here..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
          
          <div className="grid grid-cols-1 gap-3">
            <AccessibleButton 
              variant="default" 
              size="lg"
              className="justify-start gap-4"
              onClick={() => handleSimplify('SIMPLE')}
              disabled={!originalText}
            >
              <Sparkles size={24} />
              Make it simple
            </AccessibleButton>
            <AccessibleButton 
              variant="secondary" 
              size="lg"
              className="justify-start gap-4"
              onClick={() => handleSimplify('STEP_BY_STEP')}
              disabled={!originalText}
            >
              <List size={24} />
              Turn into step-by-step
            </AccessibleButton>
            <AccessibleButton 
              variant="secondary" 
              size="lg"
              className="justify-start gap-4"
              onClick={() => handleSimplify('KEY_POINTS')}
              disabled={!originalText}
            >
              <FileText size={24} />
              Extract key points
            </AccessibleButton>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-muted/30 rounded-3xl border-2 border-border mt-8">
           <Loader2 size={48} className="animate-spin text-primary mb-4" />
           <p className="text-xl font-medium animate-pulse">Simplifying information...</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          <div className="bg-primary/10 text-primary border border-primary/20 p-3 rounded-xl flex items-center gap-3">
            <Sparkles size={20} />
            <span className="font-semibold">AI-generated simplification</span>
          </div>

          <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-sm">
             <p className="text-2xl font-medium leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <AccessibleButton 
               variant="default"
               size="lg"
               onClick={() => ttsService.synthesizeSpeech(result)}
             >
               Read Aloud
             </AccessibleButton>
             <AccessibleButton 
               variant="outline"
               size="lg"
               onClick={() => setResult(null)}
             >
               Show Original
             </AccessibleButton>
          </div>
        </div>
      )}
    </div>
  );
}
