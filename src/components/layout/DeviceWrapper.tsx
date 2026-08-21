"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Smartphone, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function DeviceWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 lg:p-8 transition-colors duration-500">
      
      {/* External Controls for Judges/Users */}
      <div className="fixed top-6 left-6 z-[100] flex flex-col gap-4 bg-background/80 backdrop-blur-md border border-border p-4 rounded-3xl shadow-2xl">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">View Mode</p>
          <div className="flex bg-secondary p-1 rounded-2xl">
            <button
              onClick={() => setIsMobile(true)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isMobile ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Smartphone size={16} /> Mobile
            </button>
            <button
              onClick={() => setIsMobile(false)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!isMobile ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Monitor size={16} /> Laptop
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Theme</p>
          <div className="flex bg-secondary p-1 rounded-2xl">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Sun size={16} /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Moon size={16} /> Dark
            </button>
          </div>
        </div>
      </div>

      {/* Device Frame */}
      <motion.div 
        layout
        initial={false}
        animate={{
          maxWidth: isMobile ? "400px" : "1200px",
          height: isMobile ? "850px" : "800px",
          borderRadius: isMobile ? "3rem" : "1.5rem",
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
        className={`relative w-full bg-background shadow-2xl overflow-hidden flex flex-col ${isMobile ? 'border-[14px] border-foreground/10' : 'border border-border'}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
