"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tools", label: "Tools", icon: LayoutGrid },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: "/profile", label: "Profile", icon: Settings },
  ];

  // We hide nav on certain immersive screens or onboarding if desired,
  // but for Auxilia, a consistent nav is good unless in a specific fullscreen tool.
  // For now, let's keep it visible everywhere, or hide on pure camera tools?
  // Let's keep it simple and accessible.

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t border-border flex items-center justify-around px-4 z-50">
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
              "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-colors",
              isActive ? "text-primary font-bold" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <Icon size={28} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
