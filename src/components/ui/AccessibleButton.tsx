"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/useProfileStore";

export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "card";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  asChild?: boolean;
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    
    // We can inject extra a11y handlers here, e.g. haptic feedback on click
    const { profile } = useProfileStore();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (profile.hapticFeedback && typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
      if (props.onClick) {
        props.onClick(e);
      }
    };

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      card: "bg-card text-card-foreground shadow-sm hover:shadow-md border border-border flex-col gap-4 items-center justify-center aspect-square"
    };

    const sizes = {
      default: "h-12 px-6 py-2",
      sm: "h-10 rounded-lg px-4 text-sm",
      lg: "h-14 rounded-2xl px-8 text-lg",
      xl: "h-20 rounded-2xl px-10 text-xl",
      icon: "h-12 w-12",
    };

    const variantClass = variants[variant];
    const sizeClass = variant === "card" ? "p-4" : sizes[size];

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
