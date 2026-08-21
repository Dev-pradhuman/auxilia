// Mock AI services for demo purposes
// In a real app, these would call endpoints or on-device models.

export const visionService = {
  analyzeImage: async (imageData: string, prompt?: string): Promise<string> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1500));
    
    if (prompt?.toLowerCase().includes("near me")) {
      return "You are in a well-lit hallway. Ahead is a door labeled 'Restroom'. To your right is a drinking fountain.";
    }

    return "I see a classroom entrance. There are three people talking near a wooden desk, and a sign on the wall next to the doorway.";
  },
};

export const ocrService = {
  extractText: async (imageData: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 1200));
    return "PLEASE USE OTHER DOOR\n\nThis entrance is currently closed for maintenance. The nearest accessible entrance is located around the corner to the right.";
  },
};

export const speechService = {
  // We use Web Speech API in the UI, but this is a stub for advanced processing
  transcribeAudio: async (audioData: Blob): Promise<string> => {
    await new Promise((r) => setTimeout(r, 1000));
    return "Hello, how can I help you today?";
  }
};

export const ttsService = {
  // Actual TTS will be done via Web Speech API in the component, 
  // but if we used an AI service like ElevenLabs or OpenAI TTS:
  synthesizeSpeech: async (text: string): Promise<void> => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
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
      return "1. Go to the other door.\n2. Turn right around the corner to find the accessible entrance.";
    }
    if (mode === 'KEY_POINTS') {
      return "• Door closed for maintenance\n• Accessible entrance is to the right";
    }
    return "This door is closed. Please use the door around the corner to the right.";
  }
};

export const soundDetectionService = {
  startListening: (onSoundDetected: (sound: string, confidence: string) => void) => {
    // Simulate detecting a sound after 5 seconds for demo
    const timeout = setTimeout(() => {
      onSoundDetected("Fire Alarm", "LIKELY");
    }, 5000);
    return () => clearTimeout(timeout);
  }
};
