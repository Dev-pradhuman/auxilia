"use client";

import { useErrorStore } from "@/store/useErrorStore";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { AlertTriangle, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RateLimitDialog() {
  const { showRateLimitDialog, closeRateLimitDialog } = useErrorStore();

  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || "#";

  return (
    <AnimatePresence>
      {showRateLimitDialog && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card border-2 border-border shadow-2xl rounded-3xl p-6 max-w-sm w-full relative"
          >
            <button 
              onClick={closeRateLimitDialog}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-secondary rounded-full"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">API Limit Reached</h2>
              <p className="text-muted-foreground mb-6">
                The Groq API limit has been reached across all provided keys. Please message the developer to resolve this.
              </p>
              
              <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <AccessibleButton variant="default" className="w-full gap-2">
                  Contact Developer <ExternalLink size={18} />
                </AccessibleButton>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
