"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { CameraOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CameraOverlayRef {
  getVideoElement: () => HTMLVideoElement | null;
}

interface CameraOverlayProps {
  className?: string;
}

export const CameraOverlay = forwardRef<CameraOverlayRef, CameraOverlayProps>(
  ({ className }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      getVideoElement: () => videoRef.current
    }));

    useEffect(() => {
      async function setupCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white/40 rounded-3xl flex flex-col justify-between p-2">
             <div className="flex justify-between w-full">
               <div className="w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-lg" />
               <div className="w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-lg" />
             </div>
             <div className="flex justify-between w-full">
               <div className="w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-lg" />
               <div className="w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-lg" />
             </div>
          </div>
        </div>
      </div>
    );
  }
);
CameraOverlay.displayName = "CameraOverlay";
