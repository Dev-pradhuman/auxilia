"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, BookOpen, Ear, Mic, Brain, TriangleAlert, Clock, ArrowRight } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { AccessibleButton } from "@/components/ui/AccessibleButton";

export default function Home() {
  const { profile, hasCompletedOnboarding } = useProfileStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Ideally, if !hasCompletedOnboarding, we redirect to /onboarding or show onboarding.
  // For the hackathon, we'll assume they can access tools immediately and configure in /profile.

  const coreTools = [
    { label: "See", icon: Eye, href: "/see", desc: "Understand your surroundings" },
    { label: "Read", icon: BookOpen, href: "/read", desc: "Read text aloud" },
    { label: "Hear", icon: Ear, href: "/hear", desc: "Live captions & sound alerts" },
    { label: "Speak", icon: Mic, href: "/speak", desc: "Communicate with others" },
    { label: "Understand", icon: Brain, href: "/understand", desc: "Simplify complex info" },
    { label: "Help", icon: TriangleAlert, href: "/help", desc: "Emergency & assistance", variant: "destructive" as const },
  ];

  return (
    <div className="flex flex-col px-6 pt-12 pb-24 max-w-2xl mx-auto space-y-10">
      
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Good morning.</h1>
        <p className="text-xl text-muted-foreground font-medium">What do you need help with?</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {coreTools.map((tool) => (
          <Link key={tool.label} href={tool.href} className="w-full">
            <AccessibleButton
              variant={tool.variant || "card"}
              className={`w-full h-40 ${tool.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent shadow-md' : ''}`}
              aria-label={`Open ${tool.label} tool. ${tool.desc}`}
            >
              <tool.icon size={48} strokeWidth={1.5} aria-hidden="true" />
              <span className="text-xl mt-2 font-semibold tracking-wide">{tool.label}</span>
            </AccessibleButton>
          </Link>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="flex flex-col gap-3">
          <AccessibleButton variant="secondary" size="lg" className="justify-start gap-4 w-full">
            <Eye className="text-primary" />
            <span className="flex-1 text-left">Describe what's in front of me</span>
            <ArrowRight size={20} className="text-muted-foreground" />
          </AccessibleButton>
          <AccessibleButton variant="secondary" size="lg" className="justify-start gap-4 w-full">
            <BookOpen className="text-primary" />
            <span className="flex-1 text-left">Read the nearest text</span>
            <ArrowRight size={20} className="text-muted-foreground" />
          </AccessibleButton>
          <AccessibleButton variant="secondary" size="lg" className="justify-start gap-4 w-full">
            <Ear className="text-primary" />
            <span className="flex-1 text-left">Start live captions</span>
            <ArrowRight size={20} className="text-muted-foreground" />
          </AccessibleButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Recent</h2>
        <div className="bg-secondary/50 rounded-2xl p-6 flex flex-col gap-4 border border-border">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Clock size={24} />
            </div>
            <div>
              <p className="font-semibold text-lg">Translation</p>
              <p className="text-muted-foreground">"Where is the accessible entrance?"</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
