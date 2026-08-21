"use client";

import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { ArrowLeft, Phone, MapPin, BadgeInfo, UserRound, ShieldAlert, Volume2, Save, X, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ttsService } from "@/services/ai";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpModePage() {
  const [trustedContact, setTrustedContact] = useState<string>("");
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('auxilia_trusted_contact');
    if (saved) setTrustedContact(saved);
  }, []);

  const saveContact = (number: string) => {
    setTrustedContact(number);
    localStorage.setItem('auxilia_trusted_contact', number);
    setIsEditingContact(false);
  };

  const handleCallEmergency = () => {
    ttsService.synthesizeSpeech("Calling National Emergency Services.");
    window.location.href = "tel:112"; // 112 is India's all-in-one emergency number
  };

  const handleCallTrusted = () => {
    if (trustedContact) {
      ttsService.synthesizeSpeech("Calling Trusted Contact.");
      window.location.href = `tel:${trustedContact}`;
    } else {
      setIsEditingContact(true);
    }
  };

  const handleShareLocation = () => {
    ttsService.synthesizeSpeech("Locating your position.");
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const mapsUrl = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        const message = `I need help. My current location is: ${mapsUrl}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title: "Emergency Location Share",
              text: "I need help. My current location is:",
              url: mapsUrl
            });
            ttsService.synthesizeSpeech("Location shared successfully.");
          } catch (e) {
            console.error("Error sharing", e);
          }
        } else {
          // Fallback to clipboard
          navigator.clipboard.writeText(message);
          ttsService.synthesizeSpeech("Location link copied to clipboard.");
          alert("Location copied to clipboard:\n\n" + mapsUrl);
        }
      },
      (err) => {
        console.error(err);
        setLocationError("Could not retrieve your location. Please check your permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleSiren = () => {
    if (isAlarmPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setIsAlarmPlaying(false);
    } else {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      // Create a siren effect by modulating frequency rapidly
      for (let i = 0; i < 300; i++) {
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + (i * 0.5) + 0.25);
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + (i * 0.5) + 0.5);
      }
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1); // Max volume
      
      osc.start();
      oscillatorRef.current = osc;
      setIsAlarmPlaying(true);
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6 overflow-y-auto custom-scrollbar relative">
      <header className="flex items-center gap-4 mb-6">
        <Link href="/">
          <AccessibleButton variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft size={28} />
          </AccessibleButton>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex-1">Help</h1>
      </header>

      <div className="space-y-6">
        
        {/* Real Emergency Calls */}
        <section className="bg-destructive/10 border-2 border-destructive/20 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 text-destructive mb-3">
            <ShieldAlert size={28} />
            <h2 className="text-xl font-bold">Emergency (India)</h2>
          </div>
          <p className="text-muted-foreground font-medium mb-6">Instantly dial the National Emergency Number (112) for Police, Fire, and Ambulance.</p>
          
          <AccessibleButton 
            variant="destructive" 
            size="xl" 
            className="w-full gap-4 justify-center text-xl shadow-xl shadow-destructive/20"
            onClick={handleCallEmergency}
          >
            <Phone size={32} />
            Dial 112
          </AccessibleButton>
        </section>

        {/* Real Location Sharing */}
        <section className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 text-primary mb-3">
            <MapPin size={28} />
            <h2 className="text-xl font-bold">Share Location</h2>
          </div>
          <p className="text-muted-foreground font-medium mb-6">Grab your precise GPS coordinates and send them via WhatsApp, SMS, or copy them.</p>
          
          {locationError && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-semibold">
              {locationError}
            </div>
          )}

          <AccessibleButton 
            variant="default" 
            size="lg" 
            className="w-full gap-3 text-lg"
            onClick={handleShareLocation}
          >
            Send My GPS Location
          </AccessibleButton>
        </section>

        {/* Trusted Contact (Save functionality) */}
        <section className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm relative">
          <div className="flex items-center gap-3 text-primary mb-3">
            <UserRound size={28} />
            <h2 className="text-xl font-bold">Trusted Contact</h2>
          </div>
          <p className="text-muted-foreground font-medium mb-6">Call a trusted friend or family member.</p>
          
          {isEditingContact ? (
             <div className="flex flex-col gap-3">
                <input 
                  type="tel" 
                  placeholder="Enter phone number..."
                  className="w-full h-14 px-4 rounded-xl border-2 border-primary bg-background focus:outline-none text-xl font-bold"
                  defaultValue={trustedContact}
                  id="contact-input"
                />
                <div className="flex gap-2">
                  <AccessibleButton 
                    variant="default" 
                    className="flex-1"
                    onClick={() => {
                      const val = (document.getElementById('contact-input') as HTMLInputElement).value;
                      if (val) saveContact(val);
                    }}
                  >
                    <Save size={20} className="mr-2" /> Save
                  </AccessibleButton>
                  <AccessibleButton variant="secondary" onClick={() => setIsEditingContact(false)}>
                    Cancel
                  </AccessibleButton>
                </div>
             </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AccessibleButton 
                variant="secondary" 
                size="lg" 
                className="w-full gap-3 text-lg"
                onClick={handleCallTrusted}
              >
                <Phone size={24} />
                {trustedContact ? `Call ${trustedContact}` : "Set Up Contact"}
              </AccessibleButton>
              {trustedContact && (
                <button 
                  onClick={() => setIsEditingContact(true)}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Edit Number
                </button>
              )}
            </div>
          )}
        </section>

        {/* Loud Siren Alarm */}
        <section className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 text-orange-500 mb-3">
            <Volume2 size={28} />
            <h2 className="text-xl font-bold">Sound Alarm</h2>
          </div>
          <p className="text-muted-foreground font-medium mb-6">Play a loud, continuous siren sound to draw attention if you are in danger.</p>
          
          <AccessibleButton 
            variant={isAlarmPlaying ? "default" : "outline"}
            size="lg" 
            className={`w-full gap-3 text-lg ${isAlarmPlaying ? 'bg-orange-500 hover:bg-orange-600 text-white border-transparent' : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
            onClick={toggleSiren}
          >
            {isAlarmPlaying ? "Stop Alarm" : "Trigger Loud Siren"}
          </AccessibleButton>
        </section>
        
      </div>
    </div>
  );
}
