"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraOverlayProps {
  className?: string;
}

export function CameraOverlay({ className }: CameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" } // Prefer back camera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied or failed", err);
        setHasPermission(false);
        setError("Camera access is needed for visual assistance.");
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (hasPermission === false) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-muted/30 border-2 border-dashed border-border rounded-3xl", className)}>
        <CameraOff size={48} className="text-muted-foreground mb-4" />
        <p className="text-lg font-semibold">{error}</p>
        <p className="text-muted-foreground mt-2">Please enable camera access in your browser settings to use this feature.</p>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-black", className)}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="object-cover w-full h-full opacity-80"
      />
      {/* Target reticle for aesthetics/guidance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 border-2 border-white/30 rounded-2xl flex items-center justify-center">
          <div className="w-2 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
