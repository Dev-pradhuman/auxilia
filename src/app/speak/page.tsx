"use client";

import { useState, useEffect } from "react";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { ttsService } from "@/services/ai";
import { Mic, ArrowLeft, Volume2, MessageSquarePlus, X, Plus, Trash2, Square } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SpeakModePage() {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('auxilia_phrases');
    if (saved) {
      setPhrases(JSON.parse(saved));
    } else {
      setPhrases([
        "I need help.",
        "Yes, thank you.",
        "No, thank you.",
        "Please speak slowly.",
        "I cannot hear you well.",
        "Where is the restroom?"
      ]);
    }
  }, []);

  const savePhrases = (newPhrases: string[]) => {
    setPhrases(newPhrases);
    localStorage.setItem('auxilia_phrases', JSON.stringify(newPhrases));
  };

  const handleSpeak = (phrase: string) => {
    setIsSpeaking(true);
    ttsService.synthesizeSpeech(phrase, 1);
    
    // Check when speech ends (hacky check since we abstracted it, better to listen to utterance end event in a real app, 
    // but we can just timeout or let the user click stop manually).
    setTimeout(() => setIsSpeaking(false), Math.max(2000, phrase.length * 50));
  };

  const handleStop = () => {
    ttsService.stop();
    setIsSpeaking(false);
  };

  const addPhrase = () => {
    if (newPhrase.trim()) {
      savePhrases([newPhrase.trim(), ...phrases]);
      setNewPhrase("");
      setIsAdding(false);
    }
  };

  const removePhrase = (index: number) => {
    const p = [...phrases];
    p.splice(index, 1);
    savePhrases(p);
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6">
      <header className="flex items-center gap-4 mb-4 shrink-0">
        <Link href="/">
          <AccessibleButton variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft size={28} />
          </AccessibleButton>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">Speak</h1>
      </header>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="relative shrink-0">
          <textarea
            className="w-full h-32 p-6 rounded-3xl border border-border/50 bg-card shadow-sm text-2xl font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary resize-none pr-16"
            placeholder="Type what you want to say..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text && (
            <button 
              onClick={() => setText("")}
              className="absolute top-4 right-4 p-2 bg-muted rounded-full text-muted-foreground hover:bg-secondary transition-colors"
              aria-label="Clear text"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <AccessibleButton 
            variant="default" 
            size="xl" 
            className="gap-3 text-xl col-span-2 shadow-xl"
            onClick={() => handleSpeak(text)}
            disabled={!text}
          >
            <Volume2 size={28} />
            <span className="font-bold">Speak</span>
          </AccessibleButton>
          
          <AccessibleButton 
            variant="destructive" 
            className="gap-2 h-14"
            onClick={handleStop}
            disabled={!isSpeaking}
          >
            <Square size={20} fill="currentColor" /> Stop
          </AccessibleButton>

          <AccessibleButton 
            variant="secondary" 
            className="gap-2 h-14"
            onClick={() => {
              if (text && !phrases.includes(text)) {
                savePhrases([text, ...phrases]);
                setText("");
              }
            }}
            disabled={!text || phrases.includes(text)}
          >
            <Plus size={20} /> Save Phrase
          </AccessibleButton>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquarePlus size={20} className="text-primary" /> Communication Board
            </h2>
            <AccessibleButton variant="ghost" size="sm" onClick={() => setIsAdding(!isAdding)}>
              {isAdding ? "Cancel" : "Add Custom"}
            </AccessibleButton>
          </div>

          {isAdding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 flex gap-2">
              <input 
                type="text" 
                value={newPhrase} 
                onChange={e => setNewPhrase(e.target.value)}
                placeholder="Type a new custom phrase..."
                className="flex-1 h-12 px-4 rounded-xl border border-border bg-card"
                onKeyDown={e => e.key === 'Enter' && addPhrase()}
              />
              <AccessibleButton variant="default" onClick={addPhrase}>Add</AccessibleButton>
            </motion.div>
          )}

          <div className="flex flex-col gap-3 pb-4">
            {phrases.map((phrase, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                key={`${phrase}-${i}`} 
                className="flex items-center gap-2"
              >
                <AccessibleButton 
                  variant="secondary"
                  className="flex-1 text-left h-auto py-5 px-6 text-xl font-medium justify-start shadow-sm hover:shadow-md bg-card border border-border/50"
                  onClick={() => handleSpeak(phrase)}
                >
                  {phrase}
                </AccessibleButton>
                <AccessibleButton variant="ghost" size="icon" className="shrink-0 text-destructive/50 hover:text-destructive hover:bg-destructive/10" onClick={() => removePhrase(i)}>
                  <Trash2 size={20} />
                </AccessibleButton>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
