"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, BookOpen, Ear, Mic, Brain, TriangleAlert, Clock, ArrowRight, Sparkles } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Home() {
  const { profile } = useProfileStore();
  const { user, isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) return null;

  const coreTools = [
    { label: "See", icon: Eye, href: "/see", desc: "Understand your surroundings" },
    { label: "Read", icon: BookOpen, href: "/read", desc: "Read text aloud" },
    { label: "Hear", icon: Ear, href: "/hear", desc: "Live captions & sound alerts" },
    { label: "Speak", icon: Mic, href: "/speak", desc: "Communicate with others" },
    { label: "Understand", icon: Brain, href: "/understand", desc: "Simplify complex info" },
    { label: "Help", icon: TriangleAlert, href: "/help", desc: "Emergency & assistance", variant: "destructive" as const },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col px-6 pt-12 pb-32 space-y-12">
      
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Good morning{user ? `, ${user.firstName}` : ''}.
            </h1>
            <p className="text-xl text-muted-foreground font-medium mt-1">What do you need help with?</p>
          </motion.div>
        </div>
        <div className="shadow-lg rounded-full shrink-0 border border-border/50">
          {isSignedIn ? (
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-12 h-12" } }} />
          ) : (
            <SignInButton mode="modal">
              <AccessibleButton variant="secondary" size="icon" className="w-12 h-12 rounded-full">
                <Sparkles size={20} />
              </AccessibleButton>
            </SignInButton>
          )}
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {coreTools.map((tool) => (
          <motion.div variants={item} key={tool.label}>
            <Link href={tool.href} className="block w-full">
              <AccessibleButton
                variant={tool.variant || "card"}
                className={`w-full h-44 ${tool.variant === 'destructive' ? 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive hover:text-white' : ''}`}
                aria-label={`Open ${tool.label} tool. ${tool.desc}`}
              >
                <div className={`p-4 rounded-full mb-2 ${tool.variant === 'destructive' ? 'bg-destructive/20' : 'bg-primary/5 text-primary'}`}>
                  <tool.icon size={36} strokeWidth={2} aria-hidden="true" />
                </div>
                <span className="text-xl font-bold tracking-wide">{tool.label}</span>
              </AccessibleButton>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-5"
      >
        <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
        <div className="flex flex-col gap-3">
          <AccessibleButton variant="secondary" size="lg" className="justify-start gap-5 w-full h-16 group">
            <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Eye size={20} />
            </div>
            <span className="flex-1 text-left font-semibold">Describe my surroundings</span>
            <ArrowRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </AccessibleButton>
          <AccessibleButton variant="secondary" size="lg" className="justify-start gap-5 w-full h-16 group">
            <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <BookOpen size={20} />
            </div>
            <span className="flex-1 text-left font-semibold">Read the nearest text</span>
            <ArrowRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </AccessibleButton>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-5"
      >
        <h2 className="text-2xl font-bold tracking-tight">Recent</h2>
        <div className="bg-card rounded-3xl p-6 flex flex-col gap-4 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Clock size={100} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
              <Clock size={28} />
            </div>
            <div>
              <p className="font-bold text-xl">Translation</p>
              <p className="text-muted-foreground mt-1 font-medium">"Where is the accessible entrance?"</p>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
