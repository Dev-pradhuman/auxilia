"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/useProfileStore";
import { motion } from "framer-motion";

export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "card";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  asChild?: boolean;
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    
    const { profile } = useProfileStore();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (profile.hapticFeedback && typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
      if (props.onClick) {
        props.onClick(e);
      }
    };

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90",
      outline: "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      card: "bg-card text-card-foreground shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.04)] border border-border/50 flex-col gap-4 items-center justify-center aspect-square transition-all hover:-translate-y-1"
    };

    const sizes = {
      default: "h-12 px-6 py-2",
      sm: "h-10 px-4 text-sm rounded-xl",
      lg: "h-14 px-8 text-lg rounded-2xl",
      xl: "h-20 px-10 text-xl rounded-3xl",
      icon: "h-12 w-12 rounded-2xl",
    };

    const variantClass = variants[variant];
    const sizeClass = variant === "card" ? "p-6 rounded-3xl" : sizes[size];

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantClass, sizeClass, className)}
        {...props}
        onClick={handleClick}
      />
    );
  }
);
AccessibleButton.displayName = "AccessibleButton";

export { AccessibleButton };
