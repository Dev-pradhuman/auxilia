import Tesseract from 'tesseract.js';
import { useErrorStore } from '@/store/useErrorStore';

export const visionService = {
  analyzeImage: async (imageData: string | HTMLVideoElement, prompt?: string): Promise<string> => {
    
    let base64 = imageData as string;
    
    if (imageData instanceof HTMLVideoElement) {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 800 / Math.max(imageData.videoWidth, imageData.videoHeight));
      canvas.width = imageData.videoWidth * scale;
      canvas.height = imageData.videoHeight * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");
      ctx.drawImage(imageData, 0, 0, canvas.width, canvas.height);
      base64 = canvas.toDataURL('image/jpeg', 0.8);
    }

    const res = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        imageBase64: base64, 
        prompt: prompt || "Describe the key elements in this environment clearly for someone with visual impairment." 
      })
    });

    if (res.status === 429) {
      useErrorStore.getState().triggerRateLimitError();
      throw new Error("RATE_LIMIT_REACHED");
    }
    if (!res.ok) throw new Error("Failed to analyze image.");

    const data = await res.json();
    return data.result;
  },
};

export const ocrService = {
  extractText: async (imageSource: string | File | HTMLVideoElement): Promise<string> => {
    try {
      let src = imageSource;
      if (imageSource instanceof HTMLVideoElement) {
        const canvas = document.createElement('canvas');
        canvas.width = imageSource.videoWidth;
        canvas.height = imageSource.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(imageSource, 0, 0, canvas.width, canvas.height);
        src = canvas.toDataURL('image/png');
      }
      
      const { data: { text } } = await Tesseract.recognize(src as any, 'eng');
      return text.trim() || "No text could be found in the image.";
    } catch (e) {
      console.error(e);
      throw new Error("OCR failed. Please try again with a clearer image.");
    }
  },
};

export const speechService = {
  transcribeAudio: async (audioData: Blob): Promise<string> => {
    await new Promise((r) => setTimeout(r, 1000));
    return "This is a placeholder for server-side transcription.";
  }
};

export const ttsService = {
  synthesizeSpeech: async (text: string, rate: number = 1): Promise<void> => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  },
  pause: () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  },
  resume: () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  },
  stop: () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};

export const translationService = {
  translateText: async (text: string, targetLanguage: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 1000));
    return `[Translated to ${targetLanguage}]: ${text}`;
  }
};

export const simplificationService = {
  simplifyText: async (text: string, mode: 'SIMPLE' | 'STEP_BY_STEP' | 'KEY_POINTS'): Promise<string> => {
    let prompt = "";
    if (mode === 'STEP_BY_STEP') {
      prompt = `Turn the following complex text into a simple step-by-step guide with numbered bullet points:\n\n${text}`;
    } else if (mode === 'KEY_POINTS') {
      prompt = `Extract the most important key points from the following text as a short bulleted list:\n\n${text}`;
    } else {
      prompt = `Explain the following complex text in extremely simple, easy to understand language for a beginner:\n\n${text}`;
    }

    const res = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mode: 'UNDERSTAND' })
    });

    if (res.status === 429) {
      useErrorStore.getState().triggerRateLimitError();
      throw new Error("RATE_LIMIT_REACHED");
    }
    if (!res.ok) throw new Error("Failed to simplify text.");

    const data = await res.json();
    return data.result;
  }
};

export const soundDetectionService = {
  startListening: async (onSoundDetected: (sound: string, confidence: string) => void) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
      
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      
      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      
      let lastDetectedTime = 0;

      scriptProcessor.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;
        const length = array.length;
        for (let i = 0; i < length; i++) {
          values += (array[i]);
        }
        const average = values / length;
        
        if (average > 50 && Date.now() - lastDetectedTime > 5000) {
          lastDetectedTime = Date.now();
          onSoundDetected("Loud Noise Detected", "HIGH");
        }
      };

      return () => {
        scriptProcessor.disconnect();
        analyser.disconnect();
        microphone.disconnect();
        stream.getTracks().forEach(t => t.stop());
      };
    } catch (e) {
      console.error("Microphone permission denied", e);
      throw e;
    }
  }
};
