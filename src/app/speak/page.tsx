"use client";

import { useState } from "react";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { ttsService } from "@/services/ai";
import { Mic, ArrowLeft, Volume2, MessageSquarePlus, X } from "lucide-react";
import Link from "next/link";

export default function SpeakModePage() {
  const [text, setText] = useState("");

  const quickPhrases = [
    "I need help.",
    "Yes, thank you.",
    "No, thank you.",
    "Please speak slowly.",
    "I cannot hear you well.",
    "Please write that down.",
    "Where is the restroom?",
    "Where is the nearest accessible entrance?"
  ];

  const handleSpeak = (phrase: string) => {
    ttsService.synthesizeSpeech(phrase);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] px-4 pt-4 pb-6 max-w-2xl mx-auto">
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
            className="w-full h-40 p-6 rounded-3xl border-2 border-border bg-card text-2xl font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary resize-none pr-16"
            placeholder="Type what you want to say..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text && (
            <button 
              onClick={() => setText("")}
              className="absolute top-4 right-4 p-2 bg-muted rounded-full text-muted-foreground hover:bg-secondary"
              aria-label="Clear text"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <AccessibleButton 
          variant="default" 
          size="xl" 
          className="w-full gap-3 shrink-0"
          onClick={() => handleSpeak(text)}
          disabled={!text}
        >
          <Volume2 size={32} />
          <span className="text-2xl font-bold">Speak</span>
        </AccessibleButton>

        <div className="mt-4 flex-1 overflow-y-auto">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <MessageSquarePlus size={20} /> Quick Phrases
          </h2>
          <div className="flex flex-wrap gap-3 pb-4">
            {quickPhrases.map((phrase, i) => (
              <AccessibleButton 
                key={i}
                variant="secondary"
                className="text-left h-auto py-4 px-6 text-xl font-medium justify-start"
                onClick={() => handleSpeak(phrase)}
              >
                {phrase}
              </AccessibleButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
