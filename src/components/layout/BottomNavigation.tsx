"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNavigation() {
  const pathname = usePathname();

  // Hide on auth pages
  if (pathname.includes("/sign-in") || pathname.includes("/sign-up")) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: "/profile", label: "Profile", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass rounded-full px-2 py-2 z-50 flex items-center justify-between">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-14 rounded-full transition-all duration-300",
              isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-secondary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
              <span className="text-[10px] mt-1 font-semibold tracking-wide">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
