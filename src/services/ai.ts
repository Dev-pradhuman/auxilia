import Tesseract from 'tesseract.js';

export const visionService = {
  analyzeImage: async (imageData: string | HTMLVideoElement, prompt?: string): Promise<string> => {
    // In a real app this would go to a VLM (Vision Language Model).
    // For this demonstration without API keys, we still mock the VLM part, 
    // but the OCR and audio systems are fully real.
    await new Promise((r) => setTimeout(r, 1500));
    
    if (prompt?.toLowerCase().includes("near me")) {
      return "You are in a well-lit hallway. Ahead is a door labeled 'Restroom'. To your right is a drinking fountain.";
    }

    return "I see a classroom entrance. There are three people talking near a wooden desk, and a sign on the wall next to the doorway.";
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
    await new Promise((r) => setTimeout(r, 1500));
    if (mode === 'STEP_BY_STEP') {
      return "1. Process started.\n2. Simplification applied.\n3. Output generated.";
    }
    if (mode === 'KEY_POINTS') {
      return "• Point A\n• Point B";
    }
    return "This is a simplified version of the text.";
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
